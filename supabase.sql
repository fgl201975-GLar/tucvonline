-- ============================================
-- TU CV ONLINE - Configuración de Supabase
-- ============================================
-- Ejecuta esto en el SQL Editor de Supabase:
-- https://app.supabase.com/project/YOUR_PROJECT/sql
-- ============================================

-- 1. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT,
  apellido TEXT,
  telefono TEXT,
  ubicacion TEXT,
  linkedin TEXT,
  sitio_web TEXT,
  sobre_mi TEXT,
  foto_url TEXT,
  educacion JSONB DEFAULT '[]',
  experiencia JSONB DEFAULT '[]',
  habilidades JSONB DEFAULT '[]',
  visitas INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de seguridad

-- Cualquiera puede leer perfiles de usuario (públicos)
CREATE POLICY "Perfiles públicos son legibles por todos"
  ON usuarios
  FOR SELECT
  USING (true);

-- Usuarios autenticados pueden crear su propio perfil
CREATE POLICY "Usuarios pueden insertar su propio perfil"
  ON usuarios
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Usuarios autenticados pueden actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON usuarios
  FOR UPDATE
  USING (auth.uid() = id);

-- 4. Crear bucket para fotos de perfil
-- Esto también se puede hacer desde la UI de Supabase:
-- Storage → Create bucket → "fotos" → Public bucket

-- 5. Políticas para el bucket de fotos
-- (Esto se configura en la UI de Storage, pero aquí está el SQL)

-- ============================================
-- INSTRUCCIONES ADICIONALES:
-- ============================================
-- 1. Ve a SQL Editor en Supabase
-- 2. Copia y pega este código
-- 3. Ejecuta todo
-- 4. Luego ve a Storage y crea un bucket llamado "fotos"
-- 5. Hazlo público para que las fotos sean visibles
-- ============================================
