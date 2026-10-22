/**
 * Navegación: muestra el menú o la calculadora indicada en la URL (#id).
 * Usar el hash permite que el botón "atrás" del celular funcione.
 */
(() => {
  const app = document.getElementById('app');
  const titulo = document.getElementById('titulo');
  const btnInicio = document.getElementById('btn-inicio');

  btnInicio.addEventListener('click', () => { location.hash = ''; });

  function mostrarMenu() {
    titulo.textContent = 'CriptoCalc';
    btnInicio.hidden = true;
    app.innerHTML = '<p class="intro">Elige una herramienta:</p><div class="menu"></div>';
    const menu = app.querySelector('.menu');

    Calculadoras.todas().forEach(calc => {
      const tarjeta = document.createElement('button');
      tarjeta.className = 'tarjeta';
      tarjeta.disabled = calc.disponible === false;
      tarjeta.innerHTML = `
        <span class="tarjeta-icono">${calc.icono || '🔐'}</span>
        <span class="tarjeta-texto">
          <strong>${calc.titulo}</strong>
          <small>${calc.descripcion}</small>
        </span>
        ${calc.disponible === false ? '<span class="etiqueta">Próximamente</span>' : ''}`;
      tarjeta.addEventListener('click', () => { location.hash = calc.id; });
      menu.appendChild(tarjeta);
    });
  }

  function navegar() {
    const calc = Calculadoras.buscar(location.hash.slice(1));
    if (!calc) return mostrarMenu();
    titulo.textContent = calc.titulo;
    btnInicio.hidden = false;
    app.innerHTML = '';
    calc.montar(app);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', navegar);
  navegar();
})();
