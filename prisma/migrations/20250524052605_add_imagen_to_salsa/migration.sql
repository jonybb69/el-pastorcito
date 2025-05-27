/*
  Warnings:

  - Added the required column `imagen` to the `Salsa` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Salsa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "nivelPicor" TEXT,
    "imagen" TEXT NOT NULL
);
INSERT INTO "new_Salsa" ("id", "nivelPicor", "nombre") SELECT "id", "nivelPicor", "nombre" FROM "Salsa";
DROP TABLE "Salsa";
ALTER TABLE "new_Salsa" RENAME TO "Salsa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
