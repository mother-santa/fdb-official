/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            // ... other domains you might have
            "firebasestorage.googleapis.com"
        ]
    }
};

export default nextConfig;
