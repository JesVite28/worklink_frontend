import { useState } from 'react'

export default function App() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Contenedor principal */}
      <div className="relative z-10 text-center">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`transform transition-all duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        >
          {/* Tarjeta */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 md:p-20 shadow-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300">
            {/* Icono decorativo */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">👋</span>
              </div>
            </div>

            {/* Texto principal */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
              ¡Hola Mundo!
            </h1>

            {/* Subtítulo */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-md mx-auto">
              Bienvenido a tu proyecto con{' '}
              <span className="font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                React & Tailwind CSS
              </span>
            </p>

            {/* Descripción */}
            <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto">
              Un componente hermoso y moderno construido con tecnologías modernas
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
                Empezar
              </button>
              <button className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold text-white border border-white/30 transition-all duration-300 backdrop-blur-sm">
                Aprender Más
              </button>
            </div>
          </div>

          {/* Efecto de brillo inferior */}
          <div className="mt-8 h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-purple-400 to-transparent blur-sm opacity-60"></div>
        </div>

        {/* Texto inferior */}
        <p className="text-gray-500 text-sm mt-12">
          Hover sobre la tarjeta para ver el efecto
        </p>
      </div>
    </div>
  )
}
