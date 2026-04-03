// Script para crear usuario admin en Supabase
// Ejecutar: node create-admin.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eizqjdhupihczirctsse.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpenFqZGh1cGloY3ppcmN0c3NlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA2ODM4MywiZXhwIjoyMDkwNjQ0MzgzfQ.SImnEQFlH7wiUvvgPsRVGlxxQivKq3FrjVqOEVu0VHY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const email = 'admin@tucvonline.com';
  const password = 'Admin123!';

  console.log('Creando usuario admin...');

  // Crear usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes('already')) {
      console.log('⚠️  El usuario ya existe. Intentando login...');
    } else {
      console.error('❌ Error al crear usuario:', authError.message);
      process.exit(1);
    }
  } else {
    console.log('✅ Usuario creado en Auth');
  }

  // Obtener el ID del usuario
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('❌ Error al listar usuarios:', usersError.message);
    process.exit(1);
  }

  const adminUser = users.users.find(u => u.email === email);

  if (!adminUser) {
    console.error('❌ No se encontró el usuario creado');
    process.exit(1);
  }

  console.log('✅ User ID:', adminUser.id);

  // Crear registro en tabla usuarios
  const { error: dbError } = await supabase
    .from('usuarios')
    .upsert({
      id: adminUser.id,
      email: email,
      nombre: 'Admin',
      apellido: 'TuCVOnline',
    });

  if (dbError) {
    console.error('❌ Error al crear perfil:', dbError.message);
    process.exit(1);
  }

  console.log('✅ Perfil creado en tabla usuarios');
  console.log('');
  console.log('═══════════════════════════════════');
  console.log('✅ ¡USUARIO ADMIN CREADO EXITOSAMENTE!');
  console.log('═══════════════════════════════════');
  console.log('');
  console.log('📧 Email: admin@tucvonline.com');
  console.log('🔑 Password: Admin123!');
  console.log('');
  console.log('Ahora podés iniciar sesión en tu web');
  console.log('');
}

createAdmin();
