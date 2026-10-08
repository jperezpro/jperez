/**
 * Mete el CSS dentro de index.html (la portada), entre los marcadores css-inline.
 *
 * Por que: en celular, cada hoja de estilos externa es un pedido mas que
 * bloquea la primera pintura. Con el CSS adentro del HTML, la portada se pinta
 * apenas llega el documento. Las demas paginas siguen con sus <link>.
 *
 * Lo corre `npm run build:css` despues de compilar Tailwind. Toma, en este
 * orden (el mismo orden de cascada que tenian los dos <link>):
 *   1. assets/css/style.css     (estilos propios; se le sacan comentarios y espacios)
 *   2. assets/css/tailwind.css  (Tailwind compilado y minificado)
 *
 * No toca nada fuera de los marcadores y es idempotente: si el CSS no cambio,
 * no reescribe el archivo. Si no encuentra los marcadores, falla.
 */
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const htmlPath = path.join(raiz, 'index.html');
const propios = fs.readFileSync(path.join(raiz, 'assets', 'css', 'style.css'), 'utf8');
const tailwind = fs.readFileSync(path.join(raiz, 'assets', 'css', 'tailwind.css'), 'utf8');

// Minificado conservador de style.css: sin comentarios, espacios colapsados
// y sin espacios alrededor de llaves y punto y coma. No toca selectores.
const propiosMin = propios
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};])\s*/g, '$1')
    .trim();

const css = (propiosMin + '\n' + tailwind.trim()).replace(/\r\n/g, '\n');

if (/<\/style/i.test(css)) {
    console.error('inline-css: el CSS contiene "</style"; no se puede incrustar.');
    process.exit(1);
}
// Las rutas relativas de un url() se resuelven distinto desde assets/css/ que
// desde la raiz: si aparece alguna, hay que resolverla antes de incrustar.
for (const m of css.matchAll(/url\(([^)]*)\)/gi)) {
    const ruta = m[1].trim().replace(/^['"]|['"]$/g, '');
    if (!/^(data:|https?:|\/|#)/i.test(ruta)) {
        console.error(`inline-css: el CSS tiene una ruta relativa (${m[0]}); dentro de index.html apuntaria a otro lado.`);
        process.exit(1);
    }
}

const INICIO = '<!-- css-inline:inicio -->';
const FIN = '<!-- css-inline:fin -->';
const html = fs.readFileSync(htmlPath, 'utf8');
const i = html.indexOf(INICIO);
const f = html.indexOf(FIN);
if (i === -1 || f === -1 || f < i || html.indexOf(INICIO, i + 1) !== -1 || html.indexOf(FIN, f + 1) !== -1) {
    console.error('inline-css: no encontre los marcadores css-inline (uno de cada uno) en index.html.');
    process.exit(1);
}

// Respetar el fin de linea del archivo (CRLF en Windows con autocrlf, LF en Linux).
const eol = html.includes('\r\n') ? '\r\n' : '\n';
const bloque = ('    <style>' + css + '</style>').replace(/\n/g, eol);
const nuevo = html.slice(0, i + INICIO.length) + eol + bloque + eol + '    ' + html.slice(f);
if (nuevo !== html) {
    fs.writeFileSync(htmlPath, nuevo);
    console.log(`inline-css: index.html actualizado (${Buffer.byteLength(css)} bytes de CSS).`);
} else {
    console.log('inline-css: sin cambios.');
}
