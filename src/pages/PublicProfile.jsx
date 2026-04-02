import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../firebase/config'

export default function PublicProfile() {
  const { userId } = useParams()
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', userId)
          .single()

        if (error || !data) {
          setNotFound(true)
          return
        }

        setUsuario(data)

        // Incrementar contador de visitas
        await supabase
          .from('usuarios')
          .update({ visitas: (data.visitas || 0) + 1 })
          .eq('id', userId)
      } catch (error) {
        console.error('Error al cargar perfil:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    cargarPerfil()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (notFound || !usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-4">Perfil no encontrado</p>
          <Link to="/" className="btn-primary">Volver al Inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-primary-200 hover:text-white mb-4 block">
            ← Volver a TuCVOnline
          </Link>
          <div className="flex items-center space-x-6">
            {usuario.foto_url ? (
              <img
                src={usuario.foto_url}
                alt={usuario.nombre}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold">
                  {usuario.nombre?.[0] || '?'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {usuario.nombre} {usuario.apellido}
              </h1>
              <p className="text-primary-100 text-lg">
                {usuario.ubicacion || 'Ubicación no especificada'}
              </p>
              {usuario.experiencia?.[0]?.puesto && (
                <p className="text-primary-200">
                  {usuario.experiencia[0].puesto}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del CV */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sobre Mí */}
            {usuario.sobre_mi && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">👤</span> Sobre Mí
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{usuario.sobre_mi}</p>
              </div>
            )}

            {/* Experiencia */}
            {usuario.experiencia && usuario.experiencia.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">💼</span> Experiencia Laboral
                </h2>
                <div className="space-y-4">
                  {usuario.experiencia.map((exp, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4">
                      <h3 className="font-semibold text-lg">{exp.puesto}</h3>
                      <p className="text-primary-600">{exp.empresa}</p>
                      <p className="text-sm text-gray-500">
                        {exp.fechaInicio && new Date(exp.fechaInicio).toLocaleDateString('es-UY', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {exp.fechaFin
                          ? new Date(exp.fechaFin).toLocaleDateString('es-UY', { month: 'short', year: 'numeric' })
                          : 'Actualidad'
                        }
                      </p>
                      {exp.descripcion && (
                        <p className="text-gray-700 mt-2 whitespace-pre-line">{exp.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educación */}
            {usuario.educacion && usuario.educacion.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">🎓</span> Educación
                </h2>
                <div className="space-y-4">
                  {usuario.educacion.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-lg">{edu.titulo}</h3>
                      <p className="text-green-600">{edu.institucion}</p>
                      <p className="text-sm text-gray-500">
                        {edu.fechaInicio && new Date(edu.fechaInicio).toLocaleDateString('es-UY', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {edu.fechaFin
                          ? new Date(edu.fechaFin).toLocaleDateString('es-UY', { month: 'short', year: 'numeric' })
                          : 'En curso'
                        }
                      </p>
                      {edu.descripcion && (
                        <p className="text-gray-700 mt-2 whitespace-pre-line">{edu.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Contacto */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">📧</span> Contacto
              </h2>
              <div className="space-y-3">
                {usuario.email && (
                  <a href={`mailto:${usuario.email}`} className="flex items-center text-gray-700 hover:text-primary-600">
                    <span className="mr-2">✉️</span> {usuario.email}
                  </a>
                )}
                {usuario.telefono && (
                  <a href={`tel:${usuario.telefono}`} className="flex items-center text-gray-700 hover:text-primary-600">
                    <span className="mr-2">📞</span> {usuario.telefono}
                  </a>
                )}
                {usuario.ubicacion && (
                  <div className="flex items-center text-gray-700">
                    <span className="mr-2">📍</span> {usuario.ubicacion}
                  </div>
                )}
                {usuario.linkedin && (
                  <a href={usuario.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-primary-600">
                    <span className="mr-2">💼</span> LinkedIn
                  </a>
                )}
                {usuario.sitio_web && (
                  <a href={usuario.sitio_web} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-primary-600">
                    <span className="mr-2">🌐</span> Sitio Web
                  </a>
                )}
              </div>
            </div>

            {/* Habilidades */}
            {usuario.habilidades && usuario.habilidades.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">⭐</span> Habilidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {usuario.habilidades.map((habilidad, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {habilidad}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Info del perfil */}
            <div className="card bg-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">ℹ️</span> Información
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Perfil visto:</strong> {usuario.visitas || 0} veces
                </p>
                <p>
                  <strong>Última actualización:</strong>
                  {usuario.updated_at
                    ? new Date(usuario.updated_at).toLocaleDateString('es-UY')
                    : 'No especificado'
                  }
                </p>
              </div>
            </div>

            {/* Botón de contacto */}
            <div className="card text-center">
              <a
                href={`mailto:${usuario.email}?subject=Interesado en tu perfil`}
                className="btn-primary w-full block"
              >
                📩 Contactar
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 TuCVOnline - Este CV es público y fue creado en TuCVOnline.com
          </p>
        </div>
      </footer>
    </div>
  )
}
