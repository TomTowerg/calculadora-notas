# Gradiant 🎓

> Gestiona tus ramos universitarios chilenos (escala 1.0–7.0): calcula promedios, simula el examen, visualiza reglas de eximición y sabe exactamente qué nota necesitas.

**Sin instalación · Sin servidor · Funciona offline · Todo en un archivo**

---

## Vista rápida

| Lo que hace | Cómo lo hace |
|---|---|
| Varios ramos en paralelo | Pestañas independientes, guardado automático |
| Notas en color según estado | 🔴 < 4.0 · 🟡 = 4.0 · 🟢 > 4.0 |
| Progreso de evaluaciones | Barra rojo → verde a medida que completas notas |
| Reordenar evaluaciones | Arrastra y suelta las filas |
| Calcular nota de examen | "Para NF 5.0 necesitas **4.3** en el examen" |
| Calcular nota pendiente | "Necesitas **5.1** en Prueba 3" |
| Reglas de eximición | Detecta si ya te eximiste o qué nota te falta |

---

## Características

### Evaluaciones
- Nombre, categoría, peso y nota por evaluación
- Nota vacía = evaluación pendiente (se incluye en el cálculo de lo que falta)
- **Dos modos de ponderación:**
  - *Por evaluación:* cada una lleva su propio peso %
  - *Por categoría:* defines el peso del grupo (ej. Pruebas = 75%) y se reparte automáticamente; con "relativo" opcional para que unas pesen más que otras dentro del grupo
- **Arrastra y suelta** para reordenar las filas

### Colores de notas
Las notas se colorean en tiempo real comparando con la nota de aprobación configurada:
- 🟢 **Verde** — sobre la nota de aprobación
- 🟡 **Amarillo** — exactamente en la nota de aprobación (ej. 4.0)
- 🔴 **Rojo** — bajo la nota de aprobación

### Resultados
- **Promedio actual** (NP estimado con las notas ingresadas)
- **Barra de progreso** rojo → amarillo → verde según el porcentaje completado
- **Estado de eximición** al instante: eximido ✓ / posible / no es posible
- **Escenarios de nota final:** con y sin examen, cuánto cambia tu nota según lo que saques

### ¿Qué nota necesito?
- **En evaluaciones pendientes:** qué promedio necesitas en lo que queda para alcanzar un NP objetivo
- **En el examen:** qué nota necesitas en el examen para una nota final deseada
- Ambos muestran el resultado primero, los campos de ajuste debajo

### Reglas de eximición
- Condiciones combinables por OR entre reglas, AND entre condiciones de una misma regla:
  - NP ≥ X
  - Promedio de categoría ≥ X
  - Todas las evaluaciones ≥ X
  - Una evaluación específica ≥ X
- **Recomendaciones específicas** cuando falta una nota: "Necesitas **5.0** en Prueba 2"
- **Detección de imposibles:** si una nota ya ingresada rompe la condición, avisa en rojo con el motivo ("Prueba 2 tiene 3.0, no alcanza 4.0")

### Otras funciones
- **Temas:** claro y oscuro
- **Precisión configurable:** 1 o 2 decimales
- **Categorías personalizables:** Prueba, Control, Tarea, Proyecto, Laboratorio…
- **Exportar / Importar:** respaldo en JSON para llevar tus ramos a otro equipo

---

## Uso online

Si publicas el repo con GitHub Pages, la app queda en:

```
https://TomTowerg.github.io/calculadora-notas/
```

Para activarlo: **Settings → Pages → Branch: `main` / `/ (root)` → Save**

> GitHub Pages es gratis en repositorios públicos.

---

## Usar localmente

Solo abre `index.html` en tu navegador. No necesita servidor ni instalación.

```bash
# Opcionalmente con servidor local:
python3 -m http.server 8000
# → http://localhost:8000
```

---

## Guía rápida

1. **Crea un ramo** con el botón `+ Ramo` en la barra de pestañas
2. **Agrega evaluaciones** con nombre, categoría y peso
3. **Configura** la nota de aprobación y el peso del examen en *Configuración*
4. **Define las reglas de eximición** si tu reglamento lo permite
5. **Ingresa notas** a medida que rindes — los colores y cálculos se actualizan al instante
6. Usa **¿Qué nota necesito?** para saber qué te falta
7. **Exporta** para hacer respaldo

---

## El sistema de notas chileno

- Escala 1.0 – 7.0
- Aprobación habitual: **4.0** (configurable por ramo)
- Nota de Presentación (NP): promedio ponderado de evaluaciones
- Nota Final (NF): combinación de NP + Examen según los pesos configurados
- Si estás eximido: NF = NP (sin rendir examen)

---

## Estructura

```
calculadora-notas/
├── index.html      Toda la app (HTML + CSS + JS, sin dependencias)
├── README.md
├── LICENSE
└── .gitignore
```

HTML, CSS y JavaScript puro — sin frameworks, sin build, sin Node.js.

---

## Privacidad

Tus datos se guardan **únicamente en tu navegador** (localStorage). No se envía nada a ningún servidor. Usa Exportar/Importar para mover datos entre equipos.

---

## Licencia

MIT — ver [LICENSE](LICENSE).
