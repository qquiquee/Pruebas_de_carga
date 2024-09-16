let objTest = [];

function listDirectory() {
    const directory = prompt('Enter the directory to list:');
    fetch(`/list-directory?dir=${encodeURIComponent(directory)}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('output').innerText = data;
        })
        .catch(error => {
            document.getElementById('output').innerText = `Error: ${error}`;
        });
}

function init() {
    let output = document.getElementById('output');

    // Para manejar que solo un trabajo esté expandido
    let lastSelected = null;

    fetch(`/trabajos`)
        .then(response => response.json())
        .then(elJson => {
            objTest = elJson;
            // console.log(objTest);

            // Vaciar el contenido previo de output
            output.innerHTML = 'Trabajos disponibles:<br><br>';

            // Crear un grupo de botones de radio único
            let radioGroup = document.createElement("form");

            // Recorrer el JSON y capturar las diferentes rutas base y nombres
            elJson.forEach((trabajo, index) => {
                let trabajoDiv = document.createElement("div");

                // Crear un contenedor para el radio button y el nombre
                let radioLabel = document.createElement("label");
                radioLabel.style.display = "flex";
                radioLabel.style.alignItems = "center"; // Para que el radio button y el texto estén alineados

                // Crear el botón de selección
                let radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "trabajoSelector"; // Para que todos los radios sean parte del mismo grupo
                radio.style.marginRight = "10px";

                // Cuando el radio cambia, se muestra solo el trabajo seleccionado
                radio.onchange = function () {
                    const divTrabajoSeleccionado = document.getElementById(`trabajoSeleccionado`);

                    if (lastSelected && lastSelected !== trabajoDiv) {
                        // Ocultar el último seleccionado
                        lastSelected.querySelector('.detalles').style.display = "none";
                    }
                    let detalles = trabajoDiv.querySelector('.detalles');
                    detalles.style.display = "block";
                    lastSelected = trabajoDiv;

                    divTrabajoSeleccionado.innerText = trabajo.nombre;
                };

                // Crear el texto del título que se mostrará junto al radio button
                let titulo = document.createElement("span");
                titulo.innerHTML = trabajo.nombre;
                titulo.style.cursor = "pointer";
                titulo.style.color = "#00FF00"; // Color verde estilo terminal

                // Añadir el radio button y el nombre al label
                radioLabel.appendChild(radio);
                radioLabel.appendChild(titulo);

                // Agregar el label al contenedor del trabajo
                trabajoDiv.appendChild(radioLabel);

                // Crear un div con los detalles que estará oculto inicialmente
                let detallesDiv = document.createElement("div");
                detallesDiv.classList.add("detalles");
                detallesDiv.style.display = "none"; // Oculto por defecto
                detallesDiv.style.marginLeft = "20px"; // Desplazar los detalles hacia la derecha

                // Agregar la rutaBase del trabajo
                let rutaBase = document.createElement("p");
                rutaBase.innerHTML = `<strong style="color:#FF7700;">Ruta Base:</strong> ${trabajo.rutaBase}`;
                rutaBase.style.marginLeft = "20px"; // Alinear con el contenido tabulado
                detallesDiv.appendChild(rutaBase);

                // Agregar la información del trabajo
                let descripcion = document.createElement("p");
                descripcion.innerHTML = `
                    <strong style="color:#FF7700;">Título:</strong> ${trabajo.descripcion.titulo}<br>
                    <strong style="color:#FF7700;">Descripción:</strong> ${trabajo.descripcion.descripcion}<br>
                    <strong style="color:#FF7700;">Fecha:</strong> ${trabajo.descripcion.fecha}
                `;
                detallesDiv.appendChild(descripcion);

                // Crear un contenedor para las rutas con estilo tabulado
                let llamadasContainer = document.createElement("div");
                llamadasContainer.style.display = "grid";
                llamadasContainer.style.gridTemplateColumns = "1fr 2fr 1fr 1fr 1fr 1fr 1fr"; // Añadir columnas adicionales para "Método" y "Adjunto"
                llamadasContainer.style.gap = "10px"; // Espacio entre los elementos
                llamadasContainer.style.marginLeft = "20px"; // Alinear con el contenido

                // Crear encabezados para la tabla de rutas
                let headerRuta = document.createElement("strong");
                headerRuta.style.color = "#CC5500";
                headerRuta.textContent = "Ruta";
                llamadasContainer.appendChild(headerRuta);

                let headerDescripcion = document.createElement("strong");
                headerDescripcion.style.color = "#CC5500";
                headerDescripcion.textContent = "Descripción";
                llamadasContainer.appendChild(headerDescripcion);

                let headerCuantas = document.createElement("strong");
                headerCuantas.style.color = "#CC5500";
                headerCuantas.textContent = "Cuantas";
                llamadasContainer.appendChild(headerCuantas);

                let headerBloque = document.createElement("strong");
                headerBloque.style.color = "#CC5500";
                headerBloque.textContent = "Bloque";
                llamadasContainer.appendChild(headerBloque);

                let headerTipo = document.createElement("strong");
                headerTipo.style.color = "#CC5500";
                headerTipo.textContent = "Tipo";
                llamadasContainer.appendChild(headerTipo);

                let headerMetodo = document.createElement("strong"); // Encabezado para el método
                headerMetodo.style.color = "#CC5500";
                headerMetodo.textContent = "Método";
                llamadasContainer.appendChild(headerMetodo);

                let headerAcciones = document.createElement("strong");
                headerAcciones.style.color = "#CC5500";
                headerAcciones.textContent = "Acción";
                llamadasContainer.appendChild(headerAcciones);

                // Añadir cada llamada al contenedor de rutas
                trabajo.descripcion.llamadas.forEach(llamada => {
                    let ruta = document.createElement("span");
                    ruta.textContent = llamada.ruta;
                    ruta.setAttribute("data-uuid", llamada.id);
                    llamadasContainer.appendChild(ruta);

                    let descripcion = document.createElement("span");
                    descripcion.textContent = llamada.descripcion;
                    llamadasContainer.appendChild(descripcion);

                    let cuantas = document.createElement("span");
                    cuantas.textContent = llamada.cuantas;
                    llamadasContainer.appendChild(cuantas);

                    let bloque = document.createElement("span");
                    bloque.textContent = llamada.bloque || "N/A"; // Si no hay bloque, mostrar "N/A"
                    llamadasContainer.appendChild(bloque);

                    let tipo = document.createElement("span");
                    tipo.textContent = llamada.tipo;
                    llamadasContainer.appendChild(tipo);

                    let metodo = document.createElement("span");
                    metodo.textContent = llamada.metodo || "GET"; // Si no hay método, mostrar GET como predeterminado
                    llamadasContainer.appendChild(metodo);

                    // Crear un select para las acciones
                    let selectAccion = document.createElement("select");
                    selectAccion.style.width = "50%";

                    // Opción por defecto
                    let optionDefault = document.createElement("option");
                    optionDefault.textContent = "Seleccione una acción";
                    optionDefault.value = "";
                    optionDefault.selected = true;

                    // Opción para abrir la ruta
                    let optionAbrir = document.createElement("option");
                    optionAbrir.textContent = "Abrir ruta";
                    optionAbrir.value = "abrir";

                    // Opción para ejecutar la ruta
                    let optionEjecutar = document.createElement("option");
                    optionEjecutar.textContent = "Ejecutar ruta";
                    optionEjecutar.value = "ejecutar";

                    // Opcion para ver resultados de la ruta
                    let optionVer = document.createElement("option");
                    optionVer.textContent = "Ver resultados";
                    optionVer.value = "ver";

                    // Añadir las opciones al select
                    selectAccion.appendChild(optionDefault);
                    selectAccion.appendChild(optionAbrir);
                    selectAccion.appendChild(optionEjecutar);
                    selectAccion.appendChild(optionVer);

                    // Al cambiar la acción seleccionada, ejecuta la acción correspondiente
                    selectAccion.onchange = function () {
                        if (selectAccion.value === "abrir") {
                            let rutaCompleta = `${trabajo.rutaBase}${llamada.ruta}`;
                            window.open(rutaCompleta, '_blank');
                        } else if (selectAccion.value === "ejecutar") {
                            ejecutarRuta(llamada.id);
                        } else if (selectAccion.value === "ver") {
                            // Si el color del span con el uuid es rojo mostrar un alert con el mensaje la ruta se esta ejecutando, espere a que termine

                            const spanUuid = document.querySelector(`span[data-uuid="${llamada.id}"]`);
                            if (spanUuid.style.color === "red") {
                                alert("La ruta se está ejecutando, espere a que termine");
                            } else {

                                verResultados(llamada.id);
                            }
                        }
                    };

                    llamadasContainer.appendChild(selectAccion);
                });

                // Añadir el contenedor de rutas al div de detalles
                detallesDiv.appendChild(llamadasContainer);

                // Añadir el div de detalles al trabajo
                trabajoDiv.appendChild(detallesDiv);

                // Añadir el trabajo al grupo de radios
                radioGroup.appendChild(trabajoDiv);
            });

            // Añadir el grupo de radio buttons al contenedor principal
            output.appendChild(radioGroup);

            coloresRows();

        })
        .catch(error => {
            output.innerText = `Error: ${error}`;
        });

}



init();

function crearTrabajo() {
    // Crear el contenedor del modal
    const modal = document.createElement('div');
    modal.setAttribute('id', 'modal-trabajo');
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Crear el contenido del modal
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '70%';
    modalContent.style.height = '60%';
    modalContent.style.overflowY = 'auto'; // En caso de que el contenido sea más grande
    modalContent.style.position = 'relative';

    // Título del modal
    const title = document.createElement('h2');
    title.textContent = 'Añadir Nuevo Trabajo';
    // centrar el título
    title.style.textAlign = 'center';

    // Inputs del modal
    const nombreInput = document.createElement('input');
    nombreInput.setAttribute('type', 'text');
    nombreInput.setAttribute('placeholder', 'Nombre del trabajo');
    nombreInput.style.width = '100%';
    nombreInput.style.marginBottom = '10px';

    const rutaBaseInput = document.createElement('input');
    rutaBaseInput.setAttribute('type', 'text');
    rutaBaseInput.setAttribute('placeholder', 'Ruta base');
    rutaBaseInput.style.width = '100%';
    rutaBaseInput.style.marginBottom = '10px';

    const descripcionInput = document.createElement('textarea');
    descripcionInput.setAttribute('placeholder', 'Descripción del trabajo');
    descripcionInput.style.width = '100%';
    descripcionInput.style.marginBottom = '10px';

    // Campo de fecha con fecha actual por defecto
    const fechaInput = document.createElement('input');
    fechaInput.setAttribute('type', 'date');
    fechaInput.value = new Date().toISOString().slice(0, 10);
    fechaInput.style.width = '100%';
    fechaInput.style.marginBottom = '10px';

    // Crear una tabla para las rutas
    const tablaRutas = document.createElement('table');
    tablaRutas.style.width = '100%';
    tablaRutas.style.marginBottom = '10px';
    tablaRutas.style.borderCollapse = 'collapse';

    const tablaHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Cabeceras de la tabla (añadimos Método y Adjunto)
    ['Ruta', 'Descripción', 'Cuántas', 'Bloque', 'Tipo', 'Método', 'Adjunto', 'Acción'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.borderBottom = '1px solid #ddd';
        th.style.padding = '10px';
        headerRow.appendChild(th);
    });

    tablaHeader.appendChild(headerRow);
    tablaRutas.appendChild(tablaHeader);

    const tablaBody = document.createElement('tbody');
    tablaRutas.appendChild(tablaBody);

    // Función para añadir una nueva fila a la tabla
    const agregarRuta = () => {
        const row = document.createElement('tr');

        const rutaInput = document.createElement('input');
        rutaInput.setAttribute('type', 'text');
        rutaInput.setAttribute('placeholder', 'Ruta');

        const rutaDescInput = document.createElement('input');
        rutaDescInput.setAttribute('type', 'text');
        rutaDescInput.setAttribute('placeholder', 'Descripción');

        const cuantasInput = document.createElement('input');
        cuantasInput.setAttribute('type', 'number');
        cuantasInput.setAttribute('placeholder', 'Cuántas');

        const bloqueInput = document.createElement('input');
        bloqueInput.setAttribute('type', 'number');
        bloqueInput.setAttribute('placeholder', 'Bloque');

        // Crear el select para 'serie' o 'paralelo'
        const tipoSelect = document.createElement('select');
        const serieOption = document.createElement('option');
        serieOption.value = 'serie';
        serieOption.text = 'Serie';
        const paraleloOption = document.createElement('option');
        paraleloOption.value = 'paralelo';
        paraleloOption.text = 'Paralelo';
        tipoSelect.appendChild(serieOption);
        tipoSelect.appendChild(paraleloOption);

        // Campo para el método (GET, POST, PUT, DELETE)
        const metodoSelect = document.createElement('select');
        ['GET', 'POST', 'PUT', 'DELETE'].forEach(metodo => {
            const option = document.createElement('option');
            option.value = metodo;
            option.text = metodo;
            metodoSelect.appendChild(option);
        });

        // Campo para el adjunto
        const adjuntoInput = document.createElement('textarea');
        adjuntoInput.setAttribute('placeholder', 'Adjunto (JSON o texto)');
        adjuntoInput.style.width = '100%';

        const rutaCell = document.createElement('td');
        rutaCell.appendChild(rutaInput);
        rutaCell.style.padding = '10px';

        const descCell = document.createElement('td');
        descCell.appendChild(rutaDescInput);
        descCell.style.padding = '10px';

        const cuantasCell = document.createElement('td');
        cuantasCell.appendChild(cuantasInput);
        cuantasCell.style.padding = '10px';

        const bloqueCell = document.createElement('td');
        bloqueCell.appendChild(bloqueInput);
        bloqueCell.style.padding = '10px';

        const tipoCell = document.createElement('td');
        tipoCell.appendChild(tipoSelect);
        tipoCell.style.padding = '10px';

        const metodoCell = document.createElement('td'); // Nueva celda para método
        metodoCell.appendChild(metodoSelect);
        metodoCell.style.padding = '10px';

        const adjuntoCell = document.createElement('td'); // Nueva celda para adjunto
        adjuntoCell.appendChild(adjuntoInput);
        adjuntoCell.style.padding = '10px';

        const accionCell = document.createElement('td');
        accionCell.style.padding = '10px';
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar ruta';
        removeButton.onclick = () => row.remove();
        accionCell.appendChild(removeButton);

        row.appendChild(rutaCell);
        row.appendChild(descCell);
        row.appendChild(cuantasCell);
        row.appendChild(bloqueCell);
        row.appendChild(tipoCell);
        row.appendChild(metodoCell);  // Añadimos la celda del método
        row.appendChild(adjuntoCell); // Añadimos la celda del adjunto
        row.appendChild(accionCell);
        tablaBody.appendChild(row);
    };

    // Botón para agregar nuevas rutas
    const addRutaButton = document.createElement('button');
    addRutaButton.textContent = 'Añadir Otra Ruta';
    addRutaButton.style.marginBottom = '10px';
    addRutaButton.onclick = agregarRuta;

    // Añadir la primera ruta por defecto
    agregarRuta();

    // Contenedor para los botones
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    buttonsContainer.style.marginTop = '20px';
    buttonsContainer.style.marginBottom = '30px';

    // Botón para añadir el trabajo
    const addButton = document.createElement('button');
    addButton.textContent = 'Añadir Trabajo';
    addButton.style.marginRight = '10px';
    addButton.onclick = function () {
        const nombre = nombreInput.value;
        const rutaBase = rutaBaseInput.value;
        const descripcion = descripcionInput.value;
        const fecha = fechaInput.value;

        // Recoger las rutas
        const rutas = [];
        const rutaRows = tablaBody.querySelectorAll('tr');
        rutaRows.forEach(row => {
            const ruta = row.querySelector('td:nth-child(1) input').value;
            const rutaDesc = row.querySelector('td:nth-child(2) input').value;
            const cuantas = row.querySelector('td:nth-child(3) input').value;
            const bloque = row.querySelector('td:nth-child(4) input').value;
            const tipo = row.querySelector('td:nth-child(5) select').value;
            const metodo = row.querySelector('td:nth-child(6) select').value; // Recoger el método
            const adjunto = row.querySelector('td:nth-child(7) textarea').value; // Recoger el adjunto
            const idUnico = crypto.randomUUID() // Generar un ID único
            if (ruta && rutaDesc && cuantas && tipo) {
                rutas.push({ ruta: ruta, descripcion: rutaDesc, cuantas: Number(cuantas), bloque: Number(bloque), tipo: tipo, metodo: metodo, adjunto: adjunto, id: idUnico });
            }
        });

        // Validación para asegurarse de que hay al menos una ruta
        if (!nombre || !rutaBase || !descripcion || !fecha) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (rutas.length === 0) {
            alert('Por favor, añade al menos una ruta completamente. Todos los campos han de estar rellenos');
            return;
        }

        // Verificar si ya existe un trabajo con el mismo nombre en objTest
        const trabajoExistente = objTest.find(trabajo => trabajo.nombre.toLowerCase() === nombre.toLowerCase());
        if (trabajoExistente) {
            alert('Ya existe un trabajo con ese nombre. Por favor, elige otro nombre.');
            return;
        }

        // Crear el objeto de trabajo
        const nuevoTrabajo = {
            nombre: nombre,
            rutaBase: rutaBase,
            descripcion: {
                titulo: nombre,
                descripcion: descripcion,
                fecha: fecha,
                llamadas: rutas
            }
        };

        // Añadir el nuevo trabajo a objTest
        objTest.push(nuevoTrabajo);

        console.log('Nuevo trabajo añadido:', nuevoTrabajo);
        console.log('Estado actual de objTest:', objTest);

        // Cerrar el modal
        document.body.removeChild(modal);

        guardarTrabajos();
    };

    // Botón para cerrar el modal
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.onclick = function () {
        document.body.removeChild(modal);
    };

    // Añadir botones al contenedor de botones
    buttonsContainer.appendChild(addButton);
    buttonsContainer.appendChild(closeButton);

    // Añadir los elementos al modal
    modalContent.appendChild(title);
    modalContent.appendChild(buttonsContainer);
    modalContent.appendChild(nombreInput);
    modalContent.appendChild(rutaBaseInput);
    modalContent.appendChild(descripcionInput);
    modalContent.appendChild(fechaInput);
    modalContent.appendChild(tablaRutas);
    modalContent.appendChild(addRutaButton);

    // Añadir contenido al contenedor del modal
    modal.appendChild(modalContent);

    // Añadir el modal al body
    document.body.appendChild(modal);
}

// función guardarTrabajos
function guardarTrabajos() {
    fetch('/guardar-trabajos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objTest)
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            init();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ejecutarTrabajo() {
    const trabajoSeleccionado = document.getElementById('trabajoSeleccionado').innerText;
    fetch('/ejecutar-trabajo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ trabajo: trabajoSeleccionado })
    })
        .then(response => response.text())
        .then(data => {
            // coloresTrabajoEjecucion();
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function modificarTrabajo() {
    const trabajoSeleccionado = document.getElementById('trabajoSeleccionado').innerText;

    // Buscar el trabajo en objTest
    const trabajo = objTest.find(trabajo => trabajo.nombre.toLowerCase() === trabajoSeleccionado.toLowerCase());
    if (!trabajo) {
        alert('No se encontró el trabajo seleccionado.');
        return;
    }

    // Crear el contenedor del modal
    const modal = document.createElement('div');
    modal.setAttribute('id', 'modal-modificar-trabajo');
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Crear el contenido del modal
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '70%';
    modalContent.style.height = '60%';
    modalContent.style.overflowY = 'auto';
    modalContent.style.position = 'relative';

    // Título del modal
    const title = document.createElement('h2');
    title.textContent = `Modificar Trabajo: ${trabajo.nombre}`;
    title.style.textAlign = 'center';

    // Inputs del modal
    const nombreInput = document.createElement('input');
    nombreInput.setAttribute('type', 'text');
    nombreInput.setAttribute('placeholder', 'Nombre del trabajo');
    nombreInput.value = trabajo.nombre;
    nombreInput.style.width = '100%';
    nombreInput.style.marginBottom = '10px';

    const rutaBaseInput = document.createElement('input');
    rutaBaseInput.setAttribute('type', 'text');
    rutaBaseInput.setAttribute('placeholder', 'Ruta base');
    rutaBaseInput.value = trabajo.rutaBase;
    rutaBaseInput.style.width = '100%';
    rutaBaseInput.style.marginBottom = '10px';

    const descripcionInput = document.createElement('textarea');
    descripcionInput.setAttribute('placeholder', 'Descripción del trabajo');
    descripcionInput.value = trabajo.descripcion.descripcion;
    descripcionInput.style.width = '100%';
    descripcionInput.style.marginBottom = '10px';

    // Campo de fecha
    const fechaInput = document.createElement('input');
    fechaInput.setAttribute('type', 'date');
    fechaInput.value = trabajo.descripcion.fecha;
    fechaInput.style.width = '100%';
    fechaInput.style.marginBottom = '10px';

    // Crear una tabla para las rutas
    const tablaRutas = document.createElement('table');
    tablaRutas.style.width = '100%';
    tablaRutas.style.marginBottom = '10px';
    tablaRutas.style.borderCollapse = 'collapse';

    const tablaHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Ruta', 'Descripción', 'Cuántas', 'Bloque', 'Tipo', 'Método', 'Adjunto', 'Acción'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.borderBottom = '1px solid #ddd';
        th.style.padding = '10px';
        headerRow.appendChild(th);
    });
    tablaHeader.appendChild(headerRow);
    tablaRutas.appendChild(tablaHeader);

    const tablaBody = document.createElement('tbody');
    tablaRutas.appendChild(tablaBody);

    // Función para añadir una nueva fila a la tabla
    const agregarRuta = (ruta = '', descripcion = '', cuantas = 1, bloque = 1, tipo = 'serie', metodo = 'GET', adjunto = '', id = crypto.randomUUID()) => {
        const row = document.createElement('tr');

        // Almacenar el UUID en un atributo `data-uuid`
        row.setAttribute('data-uuid', id);

        const rutaInput = document.createElement('input');
        rutaInput.setAttribute('type', 'text');
        rutaInput.setAttribute('placeholder', 'Ruta');
        rutaInput.value = ruta;

        const rutaDescInput = document.createElement('input');
        rutaDescInput.setAttribute('type', 'text');
        rutaDescInput.setAttribute('placeholder', 'Descripción');
        rutaDescInput.value = descripcion;

        const cuantasInput = document.createElement('input');
        cuantasInput.setAttribute('type', 'number');
        cuantasInput.setAttribute('placeholder', 'Cuántas');
        cuantasInput.value = cuantas;

        const bloqueInput = document.createElement('input');
        bloqueInput.setAttribute('type', 'number');
        bloqueInput.setAttribute('placeholder', 'Bloque');
        bloqueInput.value = bloque;

        const tipoSelect = document.createElement('select');
        const serieOption = document.createElement('option');
        serieOption.value = 'serie';
        serieOption.text = 'Serie';
        const paraleloOption = document.createElement('option');
        paraleloOption.value = 'paralelo';
        paraleloOption.text = 'Paralelo';
        tipoSelect.appendChild(serieOption);
        tipoSelect.appendChild(paraleloOption);
        tipoSelect.value = tipo;

        const metodoSelect = document.createElement('select');
        ['GET', 'POST', 'PUT', 'DELETE'].forEach(metodo => {
            const option = document.createElement('option');
            option.value = metodo;
            option.text = metodo;
            metodoSelect.appendChild(option);
        });
        metodoSelect.value = metodo;

        const adjuntoInput = document.createElement('textarea');
        adjuntoInput.setAttribute('placeholder', 'Adjunto (JSON o texto)');
        adjuntoInput.value = adjunto;
        adjuntoInput.style.width = '100%';

        const rutaCell = document.createElement('td');
        rutaCell.appendChild(rutaInput);
        rutaCell.style.padding = '10px';

        const descCell = document.createElement('td');
        descCell.appendChild(rutaDescInput);
        descCell.style.padding = '10px';

        const cuantasCell = document.createElement('td');
        cuantasCell.appendChild(cuantasInput);
        cuantasCell.style.padding = '10px';

        const bloqueCell = document.createElement('td');
        bloqueCell.appendChild(bloqueInput);
        bloqueCell.style.padding = '10px';

        const tipoCell = document.createElement('td');
        tipoCell.appendChild(tipoSelect);
        tipoCell.style.padding = '10px';

        const metodoCell = document.createElement('td');
        metodoCell.appendChild(metodoSelect);
        metodoCell.style.padding = '10px';

        const adjuntoCell = document.createElement('td');
        adjuntoCell.appendChild(adjuntoInput);
        adjuntoCell.style.padding = '10px';

        const accionCell = document.createElement('td');
        accionCell.style.padding = '10px';
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar ruta';
        removeButton.onclick = () => row.remove();
        accionCell.appendChild(removeButton);

        row.appendChild(rutaCell);
        row.appendChild(descCell);
        row.appendChild(cuantasCell);
        row.appendChild(bloqueCell);
        row.appendChild(tipoCell);
        row.appendChild(metodoCell);
        row.appendChild(adjuntoCell);
        row.appendChild(accionCell);
        tablaBody.appendChild(row);
    };

    // Cargar rutas existentes y ocultar su UUID en un atributo `data-uuid`
    trabajo.descripcion.llamadas.forEach(llamada => {
        agregarRuta(llamada.ruta, llamada.descripcion, llamada.cuantas, llamada.bloque, llamada.tipo, llamada.metodo, llamada.adjunto, llamada.id);
    });

    // Botón para agregar nuevas rutas
    const addRutaButton = document.createElement('button');
    addRutaButton.textContent = 'Añadir Otra Ruta';
    addRutaButton.style.marginBottom = '10px';
    addRutaButton.onclick = () => agregarRuta();

    // Contenedor para los botones
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    buttonsContainer.style.marginTop = '20px';
    buttonsContainer.style.marginBottom = '30px';

    // Botón para guardar los cambios
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Guardar Cambios';
    saveButton.onclick = function () {
        const nombre = nombreInput.value;
        const rutaBase = rutaBaseInput.value;
        const descripcion = descripcionInput.value;
        const fecha = fechaInput.value;

        const rutas = [];
        const rutaRows = tablaBody.querySelectorAll('tr');
        rutaRows.forEach(row => {
            const ruta = row.querySelector('td:nth-child(1) input').value;
            const rutaDesc = row.querySelector('td:nth-child(2) input').value;
            const cuantas = row.querySelector('td:nth-child(3) input').value;
            const bloque = row.querySelector('td:nth-child(4) input').value;
            const tipo = row.querySelector('td:nth-child(5) select').value;
            const metodo = row.querySelector('td:nth-child(6) select').value;
            const adjunto = row.querySelector('td:nth-child(7) textarea').value;

            // Obtener el UUID almacenado en el atributo `data-uuid`
            const idUnico = row.getAttribute('data-uuid');

            if (ruta && rutaDesc && cuantas && tipo && metodo) {
                rutas.push({ ruta: ruta, descripcion: rutaDesc, cuantas: Number(cuantas), bloque: Number(bloque), tipo: tipo, metodo: metodo, adjunto: adjunto, id: idUnico });
            }
        });

        if (!nombre || !rutaBase || !descripcion || !fecha || rutas.length === 0) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Actualizar el trabajo en objTest
        trabajo.nombre = nombre;
        trabajo.rutaBase = rutaBase;
        trabajo.descripcion.titulo = nombre;
        trabajo.descripcion.descripcion = descripcion;
        trabajo.descripcion.fecha = fecha;
        trabajo.descripcion.llamadas = rutas;

        console.log('Trabajo actualizado:', trabajo);
        console.log('Estado actual de objTest:', objTest);

        // Cerrar el modal
        document.body.removeChild(modal);

        guardarTrabajos();
    };

    // Botón para eliminar el trabajo
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar Trabajo';
    deleteButton.style.backgroundColor = 'red';
    deleteButton.style.color = 'white';
    deleteButton.onclick = function () {
        if (confirm('¿Estás seguro de que deseas eliminar este trabajo?')) {
            const index = objTest.indexOf(trabajo);
            if (index > -1) {
                objTest.splice(index, 1);
                console.log('Trabajo eliminado:', trabajo);
                console.log('Estado actual de objTest:', objTest);
                document.body.removeChild(modal);
                guardarTrabajos();
            }
        }
    };

    // Botón para cerrar el modal
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.onclick = function () {
        document.body.removeChild(modal);
    };

    // Añadir botones al contenedor de botones
    buttonsContainer.appendChild(saveButton);
    buttonsContainer.appendChild(deleteButton);
    buttonsContainer.appendChild(closeButton);

    // Añadir los elementos al modal
    modalContent.appendChild(title);
    modalContent.appendChild(buttonsContainer);
    modalContent.appendChild(nombreInput);
    modalContent.appendChild(rutaBaseInput);
    modalContent.appendChild(descripcionInput);
    modalContent.appendChild(fechaInput);
    modalContent.appendChild(tablaRutas);
    modalContent.appendChild(addRutaButton);

    // Añadir contenido al contenedor del modal
    modal.appendChild(modalContent);

    // Añadir el modal al body
    document.body.appendChild(modal);
}


function clonarTrabajo() {
    const trabajoSeleccionado = document.getElementById('trabajoSeleccionado').innerText
    // Buscar el trabajo en objTest
    const trabajo = objTest.find(trabajo => trabajo.nombre.toLowerCase() === trabajoSeleccionado.toLowerCase());
    if (!trabajo) {
        alert('No se encontró el trabajo seleccionado.');
        return;
    }

    // Solicitar el nuevo nombre para el trabajo clonado
    const nuevoNombre = prompt('Introduce el nuevo nombre para el trabajo clonado:');
    if (!nuevoNombre) {
        alert('El nombre del nuevo trabajo no puede estar vacío.');
        return;
    }

    // Verificar si ya existe un trabajo con el nuevo nombre
    const trabajoExistente = objTest.find(t => t.nombre.toLowerCase() === nuevoNombre.toLowerCase());
    if (trabajoExistente) {
        alert('Ya existe un trabajo con ese nombre. Por favor, elige otro nombre.');
        return;
    }

    // Clonar el trabajo seleccionado con el nuevo nombre
    const trabajoClonado = {
        nombre: nuevoNombre,
        rutaBase: trabajo.rutaBase,
        descripcion: {
            titulo: nuevoNombre,  // Cambiar también el título para que coincida con el nuevo nombre
            descripcion: trabajo.descripcion.descripcion,
            fecha: trabajo.descripcion.fecha,
            llamadas: trabajo.descripcion.llamadas.map(llamada => ({
                // Clonar cada llamada modificando el uuid de cada ruta

                // Añadir un nuevo id único para cada llamada
                ruta: llamada.ruta,
                descripcion: llamada.descripcion,
                cuantas: llamada.cuantas,
                bloque: llamada.bloque,
                tipo: llamada.tipo,
                metodo: llamada.metodo,
                adjunto: llamada.adjunto,
                id: crypto.randomUUID()


                // ...llamada // Clonamos cada llamada dentro del trabajo
            }))
        }
    };

    // Añadir el trabajo clonado a objTest
    objTest.push(trabajoClonado);

    console.log('Trabajo clonado:', trabajoClonado);
    console.log('Estado actual de objTest:', objTest);

    // Guardar los cambios en objTest (suponiendo que exista la función guardarTrabajos)
    guardarTrabajos();
}

function ejecutarRuta(uuid) {
    fetch(`/ejecutar-ruta`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uuid: uuid })
    })
        .then(response => response.text())
        .then(data => {
            console.log(`Ruta con UUID ${uuid} ejecutada:`, data);
        })
        .catch(error => {
            console.error(`Error al ejecutar la ruta con UUID ${uuid}:`, error);
        });
}

async function verResultados(uuid) {

    // Llamar a la ruta /ver-ejecucion con el UUID de la ruta

    // await fetch(`/ver-ejecucion`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ uuid: uuid })
    // })
    //     .then(response => response.text())
    //     .then(data => {

    //         if (data === 'en ejecución') {
    //             alert(`El estado de la ejecucion de la ruta con UUID ${uuid} es: ${data}, espera un momento y vuelve a intentarlo. Cuando la ruta este en blanco ya podras ver los resultados`);
    //             return;
    //         }

    //     })





    fetch(`/ver-resultados`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uuid: uuid })
    })
        .then(response => response.text())
        .then(data => {



            // mostrar el resultado en un modal
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.left = '0';
            modal.style.top = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';

            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.padding = '20px';
            modalContent.style.borderRadius = '8px';
            modalContent.style.width = '70%';
            modalContent.style.height = '60%';
            modalContent.style.overflowY = 'auto';
            modalContent.style.position = 'relative';

            const title = document.createElement('h2');
            title.textContent = 'Resultados de la Ruta';
            title.style.textAlign = 'center';

            const closeButton = document.createElement('button');
            closeButton.textContent = 'Cerrar';
            closeButton.onclick = function () {
                document.body.removeChild(modal);
            };

            const pre = document.createElement('pre');
            // Tamaño del texto
            pre.style.fontSize = '16px';
            pre.textContent = data;

            modalContent.appendChild(title);
            modalContent.appendChild(closeButton);
            modalContent.appendChild(pre);
            modal.appendChild(modalContent);

            document.body.appendChild(modal);



        })
        .catch(error => {
            console.error(`Error al ver los resultados de la ruta con UUID ${uuid}:`, error);
        });
}

async function coloresRows() {
    // Recorrer objTest y cada una de sus rutas
    for (let trabajo of objTest) {
        for (let llamada of trabajo.descripcion.llamadas) {
            const uuid = llamada.id;

            // Realiza el fetch para obtener el estado de la ruta
            await fetch(`/ver-ejecucion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uuid: uuid })
            })
                .then(response => response.text())
                .then(data => {
                    // Buscar el elemento en el DOM con el atributo data-uuid correspondiente
                    let elemento = document.querySelector(`[data-uuid="${uuid}"]`);

                    if (elemento) {
                        // Cambiar el color del elemento basado en el estado obtenido del fetch
                        if (data === 'en ejecución') {
                            elemento.style.color = 'red'; // En ejecución
                        } else {
                            if (elemento.style.color !== 'orange') {
                                elemento.style.color = 'white'; // Finalizado
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error(`Error al ver los resultados de la ruta con UUID ${uuid}:`, error);
                });
        }
    }
}

// poner las rutas del trabajo seleccionado a naraja
function coloresTrabajoEjecucion() {
    // seleccionar trabajo
    const trabajoSeleccionado = document.getElementById('trabajoSeleccionado').innerText;

    // Buscar el trabajo en objTest
    const trabajo = objTest.find(trabajo => trabajo.nombre.toLowerCase() === trabajoSeleccionado.toLowerCase());

    // Recorrer las rutas del trabajo
    trabajo.descripcion.llamadas.forEach(llamada => {
        const uuid = llamada.id;

        let elemento = document.querySelector(`[data-uuid="${uuid}"]`);
        elemento.style.color = 'orange'; // Se va a ejecutar un test

    });
}

// cada 30 segundos ejecutar la función coloresRows
setInterval(coloresRows, 5000);

