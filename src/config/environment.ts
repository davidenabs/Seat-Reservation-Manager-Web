export const config = {
    app: {
        name: import.meta.env.VITE_APP_NAME || 'Dev Meter',
        frontendUrl: import.meta.env.VITE_FRONTEND_URL,
    },
};
export default config;