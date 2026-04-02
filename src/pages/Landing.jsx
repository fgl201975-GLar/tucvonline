import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header / Nav */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <span className="text-2xl font-bold text-primary-600">TuCVOnline</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="btn-primary">
            Crear CV Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Tu futuro comienza con un
          <span className="text-primary-600"> CV profesional</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Crea tu currículum online de forma gratuita y conecta con las mejores 
          oportunidades laborales en Uruguay.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Comenzar Ahora
          </Link>
          <a href="#como-funciona" className="btn-secondary text-lg px-8 py-3">
            Saber Más
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">+1000</div>
              <div className="text-primary-100">CVs Creados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">+500</div>
              <div className="text-primary-100">Empresas Conectadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">+80%</div>
              <div className="text-primary-100">Consiguió Empleo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section id="como-funciona" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          ¿Cómo funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Regístrate Gratis</h3>
            <p className="text-gray-600">
              Crea tu cuenta en segundos y accede a nuestra plataforma.
            </p>
          </div>
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Completa tu CV</h3>
            <p className="text-gray-600">
              Agrega tu información, experiencia, estudios y foto de perfil.
            </p>
          </div>
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Conecta con Empresas</h3>
            <p className="text-gray-600">
              Haz tu CV visible para reclutadores y recibe oportunidades.
            </p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegir TuCVOnline?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Fácil de usar', desc: 'Interfaz intuitiva y sencilla' },
              { icon: '🔒', title: 'Seguro', desc: 'Tus datos están protegidos' },
              { icon: '📱', title: 'Responsive', desc: 'Accede desde cualquier dispositivo' },
              { icon: '⭐', title: 'Gratis', desc: 'Sin costos ocultos' },
            ].map((item, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¿Listo para impulsar tu carrera?
        </h2>
        <p className="text-gray-600 mb-8">
          Únete a miles de profesionales que ya encontraron oportunidades con TuCVOnline.
        </p>
        <Link to="/register" className="btn-primary text-lg px-8 py-3">
          Crear mi CV Gratis
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-xl font-bold">TuCVOnline</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 TuCVOnline. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
