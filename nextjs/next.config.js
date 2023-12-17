/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/ping",
                destination: "/api/ping",
            },
        ];
    },
    publicRuntimeConfig: {
        NEXT_PUBLIC_SERVER_URL: process.env.SERVER_URL,
        NEXT_PUBLIC_SOCKET_URL: process.env.SOCKET_URL,
    },
};

module.exports = nextConfig;
