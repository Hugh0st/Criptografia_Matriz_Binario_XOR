/**
 * Registro de calculadoras. Cada calculadora se registra con:
 *   Calculadoras.registrar({
 *     id: 'mi-calculadora',          // único, se usa en la URL (#mi-calculadora)
 *     titulo: 'Mi calculadora',
 *     descripcion: 'Qué hace',
 *     icono: '∑',                    // opcional
 *     disponible: true,              // false = aparece como "Próximamente"
 *     montar(contenedor) { ... }     // dibuja la interfaz dentro del contenedor
 *   });
 */
const Calculadoras = (() => {
  const lista = [];
  return {
    registrar(calc) { lista.push(calc); },
    todas() { return lista; },
    buscar(id) { return lista.find(c => c.id === id && c.disponible !== false); }
  };
})();
