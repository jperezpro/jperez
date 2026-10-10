// Redireccion del dominio viejo. jperez.pro no se renueva (vence el
// 02/12/2026): mientras siga apuntando a este proyecto, toda visita va a la
// misma pagina en el pages.dev con un 301, para que Google y los links viejos
// pasen al dominio nuevo. Cuando el dominio venza, este archivo y _routes.json
// sobran. Ver README, "Deploy".
const VIEJOS = new Set(['jperez.pro', 'www.jperez.pro']);
const NUEVO = 'web-personal-jperezpro.pages.dev';

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (!VIEJOS.has(url.hostname)) return next();
  url.protocol = 'https:';
  url.hostname = NUEVO;
  url.port = '';
  return Response.redirect(url.toString(), 301);
}
