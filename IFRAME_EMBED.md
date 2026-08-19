# Embed del widget en un iframe (auto-altura)

El widget de booking corre **dentro de un iframe** en el sitio de WordPress
(`https://www.littlebelliesspa.com/en/location/<ciudad>/`). El widget está
desplegado en **otro origen** (`https://main.d38t3zpsva4nq4.amplifyapp.com`),
así que la página padre **no puede** leer su altura directamente
(`iframe.contentDocument` lanza `SecurityError` cross-origin).

## El bug que esto arregla

La plantilla de WordPress traía un auto-resize que **dejó de funcionar** cuando
el widget se movió a Amplify:

```js
// ❌ ROTO cross-origin: lanza SecurityError y el iframe se queda en el fallback
function setIframeHeight(id) {
  var ifrm = document.getElementById(id);
  var doc = ifrm.contentDocument ? ifrm.contentDocument
          : ifrm.contentWindow.document;      // <- SecurityError
  ifrm.style.height = getDocHeight(doc) + 4 + "px";
}
document.getElementById('ifrm').onload = function () { setIframeHeight(this.id); };
```

Al fallar, el iframe se quedaba clavado en su altura fija de fallback
(`style="height: 750px"`). En el paso de horarios el contenido mide más de
750px, así que el botón **Next** quedaba cortado. En **iOS Safari** un iframe de
altura fija no permite hacer scroll de su overflow, por eso los usuarios "no
podían llegar" al botón (visto también en las grabaciones de Clarity).

## La solución (contrato postMessage)

El widget publica su altura de contenido cada vez que cambia el layout
(navegación de pasos, carga de slots, expansión de add-ons, resize, cambio de
fuente). La página padre escucha y ajusta el iframe. Así hay **un solo scroll
natural de página** y el Next siempre queda accesible.

Mensajes que emite el widget (`window.parent.postMessage`):

| task          | payload                 | acción del padre                          |
|---------------|-------------------------|-------------------------------------------|
| `resize`      | `{ height: <number> }`  | `iframe.style.height = height + "px"`     |
| `scroll_top`  | `—`                     | scrollear la página al tope del iframe    |

> El mensaje `resize` se envía con `targetOrigin: "*"` (la altura no es dato
> sensible) para que sea inmune a un desajuste www/no-www entre
> `REACT_APP_FOLLOWING_URL` y el origen real de la página. El padre igual valida
> el origen del emisor antes de aplicar la altura.

## Snippet a poner en WordPress (plantilla de `/location/<ciudad>/`)

1. **Eliminar / neutralizar** el `onload` viejo que llama a `setIframeHeight`
   (lanza `SecurityError`). Se puede borrar; el auto-alto ahora llega por
   `postMessage`.
2. Dejar el `style="height: 750px"` como fallback inicial (se sobrescribe en
   ~100 ms con el primer `resize`). Opcional: bajarlo a `min-height: 480px`.
3. Agregar este `<script>` (una sola vez por página; el `id="ifrm"` ya existe):

```html
<script>
(function () {
  // Origen del widget (Amplify). Si cambia el dominio del widget, actualizar.
  var WIDGET_ORIGIN = "https://main.d38t3zpsva4nq4.amplifyapp.com";
  window.addEventListener("message", function (e) {
    if (e.origin !== WIDGET_ORIGIN) return;          // seguridad: solo el widget
    var d = e.data || {};
    var ifrm = document.getElementById("ifrm");
    if (!ifrm) return;
    if (d.task === "resize" && typeof d.height === "number" && d.height > 0) {
      ifrm.style.height = Math.ceil(d.height) + "px";
    } else if (d.task === "scroll_top") {
      var top = ifrm.getBoundingClientRect().top + window.pageYOffset - 16;
      window.scrollTo({ top: top, behavior: "smooth" });
    }
  });
})();
</script>
```

## Requisito del build de prod del widget

Verificar que el build de producción del widget tenga:

```
REACT_APP_FOLLOWING_URL = https://www.littlebelliesspa.com
```

(el origen EXACTO donde se sirven las páginas de location). Afecta a
`scroll_top` y `google_track_booking`; el `resize` funciona igual gracias al
`targetOrigin: "*"`.

## Cómo se verificó

- Harness local replicando el embed (iframe fijo 750px, cross-origin): el iframe
  pasa a seguir el contenido — 9 slots → ~585px, 60 slots → **1206px** (crece
  sin tope), y el Next queda accesible con **un** scroll normal de página.
- Widget **real** (dev server) embebido: emite `resize` en el render inicial y de
  nuevo tras un reflow; el padre ajusta el iframe (ya no se queda en 750px).
