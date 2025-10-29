import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo le decimos a Next.js que estos paquetes son externos al componente de servidor
  serverExternalPackages: ['pg', 'pg-hstore', 'sequelize'],
};

export default withFlowbiteReact(nextConfig);