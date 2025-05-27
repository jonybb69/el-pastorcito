
import { toast } from "sonner";

type Cliente = {
  id: string;
  destacado: boolean;
  // agrega aquí otras propiedades relevantes de 'cliente'
};

export const toggleDestacado = async (
  id: string,
  clientes: Cliente[],
  setClientes: (clientes: Cliente[]) => void
) => {
  try {
    const response = await fetch(`/api/clientes/${id}/destacado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Error en la respuesta')
    }

    const clienteActualizado = await response.json()
    
    // Actualizar el estado local
    setClientes(clientes.map(cliente => 
      cliente.id === id ? clienteActualizado : cliente
    ))
    
    toast.success(
      clienteActualizado.destacado 
        ? 'Cliente marcado como destacado ★' 
        : 'Cliente removido de destacados'
    )
    
  } catch {
    toast.error('Error al actualizar el estado destacado')
  }
}