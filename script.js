
const trunc = (n) => Math.floor(n * 10) / 10;

// --- LÓGICA DE FILTRADO ---
function filterCourses() {
    const maj = document.getElementById('filterMajor').value;
    const cyc = document.getElementById('filterCycle').value;
    const select = document.getElementById('courseSelector');
    
    // Limpiar selector
    select.innerHTML = '<option value="" disabled selected>-- Selecciona Curso --</option>';

    const filtered = MASTER_DB.filter(c => {
        const cumpleCarrera = (maj === 'all') || (c.tags[maj] !== undefined);
        let cumpleCiclo = false;
        if (cyc === 'all') {
            cumpleCiclo = true;
        } else if (maj !== 'all') {
            cumpleCiclo = c.tags[maj] == cyc; 
        } else {
            cumpleCiclo = Object.values(c.tags).some(val => val == cyc);
        }
        return cumpleCarrera && cumpleCiclo;
    });
    
    filtered.forEach(c => select.add(new Option(c.name, c.id)));
}

function resetFilters() {
    document.getElementById('filterMajor').value = 'all';
    document.getElementById('filterCycle').value = 'all';
    filterCourses();
}

// --- AÑADIR FILA CON BLOQUEO DE DUPLICADOS ---
function addSelectedCourse() {
    const selector = document.getElementById('courseSelector');
    const courseId = selector.value;
    const course = MASTER_DB.find(c => c.id === courseId);
    if (!course) return;

    // Validación de duplicados
    const isDuplicate = Array.from(document.querySelectorAll('#tableBody tr'))
        .some(row => JSON.parse(row.dataset.course).id === courseId);
    
    if (isDuplicate) {
        alert(`El curso "${course.name}" ya está en la lista.`);
        return;
    }

    const tr = document.createElement('tr');
    tr.dataset.course = JSON.stringify(course);
    
    let nHTML = '';
    for(let i=1; i<=course.inputs; i++) {
        let p = `N${i}`;
        if(course.type === 'GENERIC_DROP1'|| course.type === 'INTROSW') p = `PC${i}`;
        else if(course.type==='QUIMICA') p = i<=4 ? `PC${i}` : `L${i-4}`;
        else if(course.type==='DACOMP') p = i<=4 ? `PC${i}` : (i<=6 ? `L${i-4}` : `M${i-6}`);
        else if(course.type==='FISICA') p = i<=5 ? `PC${i}` : `L${i-5}`;
        else if(['INTRO','REDACCION','ETICA','INTROSIST'].includes(course.type)) p = i<=4 ? `PC${i}` : (i==5 && course.type==='ETICA' ? 'M' : `M${i-4}`);
        else if(course.type === '5Pcs-1Mon') p = i<=5 ? `PC${i}` : 'M1';
        else if(course.type === '4Pcs-1Mon') p = i<=4 ? `PC${i}` : 'M1';
        nHTML += `<input type="number" class="n-grade" placeholder="${p}" oninput="calculate()">`;
    }

    tr.innerHTML = `
        <td><input type="text" class="input-name" value="${course.name}" readonly></td>
        <td><input type="number" class="input-cred" value="${course.cred}" readonly></td>
        <td><div class="grades-container">${nHTML}</div></td>
        <td>${course.hasExams ? `<div class="grades-container">
            <div class="col-exam"><span class="lbl-exam">EP</span><input type="number" class="n-grade ep" oninput="calculate()"></div>
            <div class="col-exam"><span class="lbl-exam">EF</span><input type="number" class="n-grade ef" oninput="calculate()"></div>
            <div class="col-exam"><span class="lbl-exam" style="color:#6366f1">ES</span><input type="number" class="n-grade es input-es" placeholder="Susti" disabled oninput="calculate()"></div>
        </div>` : '<span style="color:var(--text-muted)"></span>'}</td>
        <td><input type="number" class="n-grade man" style="width:70px" oninput="calculate()"></td>
        <td><div class="final-grade">-</div></td>
        <td><button class="btn-delete" onclick="this.closest('tr').remove(); calculate();">×</button></td>`;
    document.getElementById('tableBody').appendChild(tr);
    calculate();
}

// --- MOTOR DE CÁLCULO DUAL (DINÁMICO / ESTRICTO) ---
function calculate() {
    const mode = document.getElementById('calcMode').value;
    let tW = 0, tC = 0;

    document.querySelectorAll('#tableBody tr').forEach(row => {
        const c = JSON.parse(row.dataset.course);
        const man = row.querySelector('.man').value;
        const res = row.querySelector('.final-grade');
        
        const inputs = Array.from(row.querySelectorAll('.n-grade:not(.ep):not(.ef):not(.es):not(.man)'));
        const n = inputs.map(i => {
            const val = parseFloat(i.value);
            return isNaN(val) ? (mode === 'strict' ? 0 : null) : val;
        }).filter(v => v !== null);

        let PP = 0, Final = 0, ok = false;

        if (man !== "") { 
            Final = parseFloat(man); 
            ok = true; 
        } else if (n.length > 0 || mode === 'strict') {
            const count = mode === 'strict' ? c.inputs : n.length;
            
            if (c.type === 'DAC') {
                const pcs = n.slice(0, 4);
                const otros = n.slice(4, 8);
                let pPC = 0;
                if (pcs.length > 0) {
                    const sortedPCs = [...pcs].sort((a,b)=>b-a);
                    const divisorPC = mode === 'strict' ? 3 : Math.min(pcs.length, 3);
                    pPC = (sortedPCs.slice(0, 3).reduce((a,b)=>a+b, 0)) / (divisorPC || 1);
                }
                const sumOtros = otros.reduce((a,b)=>a+b, 0);
                const divOtros = mode === 'strict' ? 4 : otros.length;
                PP = (pPC * 3 + sumOtros) / (3 + divOtros);

            } else if (['GENERIC_DROP1','REALIDAD','INTRO_COMP','INTROSW'].includes(c.type)) {
                if (count >= 4) {
                    const sorted = [...n].sort((a,b)=>b-a);
                    PP = (sorted[0] + sorted[1] + sorted[2]) / 3;
                } else {
                    PP = n.reduce((a,b)=>a+b, 0) / (count || 1);
                }

            } else if (c.type === 'FISICA' || c.type === 'QUIMICA' || c.type === 'INTRO') {
                const split = (c.type === 'FISICA') ? 5 : 4;
                const pcs = n.slice(0, split);
                const labs = n.slice(split);
                const pcCount = mode === 'strict' ? split : pcs.length;
                let pPC = pcCount === split ? (pcs.sort((a,b)=>b-a).slice(0, split-1).reduce((a,b)=>a+b, 0))/(split-1) : (pcs.reduce((a,b)=>a+b, 0)/(pcCount || 1));
                const labCount = mode === 'strict' ? (c.inputs - split) : labs.length;
                let pL = labCount > 0 ? labs.reduce((a,b)=>a+b, 0) / labCount : pPC;
                PP = c.type === 'QUIMICA' ? (pPC*1 + pL*2)/3 : (pPC + pL)/2;

            } else if (c.type === '5Pcs-1Mon' || c.type === '4Pcs-1Mon') {
                // --- AQUÍ ESTÁ EL NUEVO CÓDIGO PERFECTAMENTE ENCAJADO ---
                const numPCs = c.type === '5Pcs-1Mon' ? 5 : 4;
                const pcsToKeep = c.type === '5Pcs-1Mon' ? 4 : 3;

                const gradeInputs = Array.from(row.querySelectorAll('.n-grade:not(.ep):not(.ef):not(.es):not(.man)'));
                const pcInputs = gradeInputs.slice(0, numPCs);
                const monoInput = gradeInputs[numPCs];

                const pcVals = pcInputs.map(i => parseFloat(i.value)).filter(v => !isNaN(v));
                const monoVal = parseFloat(monoInput.value);
                const hasMono = !isNaN(monoVal);

                if (mode === 'strict') {
                    while (pcVals.length < numPCs) pcVals.push(0);
                }

                const sortedPCs = [...pcVals].sort((a, b) => b - a);
                const bestPCs = sortedPCs.slice(0, pcsToKeep);
                const sumPCs = bestPCs.reduce((a, b) => a + b, 0);

                let totalSuma = sumPCs;
                let divisor = mode === 'strict' ? pcsToKeep : bestPCs.length;

                if (hasMono || mode === 'strict') {
                    totalSuma += (hasMono ? monoVal : 0);
                    divisor += 1;
                }

                PP = totalSuma / (divisor || 1);

            } else {
                PP = n.reduce((a,b)=>a+b, 0) / (count || 1);
            }
            ok = true;
        }

        if (man === "" && c.hasExams) {
            const epInp = row.querySelector('.ep');
            const efInp = row.querySelector('.ef');
            const esInp = row.querySelector('.es');
            let ep = parseFloat(epInp.value);
            let ef = parseFloat(efInp.value);
            const esVal = parseFloat(esInp.value);
            
            if (mode === 'strict') {
                if (isNaN(ep)) ep = 0;
                if (isNaN(ef)) ef = 0;
            }

            const w = c.w || {pp:1, ep:1, ef:2};
            let sW = 0, sG = 0;

            if (ok) { sG += PP * w.pp; sW += w.pp; }

            if (!isNaN(esVal) && trunc(sG / (sW || 1)) >= 6) {
                if (!isNaN(ep) && !isNaN(ef)) {
                    if (ep < ef) ep = esVal; else ef = esVal;
                } else if (!isNaN(ef)) ef = esVal;
                else if (!isNaN(ep)) ep = esVal;
            }

            if (!isNaN(ep)) { sG += ep * w.ep; sW += w.ep; }
            if (!isNaN(ef)) { sG += ef * w.ef; sW += w.ef; }

            if (sW > 0) { Final = sG / sW; ok = true; }

            esInp.disabled = !(ok && trunc(Final) >= 6);
            if (esInp.disabled) esInp.value = "";
            
        } else if (man === "" && !c.hasExams) {
            Final = PP;
        }

        if (ok) {
            const f = Math.floor(Final * 10) / 10;
            res.innerText = f.toFixed(1);
            res.style.color = f >= 10.5 ? '#10b981' : '#ef4444';
            tW += f * c.cred; tC += c.cred;
        } else { 
            res.innerText = "-"; 
        }
    });

    const avgD = document.getElementById('weightedAverage');
    const fAvg = tC > 0 ? (tW / tC) : 0;
    avgD.innerText = fAvg.toFixed(3);
    avgD.style.color = fAvg >= 10.5 ? '#06b6d4' : '#ef4444';
    document.getElementById('totalCredits').innerText = tC;
    saveData();
}

function createRow(course) {
    const tr = document.createElement('tr');
    tr.dataset.course = JSON.stringify(course);
    
    let nHTML = '';
    for(let i=1; i<=course.inputs; i++) {
        let p = `N${i}`;
        if(course.type === 'GENERIC_DROP1'|| course.type === 'INTROSW') p = `PC${i}`;
        else if(course.type==='QUIMICA') p = i<=4 ? `PC${i}` : `L${i-4}`;
        else if(course.type==='DACOMP') p = i<=4 ? `PC${i}` : (i<=6 ? `L${i-4}` : `M${i-6}`);
        else if(course.type==='FISICA') p = i<=5 ? `PC${i}` : `L${i-5}`;
        else if(['INTRO','REDACCION','ETICA','INTROSIST'].includes(course.type)) p = i<=4 ? `PC${i}` : (i==5 && course.type==='ETICA' ? 'M1' : `M${i-4}`);
        else if(course.type === '5Pcs-1Mon') p = i<=5 ? `PC${i}` : 'M1';
        else if(course.type === '4Pcs-1Mon') p = i<=4 ? `PC${i}` : 'M1';
        
        nHTML += `<input type="number" class="n-grade" placeholder="${p}" oninput="calculate()">`;
    }

    tr.innerHTML = `
        <td><input type="text" class="input-name" value="${course.name}" readonly></td>
        <td><input type="number" class="input-cred" value="${course.cred}" readonly></td>
        <td><div class="grades-container">${nHTML}</div></td>
        <td>${course.hasExams ? `<div class="grades-container">
            <div class="col-exam"><span class="lbl-exam">EP</span><input type="number" class="n-grade ep" oninput="calculate()"></div>
            <div class="col-exam"><span class="lbl-exam">EF</span><input type="number" class="n-grade ef" oninput="calculate()"></div>
            <div class="col-exam"><span class="lbl-exam" style="color:#6366f1">ES</span><input type="number" class="n-grade es input-es" placeholder="Susti" disabled oninput="calculate()"></div>
        </div>` : '<span style="color:var(--text-muted)"></span>'}</td>
        <td><input type="number" class="n-grade man" style="width:70px" oninput="calculate()"></td>
        <td><div class="final-grade">-</div></td>
        <td><button class="btn-delete" onclick="this.closest('tr').remove(); calculate();">×</button></td>`;
    
    return tr;
}

let currentSlot = "1";

// --- NUEVA FUNCIÓN: CAMBIAR DE SLOT ---
function switchSlot(slotNum) {
    // 1. Guardamos el estado actual antes de cambiar para no perder nada
    saveData(); 
    
    // 2. Cambiamos el puntero al nuevo slot
    currentSlot = slotNum;
    
    // 3. Guardamos en memoria cuál fue el último slot que usamos
    localStorage.setItem('notas_app_last_slot', currentSlot);
    
    // 4. Cargamos los datos del nuevo slot
    loadData();
    updateSlotUI();
}
// --- NUEVAS FUNCIONES PARA LOS NOMBRES DE LOS SLOTS ---

// Obtener los nombres guardados o usar los por defecto
function getSlotNames() {
    return JSON.parse(localStorage.getItem('notas_app_slot_names')) || {};
}

function renameCurrentSlot(event) {
    event.stopPropagation(); // Evita que se disparen otros clics
    
    let names = getSlotNames();
    let currentName = names[currentSlot] || ("Slot " + currentSlot);
    
    // Le preguntamos al usuario el nuevo nombre
    let newName = prompt("Ingresa el nuevo nombre para este perfil:", currentName);
    
    if (newName && newName.trim() !== "") {
        // Limitamos a 15 caracteres para que no rompa el diseño
        newName = newName.trim().substring(0, 15); 
        names[currentSlot] = newName;
        localStorage.setItem('notas_app_slot_names', JSON.stringify(names));
        updateSlotUI(); // Actualizamos la vista
    }
}

function updateSlotUI() {
    let names = getSlotNames();

    // 1. Actualiza el texto en el botón principal
    const display = document.getElementById('currentSlotDisplay');
    if(display) {
        display.innerText = names[currentSlot] || ("Slot " + currentSlot);
    }

    // 2. Actualiza los nombres pequeños y colores
    document.querySelectorAll('.slot-btn').forEach(btn => {
        btn.classList.remove('active-slot');
        
        // Extraemos el número del slot del ID del botón (ej. de 'btn-slot-3' sacamos '3')
        let slotId = btn.id.split('-')[2]; 
        btn.innerText = names[slotId] || slotId;
    });

    // 3. Le pone el color cian solo al botón del slot actual
    const activeBtn = document.getElementById('btn-slot-' + currentSlot);
    if(activeBtn) activeBtn.classList.add('active-slot');
}

// --- ACTUALIZADO: Guardar en memoria por Slot ---
function saveData() {
    const rows = [];
    document.querySelectorAll('#tableBody tr').forEach(tr => {
        const data = {
            id: JSON.parse(tr.dataset.course).id,
            vals: Array.from(tr.querySelectorAll('input')).map(i => i.value)
        };
        rows.push(data);
    });
    // Guardamos usando el número del slot en el nombre
    localStorage.setItem('notas_app_v2_slot_' + currentSlot, JSON.stringify(rows));
}

// --- ACTUALIZADO: Cargar memoria por Slot ---
function loadData() {
    // Intentar recordar en qué slot nos quedamos la última vez que abrimos la app
    const savedLastSlot = localStorage.getItem('notas_app_last_slot');
    if (savedLastSlot) {
        currentSlot = savedLastSlot;
        const selector = document.getElementById('slotSelector');
        if (selector) selector.value = currentSlot;
    }

    // Buscar los datos del slot actual
    let saved = JSON.parse(localStorage.getItem('notas_app_v2_slot_' + currentSlot));

    // SISTEMA DE MIGRACIÓN: Si es el Slot 1 y está vacío, buscamos si hay datos de tu versión anterior
    if (!saved && currentSlot === "1") {
        saved = JSON.parse(localStorage.getItem('notas_app_v2'));
        if (saved) {
            // Movemos los datos viejos al nuevo formato del Slot 1
            localStorage.setItem('notas_app_v2_slot_1', JSON.stringify(saved));
            localStorage.removeItem('notas_app_v2'); 
        }
    }

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; 

    // Si el slot está vacío, calculamos para dejar todo en cero y salimos
    if (!saved) {
        calculate();
        return; 
    }

    saved.forEach(item => {
        const course = MASTER_DB.find(c => c.id === item.id);
        if (course) {
            const tr = createRow(course);
            tbody.appendChild(tr);
            // Restaurar valores
            const inputs = tr.querySelectorAll('input');
            item.vals.forEach((val, idx) => {
                if (inputs[idx]) inputs[idx].value = val;
            });
        }
    });
    updateSlotUI();
    calculate();
}

function clearAllData() {
    if(confirm("¿Seguro que quieres borrar todas las notas guardadas?")) {
        localStorage.removeItem('notas_app_v2');
        location.reload();
    }
}

window.onload = function() {
    resetFilters();
    loadData();
}