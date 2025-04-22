import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'El Pastorcito',
  description: 'Tacos y antojitos a domicilio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br from-yellow-500 via-red-600 to-black/60 text-white`}>
        <Navbar />
           {/* Espaciador para el navbar */}
           <div className="h-[70px]" />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
