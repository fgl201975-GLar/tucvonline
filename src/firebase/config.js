import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = 'https://eizqjdhupihczirctsse.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpenFqZGh1cGloY3ppcmN0c3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjgzODMsImV4cCI6MjA5MDY0NDM4M30.L91DZuF45QVW2FrxAAOGnq3CxOAGJhnyUDNuzjf6ty8'

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)

// Exportar servicios compatibles
export const auth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { user: data.user, error }
  },
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { user: data.user, error }
  },
  signOut: async () => {
    await supabase.auth.signOut()
  },
  onAuthStateChanged: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
    return () => subscription.unsubscribe()
  },
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

// Base de datos (usando tablas directamente)
export const db = {
  collection: (tableName) => ({
    doc: (id) => ({
      set: async (data, options = {}) => {
        if (options.merge) {
          // Actualizar existente
          const { error } = await supabase
            .from(tableName)
            .update(data)
            .eq('id', id)
          return { error }
        } else {
          // Crear nuevo
          const { error } = await supabase
            .from(tableName)
            .upsert({ id, ...data })
          return { error }
        }
      },
      get: async () => ({
        data: await supabase.from(tableName).select('*').eq('id', id).single()
      }),
      update: async (data) => {
        const { error } = await supabase
          .from(tableName)
          .update(data)
          .eq('id', id)
        return { error }
      }
    })
  })
}

// Storage para fotos
export const storage = {
  ref: (path) => ({
    put: async (file) => {
      const { data, error } = await supabase.storage
        .from('fotos')
        .upload(path, file, { upsert: true })
      return { data, error }
    }
  }),
  from: (bucket) => ({
    download: async (path) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path)
      return { data, error }
    },
    getPublicUrl: (path) => {
      const { data } = supabase.storage
        .from('fotos')
        .getPublicUrl(path)
      return data.publicUrl
    }
  })
}

export default supabase
