import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {  // ¡Key cambiada!
    resolveAlias: {
      "~/*": ["./src/*"]
    }
  },
  // ...resto de config
}

export default nextConfig;