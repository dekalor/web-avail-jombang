module.exports = {
  apps: [
    {
      name: "web-avail-jombang",
      script: "server/index.js",
      cwd: "/home/availjom/web-avail-jombang",
      exec_mode: "fork",
      instances: 1,

      // Auto restart if crash
      autorestart: true,
      max_memory_restart: "600M",

      // Environment variables
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },

      // Logs
      error_file: "/home/availjom/logs/avail-app-error.log",
      out_file: "/home/availjom/logs/avail-app-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      // Optional: watch off (important for production)
      watch: false,

      // Graceful reload
      kill_timeout: 5000
    }
  ]
};