import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, supabase } from '../firebase/config'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user)
        // Obtener datos del usuario
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data && !error) {
          setUserData(data)
        }
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const handleSignOut = async () => {
    await auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-xl font-bold text-primary-600">TuCVOnline</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hola, {user?.displayName || userData?.nombre}</span>
            <button onClick={handleSignOut} className="btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de Perfil */}
          <div className="card">
            <div className="text-center mb-4">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {userData?.foto_url ? (
                  <img src={userData.foto_url} alt="Foto" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <span className="text-3xl text-primary-600">
                    {userData?.nombre?.[0] || user?.email?.[0]}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold">{user?.displayName || 'Usuario'}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <Link to="/profile/edit" className="btn-primary w-full block text-center">
              Editar Perfil
            </Link>
          </div>

          {/* Estadísticas */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Visitas al perfil</span>
                <span className="font-semibold text-primary-600">{userData?.visitas || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CV completo</span>
                <span className="font-semibold text-green-600">
                  {userData?.experiencia?.length > 0 ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estado</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Activo
                </span>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Acciones</h3>
            <div className="space-y-3">
              <Link to="/profile/edit" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                📝 Editar CV
              </Link>
              <a href={`/profile/${user?.id}`} target="_blank" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                👁️ Ver CV Público
              </a>
              <button className="block w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
                📊 Ver Estadísticas
              </button>
            </div>
          </div>
        </div>

        {/* Sección de CV */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Tu Currículum</h3>
          {userData?.experiencia?.length > 0 || userData?.educacion?.length > 0 ? (
            <div className="space-y-4">
              {userData?.experiencia?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Experiencia Laboral</h4>
                  <div className="space-y-2">
                    {userData.experiencia.map((exp, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{exp.puesto}</p>
                        <p className="text-gray-600 text-sm">{exp.empresa}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {userData?.educacion?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Educación</h4>
                  <div className="space-y-2">
                    {userData.educacion.map((edu, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{edu.titulo}</p>
                        <p className="text-gray-600 text-sm">{edu.institucion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Aún no has completado tu CV</p>
              <Link to="/profile/edit" className="btn-primary">
                Completar CV Ahora
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
