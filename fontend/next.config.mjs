/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        // Basic redirect
        {
          source: "/",
          destination: "/login",
          permanent: true,
        },
      ];
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    swcMinify: true,
    fastRefresh: true,
  };
  
  export default nextConfig;
  