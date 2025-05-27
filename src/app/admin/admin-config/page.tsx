/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useConfigStore } from "@/store/useConfigStore"
import { useEffect, useState } from "react"
import { FiSave, FiEye, FiEyeOff, FiDroplet, FiType, FiLayout, FiGlobe, FiNavigation, FiMenu, FiItalic, FiInbox, FiTablet, FiAirplay, FiKey, FiTarget, FiTool, FiUser, FiLayers, FiClipboard, FiFileText, FiSettings } from "react-icons/fi"
import { toast } from "sonner"

export default function AdminConfig() {
  const {
    theme,
    primaryColor,
    secondaryColor,
    backgroundColor,
    textColor,
    fontFamily,
    fontSize,
    borderRadius,
    navbarConfig,
    footerConfig,
    loginConfig,
    menuConfig,
    ticketConfig,
    setTheme,
    setPrimaryColor,
    setSecondaryColor,
    setBackgroundColor,
    setTextColor,
    setFontFamily,
    setFontSize,
    setBorderRadius,
    setNavbarConfig,
    setFooterConfig,
    setLoginConfig,
    setMenuConfig,
    setTicketConfig,
    saveConfig
  } = useConfigStore()

  const [activeTab, setActiveTab] = useState('general')
  const [isPreviewVisible, setIsPreviewVisible] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Aplicar cambios en tiempo real al documento
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor)
    document.documentElement.style.setProperty('--secondary', secondaryColor)
    document.documentElement.style.setProperty('--background', backgroundColor)
    document.documentElement.style.setProperty('--text', textColor)
    document.documentElement.style.setProperty('--font-family', fontFamily)
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`)
    document.documentElement.style.setProperty('--border-radius', `${borderRadius}px`)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme, primaryColor, secondaryColor, backgroundColor, textColor, fontFamily, fontSize, borderRadius])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveConfig()
      toast.success('Configuración guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar la configuración')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen rounded-lg bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-green-400 dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-600 dark:border-pink-700">
          <h2 className="text-xl text-black font-bold flex items-center gap-2">
            <FiSettings /> Configuración
          </h2>
        </div>
        <nav className="p-4">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full text-left p-3 rounded-lg flex items-center gap-2 mb-1 ${activeTab === 'general' ? 'bg-primary-100 dark:bg-primary-900 text-black dark:text-primary-700' : 'hover:bg-gray-400 dark:hover:bg-gray-700'}`}
          >
            <FiTool /> General
          </button>
          <button
            onClick={() => setActiveTab('navbar')}
            className={`w-full text-left p-3 rounded-lg flex items-center gap-2 mb-1 ${activeTab === 'navbar' ? 'bg-primary-100 dark:bg-primary-900 text-black dark:text-primary-200' : 'hover:bg-gray-400 dark:hover:bg-gray-700'}`}
          >
            <FiLayout /> Navbar
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`w-full text-left p-3 rounded-lg flex items-center gap-2 mb-1 ${activeTab === 'login' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-200' : 'hover:bg-gray-400 dark:hover:bg-gray-700'}`}
          >
            <FiUser /> Login
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`w-full text-left p-3 rounded-lg flex items-center gap-2 mb-1 ${activeTab === 'menu' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-200' : 'hover:bg-gray-400 dark:hover:bg-gray-700'}`}
          >
            <FiLayers /> Menú
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`w-full text-left p-3 rounded-lg flex items-center gap-2 mb-1 ${activeTab === 'tickets' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-200' : 'hover:bg-gray-400 dark:hover:bg-gray-700'}`}
          >
            <FiFileText /> Ticket
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-evenly items-center mb-8">
            <h1 className="text-3xl justify-self-end text-black font-bold">Configuración de la aplicación</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                className="flex items-center text-black gap-2 px-4 py-2 bg-yellow-600/70 dark:bg-gray-700 hover:bg-black/50 rounded-lg"
              >
                {isPreviewVisible ? <FiEyeOff /> : <FiEye />}
                {isPreviewVisible ? 'Ocultar vista previa' : 'Mostrar vista previa'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600/70 text-black rounded-lg hover:bg-black/50 disabled:opacity-50"
              >
                <FiSave /> {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-black/70 dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><FiDroplet /> Colores</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Tema</label>
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700"
                      >
                        <option value="light">Claro</option>
                        <option value="dark">Oscuro</option>
                        <option value="system">Sistema</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Color primario</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-12 rounded border"
                        />
                        <span className="text-sm">{primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1">Color secundario</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-12 h-12 rounded border"
                        />
                        <span className="text-sm">{secondaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1">Color de fondo</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-12 h-12 rounded border"
                        />
                        <span className="text-sm">{backgroundColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1">Color de texto</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-12 h-12 rounded border"
                        />
                        <span className="text-sm">{textColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-black/70 dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><FiType /> Tipografía</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Familia de fuente</label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Tamaño base (px)</label>
                      <input
                        type="range"
                        min="12"
                        max="20"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center">{fontSize}px</div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/70 dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><FiLayout /> Estilos</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Radio de bordes (px)</label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center">{borderRadius}px</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navbar Settings */}
          {activeTab === 'navbar' && (
            <div className="bg-black dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Configuración del Navbar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1">Color de fondo</label>
                  <input
                    type="color"
                    value={navbarConfig.backgroundColor}
                    onChange={(e) => setNavbarConfig({ ...navbarConfig, backgroundColor: e.target.value })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                <div>
                  <label className="block mb-1">Color de texto</label>
                  <input
                    type="color"
                    value={navbarConfig.textColor}
                    onChange={(e) => setNavbarConfig({ ...navbarConfig, textColor: e.target.value })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                <div>
                  <label className="block mb-1">Altura (px)</label>
                  <input
                    type="number"
                    value={navbarConfig.height}
                    onChange={(e) => setNavbarConfig({ ...navbarConfig, height: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-1">Mostrar logo</label>
                  <select
                    value={navbarConfig.showLogo ? 'true' : 'false'}
                    onChange={(e) => setNavbarConfig({ ...navbarConfig, showLogo: e.target.value === 'true' })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Vista previa */}
          {isPreviewVisible && (
            <div className="mt-8 bg-black/60 dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Vista previa</h3>
              <div className="space-y-6">
                {activeTab === 'general' && (
                  <>
                    <div className="flex gap-4">
                      <button className="px-4 py-2 hover:bg-pink-400 rounded" style={{ backgroundColor: primaryColor, color: textColor }}>
                        Botón primario
                      </button>
                      <button className="px-4 py-2 hover:bg-pink-400 rounded" style={{ backgroundColor: secondaryColor, color: textColor }}>
                        Botón secundario
                      </button>
                    </div>
                    <div className="p-4 rounded" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                      <p className="font-medium">Tarjeta de ejemplo</p>
                      <p className="text-sm opacity-80">Texto secundario</p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Título de ejemplo</h4>
                      <p className="mb-4">Este es un párrafo de ejemplo con el estilo de tipografía seleccionado.</p>
                      <a href="#" style={{ color: primaryColor }}>Enlace de ejemplo</a>
                    </div>
                  </>
                )}
                {activeTab === 'navbar' && (
                  <div className="w-full" style={{ height: `${navbarConfig.height}px`, backgroundColor: navbarConfig.backgroundColor, color: navbarConfig.textColor }}>
                    <div className="flex items-center h-full px-4">
                      {navbarConfig.showLogo && <div className="font-bold mr-4">LOGO</div>}
                      <nav className="flex gap-4">
                        <a href="#">Inicio</a>
                        <a href="#">Menú</a>
                        <a href="#">Contacto</a>
                      </nav>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}