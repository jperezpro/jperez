// Pages Function que corre antes de servir cualquier pagina del sitio.
// 1. Los dominios anteriores (jperez.pro, www y el pages.dev del proyecto
//    viejo, que sigue publicando este mismo repo) redirigen con 301 a la
//    misma ruta en jperez.pages.dev.
// 2. Pages publica toda la carpeta del repo: README, package.json, archivos
//    ocultos, configuraciones y scripts responden 404. La ruta se compara ya
//    decodificada y normalizada (sin %2E, barras repetidas, barras invertidas
//    ni segmentos ".."), en minusculas, para que no se pueda esquivar el
//    filtro escribiendo la misma ruta de otra forma.
const VIEJOS = new Set(['jperez.pro', 'www.jperez.pro', 'web-personal-jperezpro.pages.dev']);
const NUEVO = 'jperez.pages.dev';
const INTERNO = [
  /\.md$/,
  /\/\.(?!well-known\/)/,
  /^\/package(-lock)?\.json$/,
  /^\/tailwind\.config\.js$/,
  /^\/(scripts|functions)\//,
  /^\/license(\.txt)?$/,
];

function rutaNormalizada(pathname) {
  let p;
  try {
    p = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  p = p.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
  return new URL(p, 'https://x').pathname.toLowerCase();
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (VIEJOS.has(url.hostname)) {
    url.protocol = 'https:';
    url.hostname = NUEVO;
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
  const ruta = rutaNormalizada(url.pathname);
  if (ruta === null || INTERNO.some((re) => re.test(ruta))) {
    return new Response('No encontrado', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return next();
}
