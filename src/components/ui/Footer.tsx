'use client'

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-red-600 via-black to-yellow-600 text-white py-4 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center text-sm">
        <p className="mb-2 sm:mb-0 font-medium drop-shadow-sm">
          © {new Date().getFullYear()} El Pastorcito. Todos los derechos reservados.
        </p>
        <p className="text-white/80">
          Hecho con ❤️ y tacos 🌮
        </p>
      </div>
    </footer>
  )
}
