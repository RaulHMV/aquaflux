import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 serverExternalPackages: ['pg', 'pg-hstore', 'sequelize'],
};

export default withFlowbiteReact(nextConfig);