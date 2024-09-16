
# Herramienta de Pruebas de Carga y Ciberseguridad en Servidores Web

Este proyecto es una **Herramienta de Pruebas de Carga y Ciberseguridad en Servidores Web** diseñada para simular múltiples escenarios de pruebas y monitorear el rendimiento y la resiliencia de los servidores web. El sistema permite definir trabajos y rutas de prueba, ejecutarlos y obtener datos detallados de rendimiento.

## Características

- **Crear, Modificar y Clonar Trabajos:** Defina múltiples trabajos de prueba con varias configuraciones como ruta, método de solicitud y tipo de ejecución (paralelo/serie).
- **Pruebas de Carga:** Ejecute rutas con configuraciones personalizables, como el número de llamadas y el tamaño del bloque para la ejecución en paralelo.
- **Seguimiento de Resultados:** Monitoree el progreso de las pruebas y vea los resultados de cada ruta, con el estado de las ejecuciones en curso resaltado en la interfaz.
- **Consola Web:** Interfaz visual para seleccionar, ejecutar y gestionar trabajos y rutas de prueba.

## Tecnologías Utilizadas

- **Frontend:** HTML, CSS y JavaScript para construir la interfaz web.
- **Backend:** 
  - **Bun** como entorno del servidor.
  - **Node.js** y `fs/promises` para la gestión de archivos.
  - Arquitectura API RESTful.
  - API Fetch para la comunicación con el backend.
- **Almacenamiento de Datos:** Los trabajos de prueba y los resultados se almacenan en formato JSON, lo que garantiza flexibilidad y fácil extensibilidad.

## Estructura del Proyecto

```plaintext
.
├── public/
│   ├── index.html          # Archivo HTML principal para la interfaz web
│   ├── script.js           # JavaScript del lado del cliente para gestionar las interacciones de la UI
│   ├── styles.css          # CSS para el estilo de la UI
├── serverConsola.js        # Script del servidor backend (basado en Bun y Node.js)
├── ejecuciones.js          # Script para gestionar la ejecución de trabajos y los resultados
├── trabajos/               # Directorio para almacenar las configuraciones de trabajos (en formato JSON)
├── resultados/             # Directorio para almacenar los resultados de las pruebas (en formato JSON)
└── README.md               # Este archivo
```

## Cómo Ejecutar el Proyecto

1. **Instalar Bun**: Asegúrese de tener [Bun](https://bun.sh/) instalado.
   
2. **Ejecutar el Servidor**:
   ```bash
   bun run serverConsola.js
   ```
   El servidor estará corriendo en `http://localhost:3300`.

3. **Acceder a la Interfaz Web**: Abra su navegador y navegue a `http://localhost:3300` para acceder a la interfaz de la herramienta de pruebas de carga.

4. **Creación de Trabajos**: Use la interfaz para crear nuevos trabajos, modificar los existentes o clonar trabajos. Cada trabajo le permite definir rutas, el número de llamadas, tipo de ejecución (paralelo o serie) y parámetros adicionales como el método de solicitud (GET, POST, etc.).

5. **Ejecutar Trabajos**: Seleccione un trabajo y ejecútelo usando los botones disponibles en la interfaz. El trabajo se ejecutará en segundo plano y podrá monitorear los resultados a través de la consola o ver el informe final.

6. **Ver Resultados**: Después de la ejecución, los resultados se almacenan en el directorio `resultados/` y se pueden acceder desde la interfaz web.

## Endpoints de la API

- **GET `/trabajos`**: Devuelve la lista de trabajos configurados.
- **POST `/guardar-trabajos`**: Guarda la configuración actual de los trabajos.
- **POST `/ejecutar-trabajo`**: Ejecuta el trabajo especificado.
- **POST `/ver-resultados`**: Recupera los resultados de la ejecución de un trabajo.
- **POST `/ejecutar-ruta`**: Ejecuta una ruta específica por su UUID.

## Personalización

- Puede modificar las configuraciones de trabajos de prueba editando directamente los archivos JSON en el directorio `trabajos/`.
- Personalice la apariencia de la interfaz modificando el archivo `styles.css`.
- Extienda el sistema para incluir análisis de vulnerabilidades u otras pruebas de seguridad durante la ejecución de cargas.

## Mejoras Futuras

- Añadir soporte para configuraciones de trabajos más complejas (por ejemplo, ejecuciones condicionales, reintentos).
- Integrar características de seguridad más avanzadas como la limitación de tasa y la detección de vulnerabilidades.
- Mejorar las funciones de reporte en tiempo real.

## Versión

- **1.0.0**

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulte el archivo [LICENSE](LICENSE) para más detalles.
