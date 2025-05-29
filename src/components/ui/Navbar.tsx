'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isAdminSection, setIsAdminSection] = useState(false)

  // Efecto para detectar si estamos en la sección de admin
  useEffect(() => {
    setIsAdminSection(pathname.startsWith('/admin'))
  }, [pathname])

  // Efecto para ocultar/mostrar navbar al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`fixed rounded-lg top-1 left-0 w-full z-50 ${
            isAdminSection 
              ? 'bg-gradient-to-br from-rose-600 via-black to-yellow-700' 
              : ' bg-gradient-to-br from-rose-600 via-black to-yellow-700'
          } text-black shadow-xl`}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="El Pastorcito Logo"
                width={44}
                height={44}
                className="rounded-full border-2 border-white shadow-lg"
                priority
              />
              <span className="text-lg sm:text-xl font-bold text-gray-100 transition-colors drop-shadow-lg">
                El Pastorcito 🌮
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {isAdminSection ? (
                <>
                  <Link
                    href="/admin/mesas"
                    className={`px-3 py-2 text-white shadow-xl hover:shadow-black rounded-lg font-normal transition-all ${
                      pathname === '/admin/nueva-mesa'
                        ? 'bg-yellow-500 text-black shadow-md'
                        : 'bg-cyan-900/90 hover:bg-cyan-800/90'
                    }`}
                  >
                    Nueva Mesa
                  </Link>
                  <Link
                    href="/admin/reparto"
                    className={`px-3 py-2 text-white shadow-xl hover:shadow-black rounded-lg font-normal transition-all ${
                      pathname === '/admin/reparto'
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'bg-cyan-900/90 hover:bg-cyan-800/90'
                    }`}
                  >
                    Reparto
                  </Link>
                </>
              ) : (
                <Link
                  href="/admin"
                  className={`px-3 py-2 text-white rounded-lg shadow-xl hover:shadow-black font-normal transition-all ${
                    pathname === '/admin'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-cyan-900/90 hover:bg-cyan-800'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}