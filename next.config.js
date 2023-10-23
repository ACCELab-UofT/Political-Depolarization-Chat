/** @type {import('next').NextConfig} */
module.exports = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    experimental: {
        serverActions: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '**',
            },
        ],
    },
};
