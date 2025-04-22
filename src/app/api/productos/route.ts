import { NextResponse } from "next/server"

const productos = [
  { id: "1", nombre: "Taco al pastor", descripcion: "Con piña y cebolla", precio: 18 },
  { id: "2", nombre: "Gringa", descripcion: "Tortilla de harina con queso", precio: 25 }
]

export async function GET() {
  return NextResponse.json(productos)
}

export async function POST(req: Request) {
  const nuevoProducto = await req.json()
  // Aquí guardarías en BD real
  return NextResponse.json({ mensaje: "Producto creado", data: nuevoProducto })
}
