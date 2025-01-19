module.exports = {
    apps: [
        {
            name: 'foundation-management-system',
            script: 'npm',
            args: 'start',
            instances: 'max', // Adjust to the number of CPU cores
            exec_mode: 'cluster', // Cluster mode for better performance
            watch: false, // Set to true if you want live reload
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};
