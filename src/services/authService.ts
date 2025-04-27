
import { config } from 'dotenv'
config() // Carga las variables de entorno

export const login = async (password: string) => {
  const correctPassword = process.env.ADMIN_PASSWORD

  if (password === correctPassword) {
    // Generar y devolver el token
    return { token: 'mi_token_de_autenticacion' }
  }

  throw new Error('Contraseña incorrecta')
}
