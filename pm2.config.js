module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./index.js",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}

