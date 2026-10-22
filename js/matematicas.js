/**
 * Utilidades matemáticas compartidas por todas las calculadoras.
 * Se usa BigInt para evitar errores de precisión con números grandes.
 */
const Mat = (() => {
  /** Residuo siempre positivo: mod(-3, 26) = 23 */
  function mod(a, n) {
    const r = a % n;
    return r < 0n ? r + n : r;
  }

  /** Máximo común divisor (algoritmo de Euclides) */
  function gcd(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) [a, b] = [b, a % b];
    return a;
  }

  /** Dos matrices son multiplicables si columnas(A) = filas(B) */
  function sonMultiplicables(A, B) {
    return A[0].length === B.length;
  }

  /** Producto A·B (opcionalmente reducido módulo n) */
  function multiplicar(A, B, n) {
    const filas = A.length, cols = B[0].length, comun = B.length;
    const C = [];
    for (let i = 0; i < filas; i++) {
      C.push([]);
      for (let j = 0; j < cols; j++) {
        let suma = 0n;
        for (let k = 0; k < comun; k++) suma += A[i][k] * B[k][j];
        C[i].push(n ? mod(suma, n) : suma);
      }
    }
    return C;
  }

  /** Determinante exacto de una matriz cuadrada (algoritmo de Bareiss, sin fracciones) */
  function determinante(M) {
    const size = M.length;
    if (size === 0 || M.some(fila => fila.length !== size)) {
      throw new Error('El determinante solo existe para matrices cuadradas.');
    }
    const a = M.map(fila => fila.slice());
    let signo = 1n, previo = 1n;
    for (let k = 0; k < size - 1; k++) {
      if (a[k][k] === 0n) {
        const p = a.findIndex((fila, i) => i > k && fila[k] !== 0n);
        if (p === -1) return 0n;
        [a[k], a[p]] = [a[p], a[k]];
        signo = -signo;
      }
      for (let i = k + 1; i < size; i++) {
        for (let j = k + 1; j < size; j++) {
          a[i][j] = (a[i][j] * a[k][k] - a[i][k] * a[k][j]) / previo;
        }
      }
      previo = a[k][k];
    }
    return signo * a[size - 1][size - 1];
  }

  return { mod, gcd, sonMultiplicables, multiplicar, determinante };
})();
