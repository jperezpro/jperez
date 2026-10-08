// Configuracion de Tailwind para compilar assets/css/tailwind.css.
// Es la configuracion por defecto (la misma que usaba el CDN): solo dice que
// archivos escanear. Si se agrega una pagina nueva fuera de estas rutas, sumarla
// aca y recompilar con `npm run build:css`.
module.exports = {
    content: ['./index.html', './pages/**/*.html'],
    theme: {
        extend: {},
    },
    plugins: [],
};
