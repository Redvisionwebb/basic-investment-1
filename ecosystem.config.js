module.exports = {
  apps: [
    {
      name: "charveefinancial", // Name of the application
      script: "npm", // Using npm to run the app
      args: "start", // Start command for the app
      cwd: "/rvdata/charveefinancial", // The project directory (path to your Next.js app)
      env: {
        NODE_ENV: "production", // Default environment variables
        PORT: 3045,
      },
      env_file: "/rvdata/env-files/charveefinancial.env", // Path to the custom .env file
    },
  ],
};
