module.exports = {
  apps: [
    {
      name: "devbog-blog-front",
      script: "node",
      args: ".output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
