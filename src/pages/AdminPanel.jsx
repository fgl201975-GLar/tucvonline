import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, supabase } from '../firebase/config'

export default function AdminPanel() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState([])
  const [filtro, setFiltro] = useState('')
  const [filtroHabilidad, setFiltroHabilidad] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login')
        return
      }

      // Verificar si es admin
      if (!user.email.includes('@tucvonline.com')) {
        navigate('/dashboard')
        return
      }

      setUser(user)
      await cargarUsuarios()
      setLoading(false)
    })
    return unsubscribe
  }, [navigate])

  const cargarUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsuarios(data || [])
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    }
  }

  const handleSignOut = async () => {
    await auth.signOut()
    window.location.href = '/'
  }

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(u => {
    const nombreCompleto = `${u.nombre || ''} ${u.apellido || ''}`.toLowerCase()
    const emailMatch = (u.email || '').toLowerCase().includes(filtro.toLowerCase())
    const nombreMatch = nombreCompleto.includes(filtro.toLowerCase())
    const habilidadMatch = filtroHabilidad
      ? (u.habilidades || []).some(h => h.toLowerCase().includes(filtroHabilidad.toLowerCase()))
      : true

    return (emailMatch || nombreMatch) && habilidadMatch
  })

  // Estadísticas
  const totalUsuarios = usuarios.length
  const conExperiencia = usuarios.filter(u => (u.experiencia || []).length > 0).length
  const conFoto = usuarios.filter(u => u.foto_url).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔐</span>
            <span className="text-xl font-bold text-gray-900">Panel de Administración</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.email}</span>
            <button onClick={handleSignOut} className="btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de CVs</h1>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-3xl font-bold text-primary-600">{totalUsuarios}</div>
            <div className="text-gray-600">Total Usuarios</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-green-600">{conExperiencia}</div>
            <div className="text-gray-600">Con Experiencia</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-blue-600">{conFoto}</div>
            <div className="text-gray-600">Con Foto</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-purple-600">
              {totalUsuarios > 0 ? Math.round((conExperiencia / totalUsuarios) * 100) : 0}%
            </div>
            <div className="text-gray-600">CVs Completos</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">🔍 Buscar y Filtrar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar por nombre o email
              </label>
              <input
                type="text"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="input-field"
                placeholder="Juan Pérez o juan@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por habilidad
              </label>
              <input
                type="text"
                value={filtroHabilidad}
                onChange={(e) => setFiltroHabilidad(e.target.value)}
                className="input-field"
                placeholder="JavaScript, React, Ventas..."
              />
            </div>
          </div>
        </div>

        {/* Lista de Usuarios */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            👥 Usuarios ({usuariosFiltrados.length})
          </h2>

          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No se encontraron usuarios
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Usuario</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contacto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ubicación</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Habilidades</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">CV</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          {usuario.foto_url ? (
                            <img src={usuario.foto_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-semibold">
                                {usuario.nombre?.[0] || usuario.email?.[0]}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
                            <p className="text-sm text-gray-500">{usuario.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {usuario.telefono || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {usuario.ubicacion || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(usuario.habilidades || []).slice(0, 3).map((h, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded">
                              {h}
                            </span>
                          ))}
                          {(usuario.habilidades || []).length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                              +{(usuario.habilidades || []).length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${(usuario.experiencia || []).length > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {(usuario.experiencia || []).length > 0 ? 'Completo' : 'Incompleto'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <a
                            href={`/profile/${usuario.id}`}
                            target="_blank"
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                          >
                            Ver CV
                          </a>
                          <a
                            href={`mailto:${usuario.email}`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Email
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
