/**
 * Calculadora: producto de matrices módulo n.
 * - Verifica que columnas(A) = filas(B).
 * - Verifica que gcd(det(K), n) = 1, donde K es la matriz clave elegida (A o B).
 * - Calcula C = A·B mod n.
 */
Calculadoras.registrar({
  id: 'producto-matrices',
  titulo: 'Producto de matrices',
  descripcion: 'A · B mod n, con validación gcd(det, n) = 1',
  icono: '✖️',
  disponible: true,

  montar(raiz) {
    const MAX = 10;

    raiz.innerHTML = `
      <section class="panel">
        <label class="campo">
          <span>Módulo <em>n</em></span>
          <input type="number" id="pm-n" min="2" step="1" value="26" inputmode="numeric">
        </label>
        <label class="campo">
          <span>Matriz clave (se valida su determinante)</span>
          <select id="pm-clave">
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </label>
      </section>

      <div class="matrices">
        ${['A', 'B'].map(m => `
          <section class="panel">
            <h2>Matriz ${m}</h2>
            <div class="dimensiones">
              <label>Filas <input type="number" id="pm-${m}-f" min="1" max="${MAX}" value="${m === 'A' ? 2 : 2}" inputmode="numeric"></label>
              <span>×</span>
              <label>Columnas <input type="number" id="pm-${m}-c" min="1" max="${MAX}" value="${m === 'A' ? 2 : 1}" inputmode="numeric"></label>
            </div>
            <div class="rejilla-scroll"><div class="rejilla" id="pm-${m}"></div></div>
          </section>`).join('')}
      </div>

      <p id="pm-compat" class="aviso"></p>

      <div class="acciones">
        <button id="pm-limpiar" class="btn secundario">Limpiar</button>
        <button id="pm-intercambiar" class="btn secundario">Intercambiar A ↔ B</button>
        <button id="pm-calcular" class="btn">Calcular A · B mod n</button>
      </div>

      <div id="pm-resultado"></div>`;

    const $ = sel => raiz.querySelector(sel);

    // ---------- Construcción de rejillas ----------
    function leerDim(id) {
      const v = parseInt($(id).value, 10);
      return Number.isInteger(v) ? Math.min(Math.max(v, 1), MAX) : 1;
    }

    function dibujarRejilla(m) {
      const cont = $(`#pm-${m}`);
      const anteriores = {};
      cont.querySelectorAll('input').forEach(inp => { anteriores[inp.dataset.pos] = inp.value; });

      const f = leerDim(`#pm-${m}-f`), c = leerDim(`#pm-${m}-c`);
      cont.style.gridTemplateColumns = `repeat(${c}, minmax(3.2rem, 1fr))`;
      cont.innerHTML = '';
      for (let i = 0; i < f; i++) {
        for (let j = 0; j < c; j++) {
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.inputMode = 'numeric';
          inp.dataset.pos = `${i},${j}`;
          inp.value = anteriores[`${i},${j}`] ?? '';
          inp.placeholder = '0';
          inp.setAttribute('aria-label', `${m}[${i + 1}][${j + 1}]`);
          cont.appendChild(inp);
        }
      }
      revisarCompatibilidad();
    }

    function revisarCompatibilidad() {
      const aF = leerDim('#pm-A-f'), aC = leerDim('#pm-A-c');
      const bF = leerDim('#pm-B-f'), bC = leerDim('#pm-B-c');
      const aviso = $('#pm-compat');
      if (aC === bF) {
        aviso.className = 'aviso ok';
        aviso.innerHTML = `A (${aF}×${aC}) · B (${bF}×${bC}) → C (${aF}×${bC}) ✓ Multiplicables`;
      } else {
        aviso.className = 'aviso error';
        aviso.innerHTML = `A (${aF}×${aC}) · B (${bF}×${bC}) ✗ No multiplicables: columnas de A (${aC}) ≠ filas de B (${bF})`
          + (bC === aF ? `<br>💡 En el orden inverso sí se puede: usa <b>Intercambiar A ↔ B</b>.` : '');
      }

      // Si la clave elegida no es cuadrada pero la otra sí, se cambia automáticamente
      const sel = $('#pm-clave');
      const cuadrada = { A: aF === aC, B: bF === bC };
      const otra = sel.value === 'A' ? 'B' : 'A';
      if (!cuadrada[sel.value] && cuadrada[otra]) sel.value = otra;
    }

    function intercambiar() {
      const capturar = m => ({
        f: $(`#pm-${m}-f`).value,
        c: $(`#pm-${m}-c`).value,
        valores: [...$(`#pm-${m}`).querySelectorAll('input')].map(inp => inp.value)
      });
      const datos = { A: capturar('A'), B: capturar('B') };
      [['A', datos.B], ['B', datos.A]].forEach(([m, d]) => {
        $(`#pm-${m}-f`).value = d.f;
        $(`#pm-${m}-c`).value = d.c;
        $(`#pm-${m}`).innerHTML = '';
        dibujarRejilla(m);
        $(`#pm-${m}`).querySelectorAll('input').forEach((inp, i) => { inp.value = d.valores[i] ?? ''; });
      });
      const sel = $('#pm-clave');
      sel.value = sel.value === 'A' ? 'B' : 'A';
      revisarCompatibilidad();
      $('#pm-resultado').innerHTML = '';
    }

    // ---------- Lectura y validación ----------
    function leerMatriz(m) {
      const f = leerDim(`#pm-${m}-f`), c = leerDim(`#pm-${m}-c`);
      const celdas = $(`#pm-${m}`).querySelectorAll('input');
      const M = [];
      let valida = true;
      celdas.forEach((inp, idx) => {
        const i = Math.floor(idx / c);
        if (!M[i]) M[i] = [];
        const txt = inp.value.trim() === '' ? '0' : inp.value.trim();
        const okEntero = /^-?\d+$/.test(txt);
        inp.classList.toggle('invalido', !okEntero);
        if (!okEntero) valida = false;
        M[i].push(okEntero ? BigInt(txt) : 0n);
      });
      if (!valida) throw new Error(`La matriz ${m} contiene valores que no son enteros.`);
      return M.length === f ? M : M.slice(0, f);
    }

    // ---------- Presentación ----------
    function tablaMatriz(M) {
      const cols = M[0].length;
      return `<div class="rejilla-scroll"><div class="rejilla resultado" style="grid-template-columns: repeat(${cols}, minmax(3.2rem, 1fr))">
        ${M.flat().map(v => `<span>${v}</span>`).join('')}
      </div></div>`;
    }

    function calcular() {
      const salida = $('#pm-resultado');
      try {
        const nTxt = $('#pm-n').value.trim();
        if (!/^\d+$/.test(nTxt) || BigInt(nTxt) < 2n) throw new Error('El módulo n debe ser un entero mayor o igual a 2.');
        const n = BigInt(nTxt);

        const A = leerMatriz('A');
        const B = leerMatriz('B');
        if (!Mat.sonMultiplicables(A, B)) {
          throw new Error(`No se puede multiplicar: A tiene ${A[0].length} columnas y B tiene ${B.length} filas. Deben ser iguales.`);
        }

        // Validación de la matriz clave
        const nombreClave = $('#pm-clave').value;
        const K = nombreClave === 'A' ? A : B;
        let bloqueClave;
        if (K.length !== K[0].length) {
          bloqueClave = `<div class="aviso error">La matriz clave ${nombreClave} es de ${K.length}×${K[0].length}; debe ser cuadrada para tener determinante.</div>`;
        } else {
          const det = Mat.determinante(K);
          const detMod = Mat.mod(det, n);
          const g = Mat.gcd(detMod, n);
          const valida = g === 1n;
          bloqueClave = `
            <ul class="datos">
              <li>det(${nombreClave}) = <b>${det}</b></li>
              <li>det(${nombreClave}) mod ${n} = <b>${detMod}</b></li>
              <li>gcd(${detMod}, ${n}) = <b>${g}</b></li>
            </ul>
            <div class="aviso ${valida ? 'ok' : 'error'}">
              ${valida
                ? `✓ gcd = 1: la matriz ${nombreClave} es invertible módulo ${n} (clave válida).`
                : `✗ gcd ≠ 1: la matriz ${nombreClave} NO es invertible módulo ${n} (clave no válida).`}
            </div>`;
        }

        const C = Mat.multiplicar(A, B, n);
        salida.innerHTML = `
          <section class="panel">
            <h2>Validación de la clave</h2>
            ${bloqueClave}
          </section>
          <section class="panel">
            <h2>Resultado: C = A · B mod ${n} <small>(${C.length}×${C[0].length})</small></h2>
            ${tablaMatriz(C)}
          </section>`;
      } catch (e) {
        salida.innerHTML = `<div class="aviso error">${e.message}</div>`;
      }
      salida.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---------- Eventos ----------
    ['A', 'B'].forEach(m => {
      [`#pm-${m}-f`, `#pm-${m}-c`].forEach(id => $(id).addEventListener('input', () => dibujarRejilla(m)));
    });
    $('#pm-calcular').addEventListener('click', calcular);
    $('#pm-intercambiar').addEventListener('click', intercambiar);
    $('#pm-limpiar').addEventListener('click', () => {
      raiz.querySelectorAll('.rejilla input').forEach(inp => { inp.value = ''; inp.classList.remove('invalido'); });
      $('#pm-resultado').innerHTML = '';
    });

    dibujarRejilla('A');
    dibujarRejilla('B');
  }
});
