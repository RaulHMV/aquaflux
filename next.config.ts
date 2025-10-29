import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'pg-hstore', 'sequelize'],
  experimental: {
    serverComponentsExternalPackages: ['pg', 'pg-hstore', 'sequelize'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'pg', 'pg-hstore', 'sequelize'];
    }
    return config;
  },
};

export default withFlowbiteReact(nextConfig);
