# abrxsvavstatus — sitio oficial de AbrxsVAV

Sitio público en GitHub Pages: **https://lordjeferies.github.io/abrxsvavstatus/**

## Qué contiene

| Página | Contenido |
|---|---|
| `index.html` | Qué es, qué no es, pain points que resuelve, principios |
| `tools.html` | Las 11 estaciones: qué hace / cómo / con qué / qué NO hace cada una |
| `workflows.html` | Flujos completos (podcast→20 verticales, intro EP55, carrusel/Lienzo) + 10 tutoriales por caso de uso (X-rolls, motions, SFX, handoff, faceless, MCP…) |
| `support.html` | Errores comunes con solución + FAQ |
| `status.html` | **Dinámico**: lee `ROADMAP.txt`, `docs/IMPLEMENTATION_STATUS.md`, `CHANGELOG.md` y los commits del repo `abrxs-vav` en vivo (raw.githubusercontent + GitHub API). Si el repo avanza, la página avanza. |

## Asistente

Chat flotante en todas las páginas. **100% local**: la búsqueda corre en el navegador
sobre `assets/knowledge.js` (base de conocimiento embebida). No envía nada a ningún
servidor ni requiere API keys.

## Actualizar

El contenido del sitio es estático (HTML plano, sin build). Para actualizar la info
del producto edita los HTML; para actualizar el estado NO hay que tocar nada: sale
del repo `abrxs-vav`. Publicación: push a `main` → Pages lo sirve.

Requisito del repo principal para el status en vivo: que `ROADMAP.txt` mantenga el
formato `[x] PASO N — …` y la línea `SIGUIENTE ACCIÓN`.
