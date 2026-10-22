/**
 * Calculadora: XOR bit a bit entre dos números binarios.
 * Si tienen distinta longitud, el más corto se rellena con ceros a la izquierda.
 */
Calculadoras.registrar({
  id: 'xor-binario',
  titulo: 'XOR binario',
  descripcion: 'Calcula A ⊕ B bit a bit entre dos binarios',
  icono: '⊕',
  disponible: true,

  montar(raiz) {
    raiz.innerHTML = `
      <section class="panel">
        <label class="campo">
          <span>Binario A</span>
          <input type="text" id="xo-a" inputmode="numeric" placeholder="Ej. 1011 0110" autocomplete="off">
        </label>
        <label class="campo">
          <span>Binario B</span>
          <input type="text" id="xo-b" inputmode="numeric" placeholder="Ej. 0110 1100" autocomplete="off">
        </label>
      </section>

      <div class="acciones">
        <button id="xo-limpiar" class="btn secundario">Limpiar</button>
      </div>

      <div id="xo-resultado"></div>`;

    const $ = sel => raiz.querySelector(sel);
    const a = $('#xo-a'), b = $('#xo-b'), salida = $('#xo-resultado');

    /** Agrupa los bits de 4 en 4 desde la derecha: 10110110 → 1011 0110 */
    function agrupar(bits) {
      return bits.replace(/\B(?=(\d{4})+$)/g, ' ');
    }

    /** Devuelve los bits sin espacios, o null si el texto no es binario */
    function leer(campo) {
      const txt = campo.value.replace(/\s+/g, '');
      const valido = txt === '' || /^[01]+$/.test(txt);
      campo.classList.toggle('invalido', !valido);
      return valido ? txt : null;
    }

    function calcular() {
      const bitsA = leer(a), bitsB = leer(b);
      if (bitsA === null || bitsB === null) {
        salida.innerHTML = '<div class="aviso error">Los números binarios solo pueden contener 0 y 1.</div>';
        return;
      }
      if (bitsA === '' || bitsB === '') { salida.innerHTML = ''; return; }

      const largo = Math.max(bitsA.length, bitsB.length);
      const pa = bitsA.padStart(largo, '0');
      const pb = bitsB.padStart(largo, '0');
      let r = '';
      for (let i = 0; i < largo; i++) r += pa[i] === pb[i] ? '0' : '1';

      const dec = bits => BigInt('0b' + bits).toString();
      const relleno = bitsA.length !== bitsB.length
        ? `<p class="nota">Se rellenó con ceros a la izquierda para igualar a ${largo} bits.</p>`
        : '';

      salida.innerHTML = `
        <section class="panel">
          <h2>Resultado: A ⊕ B</h2>
          <div class="rejilla-scroll">
            <pre class="operacion">  ${agrupar(pa)}   (${dec(pa)})
⊕ ${agrupar(pb)}   (${dec(pb)})
${'─'.repeat(agrupar(pa).length + 2)}
  <b>${agrupar(r)}</b>   (${dec(r)})</pre>
          </div>
          ${relleno}
          <ul class="datos">
            <li>Binario: <b>${r}</b></li>
            <li>Decimal: <b>${dec(r)}</b></li>
            <li>Hexadecimal: <b>${BigInt('0b' + r).toString(16).toUpperCase()}</b></li>
          </ul>
        </section>`;
    }

    a.addEventListener('input', calcular);
    b.addEventListener('input', calcular);
    $('#xo-limpiar').addEventListener('click', () => {
      a.value = '';
      b.value = '';
      a.classList.remove('invalido');
      b.classList.remove('invalido');
      salida.innerHTML = '';
      a.focus();
    });
  }
});
