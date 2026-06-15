# Calculadora de Notas

Calculadora de ponderaciones, eximición y "¿qué nota necesito?" para el sistema universitario chileno (escala 1.0–7.0). Maneja varios ramos a la vez, cada uno con su propia estructura de evaluaciones y sus propias reglas de eximición.

Es una aplicación web de un solo archivo, sin dependencias ni instalación: se abre en cualquier navegador y guarda tus ramos automáticamente.

## Características

- **Varios ramos** en pestañas, cada uno independiente.
- **Evaluaciones flexibles** con nombre, categoría, peso y nota. La nota puede quedar vacía si aún no la rindes.
- **Dos modos de ponderación:**
  - *Por evaluación:* cada evaluación lleva su propio peso %.
  - *Por categoría:* defines el peso de cada categoría una vez (ej. Tareas = 25%) y se reparte entre sus evaluaciones, con un "relativo" opcional para que dentro de una categoría unas pesen más que otras.
- **Categorías personalizables** (Prueba, Control, Tarea, Proyecto, Laboratorio… y las que agregues).
- **Reglas de eximición combinables** (NP, promedio de categoría, todas las notas, una evaluación específica), unidas por "o".
- **Resultados claros:** promedio actual, NP estimado, banner de estado de eximición (eximido / depende de pendientes / debes rendir) y escenarios de nota final.
- **"¿Qué nota necesito?":** qué promedio necesitas en lo que falta para un NP objetivo, y qué nota necesitas en el examen para una nota final objetivo.
- **Precisión configurable:** muestra 1 o 2 decimales. El cálculo interno siempre usa precisión completa; la eximición compara el promedio real sin redondear.
- **Respaldo:** exporta e importa todos tus ramos como JSON.

## Uso online (GitHub Pages)

Si publicas el repositorio con GitHub Pages, la app queda disponible en:

```
https://TU_USUARIO.github.io/calculadora-notas/
```

Para activarlo: en el repo, **Settings → Pages → Source: Deploy from a branch → Branch: `main` / carpeta `/ (root)` → Save**. En unos minutos estará en línea.

> Nota: GitHub Pages es gratis en repositorios **públicos**. En repositorios **privados** requiere un plan pago de GitHub.

## Cómo ejecutarla localmente

No necesita compilación. Tienes dos opciones:

1. **Abrir directo:** doble clic en `index.html`.
2. **Servidor local** (recomendado, para que el guardado funcione igual que en producción):

```bash
# con Python
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Cómo usarla

1. Crea un ramo con **+ Agregar ramo** y ponle nombre.
2. Agrega tus evaluaciones (nombre, categoría, peso y nota). Si los pesos no suman 100%, te avisa.
3. En **Configuración** define la nota de aprobación y cuánto pesan el NP y el examen en la nota final.
4. En **Reglas de eximición** arma las condiciones de tu reglamento (puedes unir reglas con "o").
5. Mira los **Resultados** y usa **¿Qué nota necesito?** para saber qué te falta.
6. Usa **Exportar** para respaldar tus ramos.

## El sistema de notas

Pensada para el sistema chileno: notas de 1.0 a 7.0, aprobación habitual en 4.0, y todo se muestra con un decimal. La nota de presentación (NP) es el promedio ponderado de las evaluaciones; la nota final (NF) depende de si rindes o no el examen y de si estás eximido, según las reglas que configures.

## Estructura del proyecto

```
calculadora-notas/
├── index.html      La aplicación (HTML + CSS + JS, sin dependencias)
├── README.md
├── LICENSE
└── .gitignore
```

## Tecnologías

HTML, CSS y JavaScript puro (vanilla), sin frameworks ni build. Toda la lógica vive en `index.html`.

## Privacidad

Tus datos se guardan **solo en tu navegador** (no se envían a ningún servidor). Para llevarlos a otro equipo, usa Exportar/Importar.

## Próximas mejoras (ideas)

- Vista de resumen con todos los ramos (aprobados / eximidos / en riesgo).
- Control de asistencia mínima.
- Opción de promedio simple vs. ponderado para "promedio de categoría".
- Modo truncar (además de redondear) según reglamento.
- Estado vacío y responsividad móvil más pulidos.

## Licencia

MIT — ver [LICENSE](LICENSE).
