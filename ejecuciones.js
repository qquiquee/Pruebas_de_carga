import { readFile, writeFile } from "fs/promises";
import path from "path";

// Función para leer el archivo de trabajos
async function leerTrabajos() {
  const archivoTrabajos = await readFile('./trabajos/trabajos.json', { encoding: 'utf-8' });
  return JSON.parse(archivoTrabajos);
}

// Función para leer los resultados de una ruta específica
async function leerResultadosPorRuta(idRuta) {
  const filePath = path.join(__dirname, `./resultados/${idRuta}.json`);
  try {
    const data = await readFile(filePath, { encoding: 'utf-8' });
    return JSON.parse(data);
  } catch (error) {
    // Si no existe el archivo, devolvemos un array vacío
    return [];
  }
}

// Función para guardar los resultados actualizados en un archivo por ruta
async function guardarResultadosPorRuta(idRuta, resultados) {
  const filePath = path.join(__dirname, `./resultados/${idRuta}.json`);
  await writeFile(filePath, JSON.stringify(resultados, null, 2), { encoding: 'utf-8' });
}

// Función para agregar un nuevo resultado o actualizar uno existente por ruta
async function agregarResultadoPorRuta(nombreTrabajo, resultadoRuta) {
  const idRuta = resultadoRuta.id;  // Usa el id único de la ruta
  const resultados = await leerResultadosPorRuta(idRuta);

  // Fecha y hora actuales
  // const fechaHoraActual = new Date().toISOString();

  // convertir a hora local
  const fechaHoraActual = new Date().toLocaleString();

  // Buscar si ya existe un registro para la ruta actual
  const indiceExistente = resultados.findIndex(r => r.idUnico === idRuta);

  if (indiceExistente >= 0) {
    // Si ya existe, actualiza el resultado agregando una nueva prueba con fecha y hora
    resultados[indiceExistente].resultados.push({
      fechaHora: fechaHoraActual,
      datos: resultadoRuta
    });
  } else {
    // Si no existe, agrega uno nuevo con la descripción de la ruta
    resultados.push({
      idUnico: idRuta,
      nombreTrabajo,
      ruta: resultadoRuta.ruta,
      metodo: resultadoRuta.metodo,
      descripcion: resultadoRuta.nombre, // Descripción de la ruta
      resultados: [{
        fechaHora: fechaHoraActual,
        datos: resultadoRuta
      }]
    });
  }

  await guardarResultadosPorRuta(idRuta, resultados);
}

// Función para ejecutar un trabajo
export async function ejecutarTrabajo(nombre) {
  const trabajos = await leerTrabajos();

  // Busca el trabajo por nombre
  const trabajo = trabajos.find(t => t.nombre === nombre);

  if (!trabajo) {
    console.log(`No se encontró el trabajo con nombre: ${nombre}`);
    return;
  }

  const rutaBase = trabajo.rutaBase;
  const llamadas = trabajo.descripcion.llamadas;

  for (const llamada of llamadas) {

    const uuid = llamada.id;

    // Guardar el estado de la ejecución
    const ejecuciones = await leerEjecuciones();
    
    const indiceExistente = ejecuciones.findIndex(e => e.uuid === uuid);

    if (indiceExistente >= 0) {
      ejecuciones[indiceExistente].estado = "en ejecución";
    } else {
      ejecuciones.push({
        uuid: uuid,
        fechaHora: new Date().toLocaleString(),
        estado: "en ejecución"
      });

    }

    // Guardar el archivo actualizado
    await writeFile('./ejecuciones/ejecuciones.json', JSON.stringify(ejecuciones, null, 2));




    let resultadoRuta;
    if (llamada.tipo === "paralelo") {
      resultadoRuta = await ejecutarLlamadasParalelo(rutaBase, llamada);
    } else if (llamada.tipo === "serie") {
      resultadoRuta = await ejecutarLlamadasSerie(rutaBase, llamada);
    } else {
      console.log(`Tipo de llamada desconocido: ${llamada.tipo}`);
      continue;
    }

    console.log("Informe parcial:", JSON.stringify(resultadoRuta, null, 2));
    await agregarResultadoPorRuta(nombre, resultadoRuta);

    // Actualizar el estado de la ejecución a "terminado"
    const indice = ejecuciones.findIndex(e => e.uuid === uuid);
    ejecuciones[indice].estado = "terminado";

    // Guardar el archivo actualizado
    await writeFile('./ejecuciones/ejecuciones.json', JSON.stringify(ejecuciones, null, 2));

  }

  console.log("Trabajo finalizado:", nombre);
}

// Función para ejecutar llamadas en paralelo
async function ejecutarLlamadasParalelo(rutaBase, llamada) {
  const url = `${rutaBase}${llamada.ruta}`;
  let exitosas = 0;
  let fallidas = 0;
  let fallos = [];
  const totalLlamadas = llamada.cuantas;
  const bloque = llamada.bloque || 100; // Llamadas por bloque (default 100)

  console.log(`Ejecutando ${totalLlamadas} llamadas a ${url} en paralelo en bloques de ${bloque}...`);

  const inicio = Date.now(); // Marca de tiempo inicial

  for (let i = 0; i < totalLlamadas; i += bloque) {
    const llamadasEnEsteBloque = Math.min(bloque, totalLlamadas - i); // Llamadas que quedan por hacer
    const promises = [];

    for (let j = 0; j < llamadasEnEsteBloque; j++) {
      promises.push(
        hacerFetch(url, llamada)
          .then(() => exitosas++)
          .catch(() => {
            fallidas++;
            fallos.push(i + j + 1); // Guarda el índice de la llamada fallida
          })
      );
    }

    // Espera a que se completen las llamadas en este bloque antes de seguir
    await Promise.all(promises);
  }

  const tiempoTotal = Date.now() - inicio; // Tiempo total que tomó la ruta

  // Retorna el informe de esta ruta
  return {
    id: llamada.id,  // Incluye el id de la llamada en el resultado
    nombre: llamada.descripcion,  // Descripción de la llamada
    ruta: llamada.ruta,
    metodo: llamada.metodo,
    llamadasTotales: totalLlamadas,
    bloques: llamada.bloque,
    exitosas: exitosas,
    fallidas: fallidas,
    tiempoTotal: `${tiempoTotal} ms`
  };
}

// Función para ejecutar llamadas en serie
async function ejecutarLlamadasSerie(rutaBase, llamada) {
  const url = `${rutaBase}${llamada.ruta}`;
  let exitosas = 0;
  let fallidas = 0;
  let fallos = [];
  const totalLlamadas = llamada.cuantas;

  console.log(`Ejecutando ${totalLlamadas} llamadas en serie a ${url}...`);

  const inicio = Date.now(); // Marca de tiempo inicial

  for (let i = 0; i < totalLlamadas; i++) {
    try {
      await hacerFetch(url, llamada);
      exitosas++;
    } catch (error) {
      fallidas++;
      fallos.push(i + 1); // Guarda el índice de la llamada fallida
    }
  }

  const tiempoTotal = Date.now() - inicio; // Tiempo total que tomó la ruta

  // Retorna el informe de esta ruta
  return {
    id: llamada.id,  // Incluye el id de la llamada en el resultado
    nombre: llamada.descripcion,  // Descripción de la llamada
    ruta: llamada.ruta,
    metodo: llamada.metodo,
    llamadasTotales: totalLlamadas,
    exitosas: exitosas,
    fallidas: fallidas,
    tiempoTotal: `${tiempoTotal} ms`
  };
}

// Función para realizar la petición HTTP
async function hacerFetch(url, llamada) {
  const options = {
    method: llamada.metodo,
    headers: { 'Content-Type': 'application/json' }
  };

  if (llamada.metodo === 'POST' && llamada.adjunto) {
    options.body = llamada.adjunto;
  }

  const response = await fetch(url, options);

  // Verifica si la respuesta fue exitosa
  if (!response.ok) {
    throw new Error(`Error en la llamada a ${url} con código: ${response.status}`);
  }

  // Verificar el tipo de contenido para decidir cómo procesar la respuesta
  const contentType = response.headers.get('Content-Type');

  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    return data; // Procesar como JSON
  } else if (contentType && contentType.includes('text/plain')) {
    const data = await response.text();
    return data; // Procesar como texto plano
  } else {
    throw new Error(`Tipo de contenido no esperado: ${contentType}`);
  }
}

// Función para ejecutar una ruta específica por su UUID
export async function ejecutarRuta(uuid) {
  const trabajos = await leerTrabajos();

  // Recorremos los trabajos buscando la ruta que coincida con el UUID
  for (const trabajo of trabajos) {
    const rutaBase = trabajo.rutaBase;
    const llamadas = trabajo.descripcion.llamadas;

    // Buscamos en las llamadas la ruta con el UUID dado
    const llamada = llamadas.find(llamada => llamada.id === uuid);

    if (llamada) {

      // En el archivo de ejecuciones (./ejecuciones/ejecuciones.json) añadimos el uuid de la ruta con estado "en ejecución"
      // Para que el front-end pueda mostrar que la ruta está en ejecución
      // Si ya existe, se actualiza el estado a "en ejecución"

      const ejecuciones = await leerEjecuciones();

      const indiceExistente = ejecuciones.findIndex(e => e.uuid === uuid);

      if (indiceExistente >= 0) {
        ejecuciones[indiceExistente].estado = "en ejecución";
      } else {
        ejecuciones.push({
          uuid: uuid,
          fechaHora: new Date().toLocaleString(),
          estado: "en ejecución"
        });
      }

      // Guardar el archivo actualizado
      await writeFile('./ejecuciones/ejecuciones.json', JSON.stringify(ejecuciones, null, 2));




      let resultadoRuta;

      if (llamada.tipo === "paralelo") {
        resultadoRuta = await ejecutarLlamadasParalelo(rutaBase, llamada);
      } else if (llamada.tipo === "serie") {
        resultadoRuta = await ejecutarLlamadasSerie(rutaBase, llamada);
      } else {
        console.log(`Tipo de llamada desconocido: ${llamada.tipo}`);
        return;
      }

      // Guardar los resultados
      await agregarResultadoPorRuta(trabajo.nombre, resultadoRuta);

      // Actualizar el estado de la ejecución a "terminado"
      const indice = ejecuciones.findIndex(e => e.uuid === uuid);
      ejecuciones[indice].estado = "terminado";

      // Guardar el archivo actualizado
      await writeFile('./ejecuciones/ejecuciones.json', JSON.stringify(ejecuciones, null, 2));

      console.log(`Ruta con UUID ${uuid} ejecutada exitosamente.`);
      console.log("Informe:", JSON.stringify(resultadoRuta, null, 2));
      return; // Salimos después de ejecutar la ruta
    }
  }

  // Si no se encontró ninguna ruta con ese UUID
  console.log(`No se encontró ninguna ruta con UUID: ${uuid}`);
}

// Función para leer el archivo de ejecuciones
async function leerEjecuciones() {
  const archivoEjecuciones = await readFile('./ejecuciones/ejecuciones.json', { encoding: 'utf-8' });
  return JSON.parse(archivoEjecuciones);
}

export async function verEjecucion(uuid) {
  const ejecuciones = await leerEjecuciones();
  const indice = ejecuciones.findIndex(e => e.uuid === uuid);

  if (indice >= 0) {
    // return JSON.stringify(ejecuciones[indice], null, 2);
    // devolver el valor del campo estado
    return ejecuciones[indice].estado;
  } else {
    return `No se encontró ninguna ejecución con UUID: ${uuid}`;
  }
}


// Llamar la función para ejecutar un trabajo
// ejecutarTrabajo('qq2');

// Llamar la función para ejecutar una ruta específica por su UUID
// ejecutarRuta('89214f89-1c5c-4886-9bd2-7848099f6630');
