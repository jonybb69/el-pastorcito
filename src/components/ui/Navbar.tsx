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
          animate={{ y: 3 }}
          exit={{ y: -100 }}
          transition={{ duration: 1 }}
          className="fixed top-0 left-0 w-full z-50 bg-gradient-to-br from-red-500 via-black to-yellow-500 text-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="El Pastorcito Logo"
                width={44}
                height={44}
                className="rounded-full border border-yellow-500 shadow"
              />
              <span className="text-lg sm:text-xl font-bold text-yellow-400 drop-shadow-sm">
                El Pastorcito 🌮
              </span>
            </Link>
            <div className="space-x-4 text-sm sm:text-base">
              <Link
                href="/pedido"
                className={`hover:text-yellow-400 transition ${
                  pathname === '/pedido' ? 'text-yellow-400 font-semibold' : 'text-white'
                }`}
              >
                Menú
              </Link>
              <Link
                href="/resumen"
                className={`hover:text-yellow-400 transition ${
                  pathname === '/resumen' ? 'text-yellow-400 font-semibold' : 'text-white'
                }`}
              >
                Resumen
              </Link>
              <Link
                href="/admin"
                className={`hover:text-yellow-400 transition ${
                  pathname === '/admin' ? 'text-yellow-400 font-semibold' : 'text-white'
                }`}
              >
                Admin
              </Link>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
