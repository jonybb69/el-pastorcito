import { NextApiRequest, NextApiResponse } from 'next'

// Suponiendo que el pedido es un objeto enviado al backend
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { pedido } = req.body

      // Aquí procesamos el pedido, por ejemplo, lo guardamos en la base de datos

      // Redirigir al administrador después de crear el pedido
      res.status(200).json({ message: 'Pedido enviado correctamente' })

    } catch (error) {
      res.status(500).json({ message: 'Hubo un error al enviar el pedido' })
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' })
  }
}
