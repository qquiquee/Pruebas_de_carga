import { Database } from "bun:sqlite";

const db = new Database('./db.sqlite', { create: true });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  );
`);



const port = 3000;

function simulateWork(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Simulate CPU work
  }
}

const server = Bun.serve({
  port: port,
  async fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === '/') {
      // Simulate a random workload between 10ms and 1000ms
      // const workload = Math.floor(Math.random() * 990) + 10;
      // simulateWork(workload);
      
      // return new Response(`Hello from Bun! Worked for ${workload}ms.`, {
      return new Response(`Hello from Bun!`, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    
    if (url.pathname === '/health') {
      // await Bun.sleep(200);
      // console.log(req);
      // const qq = db.exec(`INSERT INTO users (name) VALUES ('${req.headers.get('User-Agent')}')`);
      // const desde = qq.run();
      // const result = db.run(`INSERT INTO users (name) VALUES (?)`, ['John Doe']);

      // console.log(qq);
Bun.sleep(200);

      const query = db.query(`INSERT INTO users (name) VALUES ('${req.headers.get('User-Agent')}')`);
const qq =  query.run();
      console.log(qq.lastInsertRowid);
// {
//   lastInsertRowid: 0,
//   changes: 0,
// }

      return new Response('OK', { status: 200 });
    }
    
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Servidor corriendo en http://localhost:${port}`);