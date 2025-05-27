'use client'
import { faInstagram, faTwitter, faYoutube, faTiktok, faWhatsapp, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-red-600 via-black to-yellow-600 text-white py-3 shadow-inner border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between">
        {/* Sección Izquierda - Copyright */}
        <div className="mb-2 sm:mb-1 text-xs sm:text-xs font-serif text-white/80 hover:text-white transition-colors">
          © {new Date().getFullYear()} El Pastorcito. Todos los derechos reservados.
        </div>

        {/* Sección Central - Redes Sociales */}
        <div className="flex space-x-2 sm:space-x-5 mb-2 sm:mb-1">
          <a href="https://www.instagram.com/elpastorcito/" target="_blank" rel="noopener noreferrer" 
             className="group relative transition-all duration-300 hover:-translate-y-1">
            <FontAwesomeIcon icon={faInstagram} 
              className="text-white h-4 w-4 group-hover:text-pink-500 group-hover:scale-150 transition-all" />
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">Instagram</span>
          </a>
          
          <a href="https://twitter.com/elpastorcito" target="_blank" rel="noopener noreferrer" 
             className="group relative transition-all duration-300 hover:-translate-y-1">
            <FontAwesomeIcon icon={faTwitter} 
              className="text-white h-4 w-4 group-hover:text-blue-400 group-hover:scale-150 transition-all" />
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">Twitter</span>
          </a>
          
          <a href="https://www.youtube.com/@elpastorcito" target="_blank" rel="noopener noreferrer" 
             className="group relative transition-all duration-300 hover:-translate-y-1">
            <FontAwesomeIcon icon={faYoutube} 
              className="text-white h-4 w-4 group-hover:text-red-500 group-hover:scale-150 transition-all" />
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">YouTube</span>
          </a>
          
          <a href="https://www.tiktok.com/@elpastorcito" target="_blank" rel="noopener noreferrer" 
             className="group relative transition-all duration-300 hover:-translate-y-1">
            <FontAwesomeIcon icon={faTiktok} 
              className="text-white h-4 w-4 group-hover:text-black group-hover:scale-150 transition-all" />
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">TikTok</span>
          </a>
          
          <a href="https://wa.me/5215541234567" target="_blank" rel="noopener noreferrer" 
             className="group relative transition-all duration-300 hover:-translate-y-1">
            <FontAwesomeIcon icon={faWhatsapp} 
              className="text-white h-4 w-4 group-hover:text-green-400 group-hover:scale-150 transition-all" />
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp</span>
          </a>
          
          <a href="https://www.facebook.com/elpastorcito/" target="_blank" rel="noopener noreferrer" 
             className="group relative transition-all duration-300 hover:-translate-y-1">
            <FontAwesomeIcon icon={faFacebook} 
              className="text-white h-4 w-4 group-hover:text-blue-600 group-hover:scale-150 transition-all" />
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">Facebook</span>
          </a>
        </div>

        {/* Sección Derecha - Eslogan */}
        <div className="text-justify sm:text-xs font-serif italic text-white/80 hover:text-white transition-colors">
          Hecho con ❤️ y tacos 🌮
        </div>
      </div>
    </footer>
  )
}