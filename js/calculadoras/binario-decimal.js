/**
 * Calculadora: conversión binario ↔ decimal (enteros no negativos).
 * Al escribir en un campo, el otro se actualiza al instante.
 * Usa BigInt, así que no hay límite práctico de tamaño.
 */
Calculadoras.registrar({
  id: 'binario-decimal',
  titulo: 'Binario ↔ Decimal',
  descripcion: 'Convierte números entre base 2 y base 10',
  icono: '🔢',
  disponible: true,

  montar(raiz) {
    raiz.innerHTML = `
      <section class="panel">
        <label class="campo">
          <span>Binario (base 2)</span>
          <input type="text" id="bd-bin" inputmode="numeric" placeholder="Ej. 1011 0110" autocomplete="off">
        </label>
        <label class="campo">
          <span>Decimal (base 10)</span>
          <input type="text" id="bd-dec" inputmode="numeric" placeholder="Ej. 182" autocomplete="off">
        </label>
        <div id="bd-info"></div>
      </section>

      <div class="acciones">
        <button id="bd-limpiar" class="btn secundario">Limpiar</button>
      </div>`;

    const $ = sel => raiz.querySelector(sel);
    const bin = $('#bd-bin'), dec = $('#bd-dec'), info = $('#bd-info');
    info.style.flexBasis = '100%';

    /** Agrupa los bits de 4 en 4 desde la derecha: 10110110 → 1011 0110 */
    function agrupar(bits) {
      return bits.replace(/\B(?=(\d{4})+$)/g, ' ');
    }

    function mostrar(valor) {
      const bits = valor.toString(2);
      info.innerHTML = `
        <ul class="datos">
          <li>Bits: <b>${bits.length}</b></li>
          <li>Binario agrupado: <b>${agrupar(bits)}</b></li>
          <li>Hexadecimal: <b>${valor.toString(16).toUpperCase()}</b></li>
        </ul>`;
    }

    function error(campo, otro, mensaje) {
      campo.classList.add('invalido');
      otro.value = '';
      info.innerHTML = `<div class="aviso error">${mensaje}</div>`;
    }

    function limpiarEstado() {
      bin.classList.remove('invalido');
      dec.classList.remove('invalido');
      info.innerHTML = '';
    }

    bin.addEventListener('input', () => {
      limpiarEstado();
      const txt = bin.value.replace(/\s+/g, '');
      if (txt === '') { dec.value = ''; return; }
      if (!/^[01]+$/.test(txt)) return error(bin, dec, 'Un número binario solo puede contener 0 y 1.');
      const valor = BigInt('0b' + txt);
      dec.value = valor.toString();
      mostrar(valor);
    });

    dec.addEventListener('input', () => {
      limpiarEstado();
      const txt = dec.value.replace(/\s+/g, '');
      if (txt === '') { bin.value = ''; return; }
      if (!/^\d+$/.test(txt)) return error(dec, bin, 'El decimal debe ser un entero no negativo (solo dígitos 0–9).');
      const valor = BigInt(txt);
      bin.value = valor.toString(2);
      mostrar(valor);
    });

    $('#bd-limpiar').addEventListener('click', () => {
      bin.value = '';
      dec.value = '';
      limpiarEstado();
      bin.focus();
    });
  }
});
