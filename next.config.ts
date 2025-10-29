import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo le decimos a Next.js que estos paquetes son externos al componente de servidor
  // pero SÍ deben incluirse en el bundle de Vercel
  serverExternalPackages: ['pg', 'pg-hstore', 'sequelize'],
  

  
  // Opcional: Si tienes problemas con ESM
  transpilePackages: ['sequelize'],
};

export default withFlowbiteReact(nextConfig);