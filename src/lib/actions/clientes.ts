export async function getClientePorTelefono(telefono: string) {
    const res = await fetch(`/api/clientes?telefono=${telefono}`)
    return await res.json()
  }
  
  export async function crearCliente(data: {
    nombre: string
    telefono: string
    direccion: string
  }) {
    const res = await fetch('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return await res.json()
  }
  