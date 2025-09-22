export const config = {
    app: {
        devMode: import.meta.env.VITE_DEV_MODE === 'true',
        name: import.meta.env.VITE_APP_NAME || 'Dev Meter',
        frontendUrl: import.meta.env.VITE_FRONTEND_URL,
    },
};
export default config;