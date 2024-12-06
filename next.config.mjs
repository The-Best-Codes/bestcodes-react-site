import MillionLint from "@million/lint";
/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        "remotePatterns": [
            {
                "protocol": "https",
                "hostname": "*"
            },
            {
                "protocol": "http",
                "hostname": "*"
            }
        ],
        "formats": ["image/avif", "image/webp"],
    },
};

export default MillionLint.next({
    enabled: true,
    rsc: true
})(nextConfig);
