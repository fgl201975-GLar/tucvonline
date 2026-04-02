import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, supabase } from '../firebase/config'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      // Crear usuario en Supabase Auth
      const { user, error } = await auth.signUp(formData.email, formData.password)

      if (error) throw error
      if (!user) throw new Error('No se pudo crear el usuario')

      // Crear registro en la tabla usuarios
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert({
          id: user.id,
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (dbError) throw dbError

      // Redirigir al editor de perfil
      navigate('/profile/edit')
    } catch (error) {
      console.error('Error al registrar:', error)
      if (error.message?.includes('already')) {
        setError('Este email ya está registrado')
      } else if (error.message?.includes('weak')) {
        setError('Contraseña demasiado débil')
      } else if (error.message?.includes('invalid') || error.message?.includes('Email')) {
        setError('Dirección de correo inválida. Revísela por favor e intente nuevamente.')
      } else if (error.name === 'AuthApiError') {
        setError('Dirección de correo inválida. Revísela por favor e intente nuevamente.')
      } else {
        setError('Error al crear cuenta. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-2xl font-bold text-primary-600">TuCVOnline</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-600 mt-2">
            Regístrate gratis y comienza a crear tu CV
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-field"
                placeholder="Juan"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="input-field"
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
