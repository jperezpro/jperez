// Configuracion de Tailwind para compilar assets/css/tailwind.css.
// Es la configuracion por defecto (la misma que usaba el CDN): solo dice que
// archivos escanear. Si se agrega una pagina nueva fuera de estas rutas, sumarla
// aca y recompilar con `npm run build:css`.
//
// index.html lleva adentro el CSS ya compilado, entre los marcadores
// css-inline (scripts/inline-css.js). Ese bloque no se escanea: si no, las
// palabras del propio CSS (outline, filter, transition...) se leerian como
// clases y cada compilacion sumaria utilidades que ninguna pagina usa.
const BLOQUE_INLINE = /<!-- css-inline:inicio -->[\s\S]*?<!-- css-inline:fin -->/g;

module.exports = {
    content: {
        files: ['./index.html', './pages/**/*.html'],
        transform: {
            html: (contenido) => contenido.replace(BLOQUE_INLINE, ''),
        },
    },
    theme: {
        extend: {},
    },
    plugins: [],
};
