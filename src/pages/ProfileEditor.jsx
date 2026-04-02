import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, supabase } from '../firebase/config'

export default function ProfileEditor() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [fotoFile, setFotoFile] = useState(null)

  const [formData, setFormData] = useState({
    telefono: '',
    ubicacion: '',
    linkedin: '',
    sitioWeb: '',
    sobreMi: '',
    educacion: [],
    experiencia: [],
    habilidades: [],
    foto_url: ''
  })

  const [tempEdu, setTempEdu] = useState({ titulo: '', institucion: '', fechaInicio: '', fechaFin: '', descripcion: '' })
  const [tempExp, setTempExp] = useState({ puesto: '', empresa: '', fechaInicio: '', fechaFin: '', descripcion: '' })
  const [tempHabilidad, setTempHabilidad] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login')
        return
      }
      setUser(user)

      // Cargar datos existentes
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data && !error) {
        setFormData({
          telefono: data.telefono || '',
          ubicacion: data.ubicacion || '',
          linkedin: data.linkedin || '',
          sitioWeb: data.sitioWeb || '',
          sobreMi: data.sobreMi || '',
          educacion: data.educacion || [],
          experiencia: data.experiencia || [],
          habilidades: data.habilidades || [],
          foto_url: data.foto_url || ''
        })
        setFotoPreview(data.foto_url || null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadFoto = async () => {
    if (!fotoFile) return formData.foto_url

    const path = `${user.id}/${Date.now()}_${fotoFile.name}`
    const { data, error } = await supabase.storage
      .from('fotos')
      .upload(path, fotoFile, { upsert: true })

    if (error) throw error

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('fotos')
      .getPublicUrl(path)

    return urlData.publicUrl
  }

  const addEducacion = () => {
    if (tempEdu.titulo && tempEdu.institucion) {
      setFormData({
        ...formData,
        educacion: [...formData.educacion, { ...tempEdu, id: Date.now() }]
      })
      setTempEdu({ titulo: '', institucion: '', fechaInicio: '', fechaFin: '', descripcion: '' })
    }
  }

  const removeEducacion = (id) => {
    setFormData({
      ...formData,
      educacion: formData.educacion.filter(e => e.id !== id)
    })
  }

  const addExperiencia = () => {
    if (tempExp.puesto && tempExp.empresa) {
      setFormData({
        ...formData,
        experiencia: [...formData.experiencia, { ...tempExp, id: Date.now() }]
      })
      setTempExp({ puesto: '', empresa: '', fechaInicio: '', fechaFin: '', descripcion: '' })
    }
  }

  const removeExperiencia = (id) => {
    setFormData({
      ...formData,
      experiencia: formData.experiencia.filter(e => e.id !== id)
    })
  }

  const addHabilidad = () => {
    if (tempHabilidad && !formData.habilidades.includes(tempHabilidad)) {
      setFormData({
        ...formData,
        habilidades: [...formData.habilidades, tempHabilidad]
      })
      setTempHabilidad('')
    }
  }

  const removeHabilidad = (habilidad) => {
    setFormData({
      ...formData,
      habilidades: formData.habilidades.filter(h => h !== habilidad)
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addHabilidad()
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const fotoUrl = await uploadFoto()

      const userData = {
        telefono: formData.telefono,
        ubicacion: formData.ubicacion,
        linkedin: formData.linkedin,
        sitioWeb: formData.sitioWeb,
        sobreMi: formData.sobreMi,
        educacion: formData.educacion,
        experiencia: formData.experiencia,
        habilidades: formData.habilidades,
        foto_url: fotoUrl,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('usuarios')
        .update(userData)
        .eq('id', user.id)

      if (error) throw error

      alert('¡Perfil guardado exitosamente!')
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar. Intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  const steps = [
    { title: 'Datos Personales', icon: '👤' },
    { title: 'Educación', icon: '🎓' },
    { title: 'Experiencia', icon: '💼' },
    { title: 'Habilidades', icon: '⭐' },
    { title: 'Resumen', icon: '✅' }
  ]

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
          <Link to="/dashboard" className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-xl font-bold text-primary-600">TuCVOnline</span>
          </Link>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Volver al Panel
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar tu CV</h1>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${activeStep === index
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <span>{step.icon}</span>
                <span className="hidden md:inline">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div className="card max-w-3xl mx-auto">
          {/* Paso 1: Datos Personales */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">👤 Datos Personales</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto de Perfil
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {fotoPreview ? (
                      <img src={fotoPreview} alt="Foto" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl text-gray-400">
                        {formData.nombre?.[0] || user?.email?.[0]}
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="input-field max-w-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+598 99 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Montevideo, Uruguay"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://linkedin.com/in/tu-perfil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio Web / Portafolio
                </label>
                <input
                  type="url"
                  name="sitioWeb"
                  value={formData.sitioWeb}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://tu-sitio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sobre Mí
                </label>
                <textarea
                  name="sobreMi"
                  value={formData.sobreMi}
                  onChange={handleChange}
                  className="input-field h-32"
                  placeholder="Cuéntame sobre tu perfil profesional, tus objetivos y lo que te hace único..."
                />
              </div>
            </div>
          )}

          {/* Paso 2: Educación */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">🎓 Educación</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={tempEdu.titulo}
                    onChange={(e) => setTempEdu({ ...tempEdu, titulo: e.target.value })}
                    className="input-field"
                    placeholder="Ingeniero en Sistemas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institución
                  </label>
                  <input
                    type="text"
                    value={tempEdu.institucion}
                    onChange={(e) => setTempEdu({ ...tempEdu, institucion: e.target.value })}
                    className="input-field"
                    placeholder="Universidad de la República"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="month"
                    value={tempEdu.fechaInicio}
                    onChange={(e) => setTempEdu({ ...tempEdu, fechaInicio: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="month"
                    value={tempEdu.fechaFin}
                    onChange={(e) => setTempEdu({ ...tempEdu, fechaFin: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={tempEdu.descripcion}
                  onChange={(e) => setTempEdu({ ...tempEdu, descripcion: e.target.value })}
                  className="input-field h-20"
                  placeholder="Descripción de tu formación..."
                />
              </div>

              <button type="button" onClick={addEducacion} className="btn-secondary w-full">
                + Agregar Educación
              </button>

              {formData.educacion.length > 0 && (
                <div className="space-y-2 mt-4">
                  {formData.educacion.map((edu) => (
                    <div key={edu.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{edu.titulo}</p>
                        <p className="text-gray-600 text-sm">{edu.institucion}</p>
                      </div>
                      <button
                        onClick={() => removeEducacion(edu.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paso 3: Experiencia */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">💼 Experiencia Laboral</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Puesto
                  </label>
                  <input
                    type="text"
                    value={tempExp.puesto}
                    onChange={(e) => setTempExp({ ...tempExp, puesto: e.target.value })}
                    className="input-field"
                    placeholder="Desarrollador Senior"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={tempExp.empresa}
                    onChange={(e) => setTempExp({ ...tempExp, empresa: e.target.value })}
                    className="input-field"
                    placeholder="Empresa S.A."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="month"
                    value={tempExp.fechaInicio}
                    onChange={(e) => setTempExp({ ...tempExp, fechaInicio: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="month"
                    value={tempExp.fechaFin}
                    onChange={(e) => setTempExp({ ...tempExp, fechaFin: e.target.value })}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">Dejar vacío si es el trabajo actual</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={tempExp.descripcion}
                  onChange={(e) => setTempExp({ ...tempExp, descripcion: e.target.value })}
                  className="input-field h-20"
                  placeholder="Descripción de tus responsabilidades y logros..."
                />
              </div>

              <button type="button" onClick={addExperiencia} className="btn-secondary w-full">
                + Agregar Experiencia
              </button>

              {formData.experiencia.length > 0 && (
                <div className="space-y-2 mt-4">
                  {formData.experiencia.map((exp) => (
                    <div key={exp.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{exp.puesto}</p>
                        <p className="text-gray-600 text-sm">{exp.empresa}</p>
                      </div>
                      <button
                        onClick={() => removeExperiencia(exp.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paso 4: Habilidades */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">⭐ Habilidades</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agregar Habilidad
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tempHabilidad}
                    onChange={(e) => setTempHabilidad(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input-field flex-1"
                    placeholder="Ej: JavaScript, React, Python, Liderazgo..."
                  />
                  <button type="button" onClick={addHabilidad} className="btn-primary">
                    Agregar
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Presiona Enter o clic en Agregar</p>
              </div>

              {formData.habilidades.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.habilidades.map((habilidad) => (
                    <span
                      key={habilidad}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full flex items-center space-x-1"
                    >
                      <span>{habilidad}</span>
                      <button
                        onClick={() => removeHabilidad(habilidad)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paso 5: Resumen */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">✅ Resumen de tu CV</h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Datos Personales</h3>
                  <p className="text-gray-600 text-sm">
                    {formData.telefono && `📞 ${formData.telefono}`}
                    {formData.ubicacion && ` | 📍 ${formData.ubicacion}`}
                  </p>
                  {formData.linkedin && <p className="text-gray-600 text-sm mt-2">🔗 {formData.linkedin}</p>}
                  {formData.sobreMi && <p className="text-gray-600 text-sm mt-2">{formData.sobreMi}</p>}
                </div>

                {formData.educacion.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">🎓 Educación ({formData.educacion.length})</h3>
                    {formData.educacion.map((edu, i) => (
                      <p key={i} className="text-gray-600 text-sm">
                        • {edu.titulo} - {edu.institucion}
                      </p>
                    ))}
                  </div>
                )}

                {formData.experiencia.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">💼 Experiencia ({formData.experiencia.length})</h3>
                    {formData.experiencia.map((exp, i) => (
                      <p key={i} className="text-gray-600 text-sm">
                        • {exp.puesto} - {exp.empresa}
                      </p>
                    ))}
                  </div>
                )}

                {formData.habilidades.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">⭐ Habilidades ({formData.habilidades.length})</h3>
                    <div className="flex flex-wrap gap-1">
                      {formData.habilidades.map((h, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                className="btn-primary"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? 'Guardando...' : '💾 Guardar CV'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
