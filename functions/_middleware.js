// Redireccion de los dominios viejos al actual, jperez.pages.dev.
// - jperez.pro (y www): no se renueva, vence el 02/12/2026.
// - web-personal-jperezpro.pages.dev: el pages.dev del proyecto anterior,
//   usado del 09 al 10/10/2026. Ese proyecto sigue conectado a este repo y
//   publica este mismo codigo, asi que cada pedido a su dominio cae aca.
// Toda visita va a la misma pagina en jperez.pages.dev con un 301, para que
// Google y los links viejos pasen al dominio actual. En el proyecto actual el
// dominio no coincide y todo pasa. Ver README, "Deploy".
const VIEJOS = new Set(['jperez.pro', 'www.jperez.pro', 'web-personal-jperezpro.pages.dev']);
const NUEVO = 'jperez.pages.dev';

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (!VIEJOS.has(url.hostname)) return next();
  url.protocol = 'https:';
  url.hostname = NUEVO;
  url.port = '';
  return Response.redirect(url.toString(), 301);
}
