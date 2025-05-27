import NextAuth from 'next-auth'

export default NextAuth({
  providers: [
    // Configura tus proveedores de autenticación aquí
  ],
  callbacks: {
    async session({ session, token }) {
      // Añade el rol del usuario a la sesión
      if (session.user) {
        session.user.role = typeof token.role === 'string' ? token.role : undefined
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    }
  }
})