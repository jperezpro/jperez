# jperez.pro - Sitio personal de Javier Perez

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
  `index.html` (seccion Trabajos) y `pages/proyectos.html`.
- Los sitios sin dominio propio se enlazan por su `.pages.dev`, que
  administramos nosotros, no por el dominio del cliente.
- El sitio esta cubierto por el QA automatizado del repo `browser-automation`
  (sitio `jperez`). Si cambian los titulos de seccion, hay que actualizar los
  selectores ahi.

## Stack

HTML estatico + Tailwind (CDN) + Google Fonts. Sin build.
Analytics: Google Analytics (`G-K21M2K3TKG`). Pagos: Mercado Pago.

## Deploy

Cloudflare Pages, proyecto `web-personal-jperezpro`. **Push a `main` despliega
solo**; no se sube nada a mano. Dominio: `jperez.pro`.

Para desarrollo local basta con servir la carpeta:

```
python -m http.server 8080
```
