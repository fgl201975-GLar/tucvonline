// Edge Function para registrar usuarios sin rate limits
// Esta función usa la service key para crear usuarios directamente

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método no permitido' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { email, password, nombre, apellido } = await req.json()

    // Validaciones básicas
    if (!email || !password || !nombre || !apellido) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'La contraseña debe tener al menos 6 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Crear cliente con service key (bypass rate limits)
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
    })

    if (authError) {
      if (authError.message.includes('already')) {
        return new Response(
          JSON.stringify({ error: 'Este email ya está registrado' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        )
      }
      throw authError
    }

    const userId = authData.user.id

    // Crear perfil en tabla usuarios
    const { error: dbError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        id: userId,
        email,
        nombre,
        apellido,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (dbError) {
      // Si falla la inserción, eliminar el usuario de auth
      await supabaseAdmin.auth.admin.deleteUser(userId)
      throw dbError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        message: 'Usuario creado exitosamente' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
