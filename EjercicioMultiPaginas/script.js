// Estructura de datos para almacenar toda la información
let datos = { 
    persona: {}, 
    familiares: [], 
    condiciones: [], 
    internamientos: [] 
};

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del localStorage si existen
    const datosGuardados = localStorage.getItem('formularioDatos');
    if (datosGuardados) {
        datos = JSON.parse(datosGuardados);
        mostrarDatos();
        mostrarFamiliares();
        mostrarCondiciones();
        mostrarInternamientos();
    }
    
    // Actualizar lista de personas para familiares
    actualizarListaPersonas();
});

// Función para cambiar entre páginas
function cambiarPagina(pagina) {
    // Ocultar todas las páginas
    document.querySelectorAll('.container > div[id^="pagina"]').forEach(div => {
        div.classList.add('hidden');
    });
    
    // Mostrar la página solicitada
    document.getElementById(`pagina${pagina}`).classList.remove('hidden');
    
    // Actualizar la barra de progreso
    actualizarBarraProgreso(pagina);
    
    // Acciones específicas para cada página
    if (pagina === 2) {
        actualizarListaPersonas();
    } else if (pagina === 5) {
        mostrarResumenFinal();
    }
}

// Función para actualizar la barra de progreso
function actualizarBarraProgreso(paginaActiva) {
    // Resetear todos los pasos
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step${i}`);
        step.classList.remove('step-active', 'step-completed');
        
        if (i < paginaActiva) {
            step.classList.add('step-completed');
        } else if (i === paginaActiva) {
            step.classList.add('step-active');
        }
    }
}

// Función para guardar los datos personales
function guardarDatos() {
    // Validar formulario
    if (!validarFormulario('formDatosPersonales')) {
        return;
    }
    
    // Guardar datos
    datos.persona = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        edad: document.getElementById("edad").value,
        sexo: document.getElementById("sexo").value
    };
    
    // Mostrar datos guardados
    mostrarDatos();
    
    // Mostrar mensaje de éxito
    mostrarMensaje('mensajeGuardado', 'Datos guardados correctamente!', true);
    
    // Guardar en localStorage
    guardarEnLocalStorage();
}

// Función para editar los datos personales
function editarDatos() {
    if (Object.keys(datos.persona).length === 0) {
        mostrarMensaje('mensajeGuardado', 'No hay datos guardados para editar', false);
        return;
    }
    
    document.getElementById("nombre").value = datos.persona.nombre || "";
    document.getElementById("apellido").value = datos.persona.apellido || "";
    document.getElementById("edad").value = datos.persona.edad || "";
    document.getElementById("sexo").value = datos.persona.sexo || "";
    
    mostrarMensaje('mensajeGuardado', 'Datos cargados para edición', true);
}

// Función para mostrar los datos personales guardados
function mostrarDatos() {
    if (Object.keys(datos.persona).length === 0) {
        document.getElementById("datosMostrados").classList.add('hidden');
        return;
    }
    
    document.getElementById("displayNombre").textContent = datos.persona.nombre;
    document.getElementById("displayApellido").textContent = datos.persona.apellido;
    document.getElementById("displayEdad").textContent = datos.persona.edad;
    document.getElementById("displaySexo").textContent = datos.persona.sexo;
    
    document.getElementById("datosMostrados").classList.remove('hidden');
}

// Función para actualizar la lista de personas en el formulario de familiares
function actualizarListaPersonas() {
    const selectPertenece = document.getElementById("famPertenece");
    selectPertenece.innerHTML = '';
    
    // Agregar la persona principal
    if (datos.persona.nombre && datos.persona.apellido) {
        const option = document.createElement("option");
        option.value = "principal";
        option.textContent = `${datos.persona.nombre} ${datos.persona.apellido} (Yo)`;
        selectPertenece.appendChild(option);
    }
    
    // Agregar familiares ya registrados
    datos.familiares.forEach(familiar => {
        const option = document.createElement("option");
        option.value = familiar.nombre;
        option.textContent = `${familiar.nombre} (${familiar.parentesco})`;
        selectPertenece.appendChild(option);
    });
}

// Función para agregar un familiar
function agregarFamiliar() {
    // Validar formulario
    if (!validarFormulario('formFamiliares')) {
        return;
    }
    
    const nombre = document.getElementById("famNombre").value.trim();
    const parentesco = document.getElementById("famParentesco").value;
    const pertenece = document.getElementById("famPertenece").value;
    const edad = document.getElementById("famEdad").value;
    
    // Crear objeto familiar
    const familiar = { 
        nombre, 
        parentesco, 
        pertenece, 
        edad 
    };
    
    // Agregar a la lista
    datos.familiares.push(familiar);
    
    // Mostrar en la lista
    mostrarFamiliares();
    
    // Actualizar lista de personas
    actualizarListaPersonas();
    
    // Limpiar formulario
    document.getElementById("formFamiliares").reset();
    
    // Mostrar mensaje de éxito
    mostrarMensaje('mensajeGuardadoFam', 'Familiar agregado correctamente!', true);
    
    // Guardar en localStorage
    guardarEnLocalStorage();
}

// Función para mostrar la lista de familiares
function mostrarFamiliares() {
    const lista = document.getElementById("listaFamiliares");
    lista.innerHTML = "";
    
    if (datos.familiares.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No hay familiares registrados";
        lista.appendChild(li);
        return;
    }
    
    datos.familiares.forEach((familiar, index) => {
        const li = document.createElement("li");
        
        // Determinar a quién pertenece
        let perteneceTexto = "";
        if (familiar.pertenece === "principal") {
            perteneceTexto = `${datos.persona.nombre} ${datos.persona.apellido}`;
        } else {
            // Buscar el familiar al que pertenece
            const familiarPertenece = datos.familiares.find(f => f.nombre === familiar.pertenece);
            if (familiarPertenece) {
                perteneceTexto = familiarPertenece.nombre;
            } else {
                perteneceTexto = familiar.pertenece;
            }
        }
        
        li.innerHTML = `
            <div>
                <strong>${familiar.parentesco} de ${perteneceTexto}:</strong> 
                ${familiar.nombre} (${familiar.edad} años)
            </div>
            <div>
                <button onclick="editarFamiliar(${index})">Editar</button>
                <button onclick="eliminarFamiliar(${index})">Eliminar</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

// Función para editar un familiar
function editarFamiliar(index) {
    const familiar = datos.familiares[index];
    
    document.getElementById("famNombre").value = familiar.nombre;
    document.getElementById("famParentesco").value = familiar.parentesco;
    document.getElementById("famPertenece").value = familiar.pertenece;
    document.getElementById("famEdad").value = familiar.edad;
    
    // Eliminar el familiar de la lista para reemplazarlo
    datos.familiares.splice(index, 1);
    
    // Actualizar la lista mostrada
    mostrarFamiliares();
    
    mostrarMensaje('mensajeGuardadoFam', 'Familiar cargado para edición', true);
}

// Función para eliminar un familiar
function eliminarFamiliar(index) {
    if (confirm("¿Está seguro que desea eliminar este familiar?")) {
        datos.familiares.splice(index, 1);
        mostrarFamiliares();
        actualizarListaPersonas();
        guardarEnLocalStorage();
        mostrarMensaje('mensajeGuardadoFam', 'Familiar eliminado correctamente', true);
    }
}

// Función para agregar una condición de salud
function agregarCondicion() {
    // Validar formulario
    if (!validarFormulario('formCondicionesSalud')) {
        return;
    }
    
    const enfermedad = document.getElementById("condEnfermedad").value.trim();
    const tiempo = document.getElementById("condTiempo").value;
    
    // Crear objeto condición
    const condicion = { 
        enfermedad, 
        tiempo 
    };
    
    // Agregar a la lista
    datos.condiciones.push(condicion);
    
    // Mostrar en la lista
    mostrarCondiciones();
    
    // Limpiar formulario
    document.getElementById("formCondicionesSalud").reset();
    
    // Mostrar mensaje de éxito
    mostrarMensaje('mensajeGuardadoCond', 'Condición agregada correctamente!', true);
    
    // Guardar en localStorage
    guardarEnLocalStorage();
}

// Función para mostrar la lista de condiciones de salud
function mostrarCondiciones() {
    const lista = document.getElementById("listaCondiciones");
    lista.innerHTML = "";
    
    if (datos.condiciones.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No hay condiciones registradas";
        lista.appendChild(li);
        return;
    }
    
    datos.condiciones.forEach((condicion, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <strong>${condicion.enfermedad}</strong> - 
                Tiempo: ${condicion.tiempo} años
            </div>
            <div>
                <button onclick="editarCondicion(${index})">Editar</button>
                <button onclick="eliminarCondicion(${index})">Eliminar</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

// Función para editar una condición de salud
function editarCondicion(index) {
    const condicion = datos.condiciones[index];
    
    document.getElementById("condEnfermedad").value = condicion.enfermedad;
    document.getElementById("condTiempo").value = condicion.tiempo;
    
    // Eliminar la condición de la lista para reemplazarla
    datos.condiciones.splice(index, 1);
    
    // Actualizar la lista mostrada
    mostrarCondiciones();
    
    mostrarMensaje('mensajeGuardadoCond', 'Condición cargada para edición', true);
}

// Función para eliminar una condición de salud
function eliminarCondicion(index) {
    if (confirm("¿Está seguro que desea eliminar esta condición?")) {
        datos.condiciones.splice(index, 1);
        mostrarCondiciones();
        guardarEnLocalStorage();
        mostrarMensaje('mensajeGuardadoCond', 'Condición eliminada correctamente', true);
    }
}

// Función para agregar un internamiento
function agregarInternamiento() {
    // Validar formulario
    if (!validarFormulario('formInternamientos')) {
        return;
    }
    
    const fecha = document.getElementById("intFecha").value;
    const centro = document.getElementById("intCentro").value.trim();
    const diagnostico = document.getElementById("intDiagnostico").value.trim();
    
    // Crear objeto internamiento
    const internamiento = { 
        fecha, 
        centro, 
        diagnostico 
    };
    
    // Agregar a la lista
    datos.internamientos.push(internamiento);
    
    // Mostrar en la lista
    mostrarInternamientos();
    
    // Limpiar formulario
    document.getElementById("formInternamientos").reset();
    
    // Mostrar mensaje de éxito
    mostrarMensaje('mensajeGuardadoIntern', 'Internamiento agregado correctamente!', true);
    
    // Guardar en localStorage
    guardarEnLocalStorage();
}

// Función para mostrar la lista de internamientos
function mostrarInternamientos() {
    const lista = document.getElementById("listaInternamientos");
    lista.innerHTML = "";
    
    if (datos.internamientos.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No hay internamientos registrados";
        lista.appendChild(li);
        return;
    }
    
    datos.internamientos.forEach((internamiento, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <strong>${formatearFecha(internamiento.fecha)}</strong> - 
                ${internamiento.centro}<br>
                ${internamiento.diagnostico}
            </div>
            <div>
                <button onclick="editarInternamiento(${index})">Editar</button>
                <button onclick="eliminarInternamiento(${index})">Eliminar</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

// Función para formatear fecha
function formatearFecha(fechaStr) {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES');
}

// Función para editar un internamiento
function editarInternamiento(index) {
    const internamiento = datos.internamientos[index];
    
    document.getElementById("intFecha").value = internamiento.fecha;
    document.getElementById("intCentro").value = internamiento.centro;
    document.getElementById("intDiagnostico").value = internamiento.diagnostico;
    
    // Eliminar el internamiento de la lista para reemplazarlo
    datos.internamientos.splice(index, 1);
    
    // Actualizar la lista mostrada
    mostrarInternamientos();
    
    mostrarMensaje('mensajeGuardadoIntern', 'Internamiento cargado para edición', true);
}

// Función para eliminar un internamiento
function eliminarInternamiento(index) {
    if (confirm("¿Está seguro que desea eliminar este internamiento?")) {
        datos.internamientos.splice(index, 1);
        mostrarInternamientos();
        guardarEnLocalStorage();
        mostrarMensaje('mensajeGuardadoIntern', 'Internamiento eliminado correctamente', true);
    }
}

// Función para mostrar el resumen final
function mostrarResumenFinal() {
    // Datos personales
    document.getElementById("resumenNombre").textContent = datos.persona.nombre || "No registrado";
    document.getElementById("resumenApellido").textContent = datos.persona.apellido || "No registrado";
    document.getElementById("resumenEdad").textContent = datos.persona.edad || "No registrado";
    document.getElementById("resumenSexo").textContent = datos.persona.sexo || "No registrado";
    
    // Familiares
    const resumenFamiliares = document.getElementById("resumenFamiliares");
    resumenFamiliares.innerHTML = "";
    
    if (datos.familiares.length > 0) {
        datos.familiares.forEach(familiar => {
            const li = document.createElement("li");
            li.textContent = `${familiar.nombre} / ${familiar.parentesco} / ${familiar.edad} años`;
            resumenFamiliares.appendChild(li);
        });
    } else {
        resumenFamiliares.innerHTML = "<li>No hay familiares registrados</li>";
    }
    
    // Condiciones de salud
    const resumenCondiciones = document.getElementById("resumenCondiciones");
    resumenCondiciones.innerHTML = "";
    
    if (datos.condiciones.length > 0) {
        datos.condiciones.forEach(condicion => {
            const li = document.createElement("li");
            li.textContent = `${condicion.enfermedad} - ${condicion.tiempo} años`;
            resumenCondiciones.appendChild(li);
        });
    } else {
        resumenCondiciones.innerHTML = "<li>No hay condiciones registradas</li>";
    }
    
    // Internamientos
    const resumenInternamientos = document.getElementById("resumenInternamientos");
    resumenInternamientos.innerHTML = "";
    
    if (datos.internamientos.length > 0) {
        datos.internamientos.forEach(internamiento => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${formatearFecha(internamiento.fecha)}</strong> - 
                ${internamiento.centro}<br>
                <em>${internamiento.diagnostico}</em>
            `;
            resumenInternamientos.appendChild(li);
        });
    } else {
        resumenInternamientos.innerHTML = "<li>No hay internamientos registrados</li>";
    }
}

// Función para volver al inicio
function volverAlInicio() {
    cambiarPagina(1);
    mostrarMensaje('mensajeGuardado', 'Formulario completado. Puede editar los datos si lo desea.', true);
}

// Funciones de validación antes de cambiar de página
function validarPagina1() {
    if (Object.keys(datos.persona).length === 0) {
        mostrarMensaje('mensajeGuardado', 'Debe guardar los datos personales primero', false);
        return;
    }
    cambiarPagina(2);
}

function validarPagina2() {
    cambiarPagina(3);
}

function validarPagina3() {
    cambiarPagina(4);
}

function validarPagina4() {
    cambiarPagina(5);
}

// Función para guardar datos en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('formularioDatos', JSON.stringify(datos));
}

// Función para mostrar mensajes
function mostrarMensaje(elementId, mensaje, esExito) {
    const elemento = document.getElementById(elementId);
    elemento.textContent = mensaje;
    elemento.classList.remove('hidden', 'success', 'error');
    elemento.classList.add(esExito ? 'success' : 'error');
    
    setTimeout(() => {
        elemento.classList.add('hidden');
    }, 3000);
}

// Función para validar formularios
function validarFormulario(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('[required]');
    let valido = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            valido = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    return valido;
}