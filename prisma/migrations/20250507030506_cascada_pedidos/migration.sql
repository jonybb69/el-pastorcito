-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PedidoProducto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" REAL NOT NULL,
    CONSTRAINT "PedidoProducto_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PedidoProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PedidoProducto" ("cantidad", "id", "pedidoId", "precio", "productoId") SELECT "cantidad", "id", "pedidoId", "precio", "productoId" FROM "PedidoProducto";
DROP TABLE "PedidoProducto";
ALTER TABLE "new_PedidoProducto" RENAME TO "PedidoProducto";
CREATE TABLE "new_PedidoSalsa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productoPedidoId" INTEGER NOT NULL,
    "salsaId" INTEGER NOT NULL,
    CONSTRAINT "PedidoSalsa_productoPedidoId_fkey" FOREIGN KEY ("productoPedidoId") REFERENCES "PedidoProducto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PedidoSalsa_salsaId_fkey" FOREIGN KEY ("salsaId") REFERENCES "Salsa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PedidoSalsa" ("id", "productoPedidoId", "salsaId") SELECT "id", "productoPedidoId", "salsaId" FROM "PedidoSalsa";
DROP TABLE "PedidoSalsa";
ALTER TABLE "new_PedidoSalsa" RENAME TO "PedidoSalsa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
