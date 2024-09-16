import { serve } from "bun";
import { readFile, writeFile } from "fs/promises";
import path from "path";

import { ejecutarRuta, ejecutarTrabajo, verEjecucion } from "./ejecuciones";

const PORT = 3300;
const __dirname = new URL('.', import.meta.url).pathname;

serve({
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === 'GET') {
      if (url.pathname === '/') {
        try {
          const content = await readFile(path.join(__dirname, 'public', 'index.html'));
          return new Response(content, {
            headers: { 'Content-Type': 'text/html' }
          });
        } catch (err) {
          return new Response('Error loading index.html', { status: 500 });
        }
      } else if (url.pathname.startsWith('/list-directory')) {
        const directory = url.searchParams.get('dir') || '.';
        try {
          const proc = Bun.spawn(["ls", "-l", directory]);
          const output = await new Response(proc.stdout).text();
          const processedLines = output.split('\n').map(line => {
            if (line.startsWith('d')) {
              return line + ' (directorio)';
            }
            return line;
          });
          return new Response(processedLines.join('\n'), {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
          });
        } catch (error) {
          return new Response(`Error: ${error.message}`, { status: 400, headers: { 'Content-Type': 'text/plain' } });
        }
      } else if (url.pathname.startsWith('/trabajos')) {
        // leer el archivo de trabajos/trabajos.json y enviarlo como respuesta
        try {
          const content
            = await readFile('./trabajos/trabajos.json', { encoding: 'utf-8' });
          return new Response(content, {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        catch (err) {
          return new Response(err, { status: 500 });
        }

      } else if (url.pathname.endsWith('.css')) {
        try {
          const content = await readFile(path.join(__dirname, 'public', url.pathname));
          return new Response(content, {
            headers: { 'Content-Type': 'text/css' }
          });
        } catch (err) {
          return new Response('Not Found', { status: 404 });
        }
      } else if (url.pathname.endsWith('.js')) {  // Aquí se agrega el soporte para archivos .js
        try {
          const content = await readFile(path.join(__dirname, 'public', url.pathname));
          return new Response(content, {
            headers: { 'Content-Type': 'application/javascript' }
          });
        } catch (err) {
          return new Response('Not Found', { status: 404 });
        }
      } else if (url.pathname.endsWith('.ico')) {
        try {
          const content = await readFile(path.join(__dirname, 'public', url.pathname));
          return new Response(content, {
            headers: { 'Content-Type': 'image/x-icon' }
          });
        } catch (err) {
          return new Response('Not Found', { status: 404 });
        }
      } else {
        return new Response('Not Found', { status: 404 });
      }
    } else if (req.method === 'POST') {

      if (url.pathname === '/guardar-trabajos') {
        // Me llega un JSON con la información de los trabajos y lo debo guardar en './trabajos/trabajos.json' sustituyendo el contenido actual
        const body = await req.json();
        try {
          await writeFile('./trabajos/trabajos.json', JSON.stringify(body, null, 2));
          return new Response('Trabajos guardados correctamente', { status: 200 });
        } catch (err) {
          return new Response('Error al guardar los trabajos: ' + err, { status: 500 });
        }

      } else if (url.pathname === '/ejecutar-trabajo') {
        // Me llega body.trabajo con el nombre del trabajo a ejecutar
        const body = await req.json();
        const nombreTrabajo = body.trabajo;
        ejecutarTrabajo(nombreTrabajo);
        return new Response('Ejecutando trabajo', { status: 200 });


      } else if (url.pathname === '/ejecutar-ruta') {
        // Me llega un JSON con la información de una ruta y debo ejecutarla
        const body = await req.json();
        const uuid = body.uuid;
        ejecutarRuta(uuid);
        return new Response('Ejecutando ruta', { status: 200 });

      } else if (url.pathname === '/ver-ejecucion') {
        const body = await req.json();
        const uuid = body.uuid;
        const resultado = await verEjecucion(uuid);
        return new Response(resultado, { status: 200 });

      } else if (url.pathname === '/ver-resultados') {
        // Me llega un JSON con la información de un trabajo y debo devolver los resultados guardados
        const body = await req.json();
        const uuid = body.uuid;
        // leer el archivo de resultados/${uuid}.json y enviarlo como respuesta
        try {
          const content
            = await readFile(`./resultados/${uuid}.json`, { encoding: 'utf-8' });
          return new Response(content, {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        catch (err) {
          return new Response(err, { status: 500 });
        }
    } else {
        return new Response('Not Found', { status: 404 });
      }
    } else {
      return new Response('Method Not Allowed', { status: 405 });
    }
  },
  port: PORT,
});

console.log(`Server is running on http://localhost:${PORT}`);
