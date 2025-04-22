import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Une clases condicionales (con clsx) y resuelve conflictos de Tailwind (con tailwind-merge).
 * Ejemplo:
 *   cn("bg-red-500", isActive && "text-white")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
