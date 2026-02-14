document.addEventListener("DOMContentLoaded", function () {

  //busca la query
  const listaConsejos = document.querySelector(".lista-consejos");
  
  //recuperar el array de consejos desde localStorage, si no lista vacia
  let consejos = JSON.parse(localStorage.getItem("consejos")) || [];

  //funcion para mostrar los tres ultimos consejos
  function mostrarConsejos() {
    listaConsejos.innerHTML = ""; //limpiar los <li> de ejemplo

    const ultimos = consejos.slice(0, 3); //tomar los tres primeros

    //si no hay ninguno pone que no hay consejos
    if (ultimos.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No hay consejos todavía";
      listaConsejos.appendChild(li);
      return;
    }

    //para cada consejo crear un item de lista con data-* para el modal
    ultimos.forEach((c) => {
      const li = document.createElement("li");
      const enlace = document.createElement("a");

      enlace.href = "#"; // evitamos navegar
      enlace.className = "consejo-link";
      enlace.textContent = c.titulo;

      //datos para el modal
      enlace.setAttribute("data-titulo", c.titulo);
      enlace.setAttribute("data-descripcion", c.descripcion);

      li.appendChild(enlace);
      listaConsejos.appendChild(li);
    });
  }

  //mostrar los consejos
  mostrarConsejos();

  //abrir el modal al clicar en un consejo jQuery
  $(document).on("click", ".lista-consejos a.consejo-link", function (e) {
    e.preventDefault();

    //obtener datos
    const titulo = $(this).data("titulo");
    const descripcion = $(this).data("descripcion");

    //construir modal reutilizando estilos existentes
    const $overlay = $('<div class="modal-overlay"></div>');
    const $modal = $('<div class="modal-confirm modal-advice"></div>');

    $modal.append(`
      <h4 class="modal-title">${titulo}</h4>
      <p class="modal-text">${descripcion}</p>
      <div class="modal-actions">
        <button class="modal-close">Cerrar</button>
      </div>
    `);

    $overlay.append($modal);
    $("body").append($overlay);

    //cerrar al pulsar "Cerrar"
    $overlay.on("click", ".modal-close", function () {
      $overlay.remove();
    });

    //cerrar al hacer click fuera del cuadro
    $overlay.on("click", function (evt) {
      if (evt.target === $overlay[0]) {
        $overlay.remove();
      }
    });
  });

  const tituloInput = document.querySelector(".input-busqueda");
  const textoInput = document.querySelector(".consejo input[type='text']");
  const botonEnviar = document.querySelector(".consejo button");

  if (tituloInput && textoInput && botonEnviar) {

    //al pusar el boton de enviar
    botonEnviar.addEventListener("click", function () {
      const titulo = tituloInput.value.trim();
      const descripcion = textoInput.value.trim();

      //titulo no puede tener menos de 15 caracteres
      if (titulo.length < 15) {
        alert("El título debe tener al menos 15 caracteres.");
        return;
      }

      //descripcion no puede tener menos de 30 caracteres 
      if (descripcion.length < 30) {
        alert("La descripción debe tener al menos 30 caracteres.");
        return;
      }

      //creacion de un nuevo consejo
      const nuevo = {
        titulo,
        descripcion,
      };

      //inserta al principio y guarda
      consejos.unshift(nuevo);
      localStorage.setItem("consejos", JSON.stringify(consejos));

      //actualizar consejos
      mostrarConsejos();

      //limpia campos
      tituloInput.value = "";
      textoInput.value = "";

      alert("Consejo añadido correctamente");
    });
  }
});
