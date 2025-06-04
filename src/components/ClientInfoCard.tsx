'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiEdit2, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';


export type Cliente = {
  nombre?: string;
  telefono?: string;
  direccion?: string; // Asegúrate de incluir la dirección si es necesario
};

type ClienteType = {
  cliente?: Cliente | null;
  resetCliente: () => void;
} | null;

type ClientInfoCardProps = {
  cliente: null | ClienteType;
  router: {
    push: (path: string) => void;
  };
}


const ClientInfoCard = ({ cliente, router }: ClientInfoCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  // Controlar el scroll para ajustar posición
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (expanded && !(e.target as HTMLElement).closest('.client-info-container')) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  return (
    <AnimatePresence>
      <motion.div
        className={`client-info-container fixed z-50 ${
          isScrolled ? 'top-4' : 'bottom-4'
        } left-1/5 transform -translate-x-1/2 w-[calc(28%-18px)] max-w-md`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1, 
          transition: { type: 'spring', damping: 20, stiffness: 300   
        }}}
        exit={{ y: 50, opacity: 0 }}
      >
        {/* Estado colapsado */}
        {!expanded && (
          <motion.div
            className="bg-gradient-to-r from-rose-800/20 to-white/20 backdrop-blur-sm p-3 rounded-lg border-0 shadow-xl hover:shadow-black border-black/30 cursor-pointer"
            onClick={() => setExpanded(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="p-2 bg-white/20 rounded-full">
                  <FiUser className="text-black" size={20} /> 
                </div>
                <div>
                  <p className="text-xl py-0 p-3 font-bold text-gray-800 truncate max-w-[180px]">
                    {cliente?.cliente?.nombre || 'Invitado'}
                  </p>
                  <p className="text-xs p-3 py-0 text-white/80">
                    {cliente?.cliente?.telefono || 'No registrado'}
                  </p>
                </div>
              </div>
              <div className="text-lg p-3 py-1 font-bold rounded-full text-black">
                {cliente && cliente.cliente ? 'Ver cuenta' : 'Iniciar sesión'}
              </div>
            </div>
          </motion.div>
        )}

        {/* Estado expandido */}
        {expanded && (
          <motion.div
            className="bg-gradient-to-br from-rose-700/40 to-teal-800/70 backdrop-blur-lg p-4 rounded-xl shadow-2xl border-2 border-rose-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 'auto', 
              transition: { type: 'spring', damping: 20, stiffness: 300 } 
            }}
            exit={{ opacity: 0, height: 0 }}
            
            layout
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-black/50 rounded-full">
                  <FiUser className="text-amber-500" size={20} />
                </div>
                <div>
                  <h3 className="text-mb p-2 font-light text-black">
                    Nombre:  {cliente && cliente.cliente?.nombre || 'Invitado'}
                  </h3>
                  <p className="text-mb p-1 font-ligth text-black">
                    Telefono:  {cliente && cliente.cliente?.telefono || 'No registrado'}
                  </p>
                  <p className="text-mb p-2 font-ligth   text-black">
                    Dirección:  {cliente && cliente.cliente?.direccion || 'No disponible'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setExpanded(false)}
                className="text-gray-800 hover:text-white p-1"
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 border-t py-4 px-4  border-gray-100 pt-6">
              {cliente && cliente.cliente ? (
                <>
                  <button
                    onClick={() => router.push('/clientes/perfil')}
                    className="w-full pt-2 flex items-center justify-between p-3 rounded-md hover:bg-black/30 shadow-xl hover:shadow-black transition-all"
                  >
                    <div className="flex px-5 items-center space-x-3">
                      <FiEdit2 className="text-green-400" />
                      <span className="text-sm text-white">Editar perfil</span>
                    </div>
                    <span className="text-xs text-gray-400">→</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      cliente.resetCliente();
                      router.push('/clientes/login');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-black/30 shadow-xl hover:shadow-black transition-all"
                  >
                    <div className="flex px-5 items-center space-x-3">
                      <FiLogOut className="text-rose-400" />
                      <span className="text-sm text-white">Cerrar sesión</span>
                    </div>
                    <span className="text-xs text-gray-400">→</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/clientes/login')}
                  className="w-full flex items-center justify-center p-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30 text-amber-400 transition-all"
                >
                  <span className="text-sm font-medium">Iniciar sesión</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ClientInfoCard;