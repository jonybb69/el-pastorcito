/*
  Warnings:

  - Added the required column `salsas` to the `PedidoProducto` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PedidoProducto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "salsas" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    CONSTRAINT "PedidoProducto_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PedidoProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PedidoProducto" ("cantidad", "id", "pedidoId", "precio", "productoId") SELECT "cantidad", "id", "pedidoId", "precio", "productoId" FROM "PedidoProducto";
DROP TABLE "PedidoProducto";
ALTER TABLE "new_PedidoProducto" RENAME TO "PedidoProducto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
