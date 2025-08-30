/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'profsacademie.ca'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/fr-CA',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
