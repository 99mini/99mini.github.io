/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "export",
  sassOptions: {
    includePaths: [path.join(__dirname, "sass")],
  },
};

module.exports = nextConfig;
