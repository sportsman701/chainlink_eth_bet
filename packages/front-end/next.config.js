/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_NETWORK_URL: process.env.REACT_APP_NETWORK_URL,
    REACT_APP_CHAIN_ID: process.env.REACT_APP_CHAIN_ID
  }
}

module.exports = nextConfig
