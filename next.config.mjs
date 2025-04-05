/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['swiper'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cryptologos.cc',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
        ],
    },
};

export default nextConfig;
