const targetUrl = 'http://localhost:3000/health'; 
// const targetUrl = 'http://www.enriquegiron.es/'; 
const numRequests = 100; // Número de solicitudes a enviar
const concurrency = 10; // Número de solicitudes concurrentes

let totalRequests = 0;
let totalTime = 0;
let completedRequests = 0;
let requestErrors = 0;

const startRequest = async () => {
  const start = performance.now();
  const requestId = totalRequests + 1;
  // console.log(`Iniciando solicitud #${requestId}`);

  try {
    // solicitar con cabecera user-agent edge
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
      },
    });

    // const res = await fetch(targetUrl);
	// const res = await fetch(targetUrl, { verbose: true });
    // await res.text(); // Consume el cuerpo de la respuesta
    const duration = performance.now() - start;
    totalTime += duration;
    completedRequests += 1;
    // console.log(`Solicitud #${requestId} completada en ${duration.toFixed(2)} ms`);
  } catch (err) {
    requestErrors += 1;
    console.log(`Error en solicitud #${requestId}: ${err.message}`);
  }

  totalRequests += 1;

  if (totalRequests < numRequests) {
    startRequest();
  } else if (completedRequests + requestErrors === numRequests) {
    await Bun.sleep(1000)
    printResults();
    // printResults();
  }
};

const printResults = () => {
  console.log(`\nTotal requests: ${totalRequests}`);
  console.log(`Completed requests: ${completedRequests}`);
  console.log(`Errored requests: ${requestErrors}`);
  console.log(`Average response time: ${(totalTime / completedRequests).toFixed(2)} ms`);
};

// Inicia las solicitudes concurrentes
for (let i = 0; i < concurrency; i++) {
  startRequest();
}