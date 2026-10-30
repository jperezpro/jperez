# jperez

Web personal y página de servicios de **Javier Perez**, desarrollador web y
consultor TI en Montevideo, Uruguay. Sitios para profesionales independientes y
comercios que quieren recibir consultas y reservas desde Instagram o WhatsApp.

Sitio estático publicado en Cloudflare Pages (push a la rama principal = deploy).

- Producción: https://jperez.pages.dev
- Stack: HTML, Tailwind CSS (compilado), JavaScript, Cloudflare Pages Functions

## Qué tiene el sitio

- **Trabajos:** seis sitios publicados y enlazados, de clientes y de
  emprendimientos propios (barbería, jardinería, tours 360, vidriería,
  restaurante y casa de alquiler). Es la prueba del sitio: no hay testimonios.
- **Plan único** de 670 pesos por mes, por Mercado Pago, sin prueba gratis
  ni permanencia.
- **Preguntas frecuentes** y contacto directo por WhatsApp.

## Cómo está hecho

- HTML estático, sin framework ni build en el servidor: lo que está en `main`
  es lo que se publica.
- Tailwind CSS 3.4 compilado a un archivo propio (`assets/css/tailwind.css`),
  en lugar del CDN que compilaba en el navegador.
- En la portada el CSS va incrustado en el `<head>` (`scripts/inline-css.js`),
  así la primera pintura no espera hojas externas.
- Imágenes WebP en dos anchos con `srcset`, `sizes`, `width` y `height`, y
  carga diferida.
- Google Fonts con `preload` y `display=swap`, sin bloquear el render.
- JSON-LD con `Person`, `ProfessionalService` (planes y precios) y `FAQPage`;
  Open Graph, canonical y sitemap.
- Cabeceras de seguridad en `_headers`: HSTS, `X-Frame-Options: DENY`,
  `nosniff`, `Referrer-Policy` y `Permissions-Policy`.
- Una Pages Function (`functions/_middleware.js`) redirige con 301 los
  dominios anteriores y responde 404 a los archivos del repo que no son parte
  del sitio. `_redirects` cubre los mismos archivos como respaldo.
- Controles táctiles de 44 px o más, foco visible para teclado y respeto por
  `prefers-reduced-motion`.

## Resultados medidos

Cada cambio de rendimiento está explicado en su commit, con el antes y el
después.

| Cambio | Antes | Después |
|---|---|---|
| Tailwind | Script del CDN de ~125 KB que bloqueaba el render | CSS propio de 16 KB (4 KB comprimido) |
| Fondo del encabezado | PNG de 1,6 MB | WebP de 41 KB |
| Primera pintura con Google Fonts sin bloquear (celular emulado, 4G lento, CPU x4, mediana de 4 pares) | 1,6 s | 0,63 s |
| Controles por debajo de 44 px | 3 (el menú medía 24 px) | 0 |

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | Portada: presentación, trabajos, planes, sin permanencia y preguntas frecuentes. |
| `pages/proyectos.html` | Galería de trabajos. |
| `pages/gracias.html` | Página a la que vuelve Mercado Pago después de suscribirse (`noindex`). |
| `pages/guia-*.html` | Guías prácticas: Fireflies, Google Business y Toggl Track. |
| `pages/conectapro.html` | Redirige una URL anterior a la portada (`noindex`). |
| `404.html` | Página de error para las rutas que no existen. |
| `assets/` | CSS e imágenes. |
| `functions/_middleware.js` | Redirecciones 301 y bloqueo de archivos internos. |
| `_headers`, `_redirects`, `_routes.json` | Configuración de Cloudflare Pages. |

## Desarrollo local

```
python -m http.server 8080
```

Para probar también la Pages Function y los `_redirects`:

```
npx --yes wrangler@4 pages dev . --ip 127.0.0.1 --port 8788
```

Después de tocar clases de Tailwind o `assets/css/style.css` (necesita Node):

```
npm run build:css
```

Compila `tailwind.css` y lo incrusta, junto con `style.css`, entre los
marcadores `css-inline` de `index.html`. Lo que hay entre esos marcadores no
se edita a mano. Correrlo dos veces no cambia nada. Se commitean juntos
`tailwind.css`, `index.html` y lo que se haya tocado.

## Mantenimiento

- Al cambiar precios o preguntas frecuentes, actualizar también el JSON-LD de
  `index.html`: tienen que decir lo mismo que el texto visible.
- Un trabajo nuevo va en `index.html` y en `pages/proyectos.html`. La captura
  se sirve en WebP en dos anchos, `<nombre>-720.webp` y `<nombre>-1080.webp`
  (3:2): copiar el `<img>` de un proyecto existente.
- El año del pie se calcula solo (`new Date().getFullYear()`).
- Sin fechas ni cupos que venzan en los textos.

## Publicación

Cloudflare Pages, conectado a este repo: cada push a `main` publica el sitio
en https://jperez.pages.dev. Los dominios anteriores redirigen con 301 a la
misma ruta.

Hecho por Javier Perez · https://jperez.pages.dev
