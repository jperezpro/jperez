# web-personal-jperezpro - Sitio personal de Javier Perez

Sitio personal y pagina de venta de Javier Perez, desarrollador web y consultor
TI en Montevideo. Ofrece sitios web que convierten visitantes en citas
agendadas, para profesionales independientes y comercios de Uruguay.

## Estructura

| Archivo | Rol |
|---|---|
| `index.html` | **La pagina de venta.** Presentacion, trabajos reales, planes con precios, garantia y FAQ. Es la URL principal. |
| `pages/proyectos.html` | Galeria de trabajos, sin contenido comercial. |
| `pages/conectapro.html` | Redireccion a la home (`noindex`). Ver "Historia" mas abajo. |
| `pages/gracias.html` | Pagina de agradecimiento post-contacto. |
| `pages/guia-*.html` | Guias sueltas (Fireflies, Google Business, Toggl Track). |

### Por que la venta esta en la home

La oferta y la prueba que la respalda viven juntas, en la URL con mas
autoridad del dominio. Los seis sitios de clientes son clickeables y
verificables: **esa es la prueba social del sitio, no hay testimonios**. Si
se agregan testimonios en el futuro, tienen que ser reales y atribuibles.

Separar "quien soy" de "cuanto cuesta" obligaba a mantener dos paginas y a que
un visitante -- o un buscador -- reconstruyera la relacion entre ambas.

### Historia: Conecta Pro

Hasta septiembre de 2026 la venta vivia en `pages/conectapro.html`, bajo la
marca "Conecta Pro". Se disolvio: era un nombre de fantasia sin trayectoria
verificable, y la pagina habia quedado con testimonios ficticios, un logo roto
y avisos vencidos justamente por ser una pagina aparte que nadie revisaba.

El archivo se conserva como redireccion porque puede haber links repartidos.

## SEO y datos estructurados

La home incluye JSON-LD con tres nodos, pensados para que un buscador -- o un
asistente de IA -- pueda responder sin ambiguedad quien presta el servicio,
cuanto cuesta y que dudas resuelve:

- `Person`: Javier Perez, oficio y ciudad.
- `ProfessionalService`: area de servicio y catalogo de planes **con precios**.
- `FAQPage`: las 8 preguntas frecuentes.

Al tocar precios o FAQ en el HTML, **actualizar tambien el JSON-LD**: si se
desincronizan, Google puede penalizar el structured data.

## Mantenimiento

- **El anio del footer se calcula solo** (`new Date().getFullYear()`). No
  hardcodear un anio: ya paso que quedara viejo.
- **Sin fechas ni cupos que venzan.** Nada de "solo 8 cupos en octubre": si
  no hay alguien que lo actualice cada mes, queda desactualizado.
- Al agregar o quitar un proyecto, actualizarlo en **los dos lados**:
  `index.html` (seccion Trabajos) y `pages/proyectos.html`. La captura se
  sirve en WebP en dos anchos, `<nombre>-720.webp` y `<nombre>-1080.webp`
  (3:2, como las demas), con `srcset`, `sizes`, `width`/`height` y
  `loading="lazy"`: copiar el `<img>` de un proyecto existente. El PNG o JPG
  original queda en la carpeta como fuente.
- **Si se tocan clases de Tailwind en cualquier HTML o `style.css`, correr
  `npm run build:css`** (ver "CSS" abajo). Si no, la clase nueva no tiene
  estilos en produccion y la portada sigue con el CSS viejo incrustado.
- Los sitios sin dominio propio se enlazan por su `.pages.dev`, que
  administramos nosotros, no por el dominio del cliente.
- El sitio esta cubierto por el QA automatizado del repo `browser-automation`
  (sitio `jperez`). Si cambian los titulos de seccion, hay que actualizar los
  selectores ahi.

## Stack

HTML estatico + Tailwind (compilado, ver abajo) + Google Fonts. Sin build en
Cloudflare: lo que esta en el repo es lo que se publica.
Analytics: Google Analytics (`G-K21M2K3TKG`). Pagos: Mercado Pago.

### CSS

- `assets/css/style.css`: estilos propios, escritos a mano.
- `assets/css/tailwind.css`: **generado**, minificado y versionado. Hasta
  octubre de 2026 Tailwind se cargaba por CDN (`cdn.tailwindcss.com`), que
  compilaba en el navegador y frenaba la primera pintura en celular. No se
  edita a mano.
- **En la portada (`index.html`) el CSS va incrustado** en un `<style>` del
  `<head>`, entre los marcadores `css-inline:inicio` y `css-inline:fin`: es
  `style.css` (sin comentarios ni espacios) + `tailwind.css`, en ese orden. Asi
  la portada se pinta apenas llega el HTML, sin esperar dos pedidos de hojas de
  estilo. Lo que hay entre los marcadores **no se edita a mano**: lo escribe
  `scripts/inline-css.js`. Las demas paginas (`pages/*.html`) siguen cargando
  los dos archivos con `<link>`.

Despues de tocar `style.css` o clases de Tailwind (necesita Node; la primera
vez `npx` baja tailwindcss 3.4.19):

```
npm run build:css
```

Compila `tailwind.css` y despues lo incrusta, junto con `style.css`, en
`index.html`. Commitear todo junto: `tailwind.css`, `index.html` y lo que se
haya tocado. Correrlo dos veces seguidas no cambia nada; si un cambio de
`style.css` no aparece en la portada, falto correrlo.

Escanea `index.html` y `pages/**/*.html` (`tailwind.config.js`), salteando el
bloque incrustado de la portada: si lo leyera, las palabras del propio CSS
entrarian como clases nuevas. Una clase que se agregue solo desde JavaScript
tiene que aparecer escrita en algun HTML para entrar al CSS (hoy la unica es
`hidden`, del menu mobile).

En cada pagina `tailwind.css` va **despues** de `style.css` (tambien dentro del
`<style>` de la portada): es el orden en que quedaba el CDN, y con el mismo
orden las utilidades de Tailwind siguen ganando la cascada igual que antes.

La hoja de Google Fonts se pide con `rel="preload"` y se aplica al llegar
(`onload`), con `<noscript>` de respaldo: no bloquea la primera pintura. Como
ya usaba `display=swap`, el texto aparece con la fuente del sistema y cambia a
Inter cuando llega.

## Deploy

Cloudflare Pages, proyecto `web-personal-jperezpro`. **Push a `main` despliega
solo**; no se sube nada a mano. Dominio: `web-personal-jperezpro.pages.dev`
(el dominio propio `jperez.pro` no se renueva: vence el 02/12/2026).

Para desarrollo local basta con servir la carpeta:

```
python -m http.server 8080
```
