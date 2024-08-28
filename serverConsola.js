import { serve } from "bun";
import { readFile } from "fs/promises";
import path from "path";

const PORT = 3000;
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
      } else if (url.pathname.endsWith('.css')) {
        try {
          const content = await readFile(path.join(__dirname, 'public', url.pathname));
          return new Response(content, {
            headers: { 'Content-Type': 'text/css' }
          });
        } catch (err) {
          return new Response('Not Found', { status: 404 });
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