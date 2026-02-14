//script para el registro de usuario
document.addEventListener("DOMContentLoaded", function() {
    const formRegistro = document.querySelector(".forms-registro"); //selecciona el formulario por su clase

    //mostrar nombre del archivo seleccionado
    const inputImagen = document.getElementById("imagen"); //obtiene el input de tipo file
    const contenedorImagen = document.querySelector(".imagen-forms"); //contenedor del label e input

    inputImagen.addEventListener("change", function() {
        const nombreArchivo = this.files[0].name; //obtiene el nombre del archivo seleccionado

        let infoArchivo = document.querySelector(".info-archivo"); //div para mostrar el nombre del archivo

        if (!infoArchivo) {
            infoArchivo = document.createElement("div");
            infoArchivo.className = "info-archivo"; //asigna una clase al div

            contenedorImagen.style.flexDirection = "column"; //ajusta el contenedor para que el label y el div estén en columna

            contenedorImagen.appendChild(infoArchivo); //inserta el div en el contenedor
        }
        infoArchivo.textContent = `Archivo seleccionado: ${nombreArchivo}`; //muestra el nombre del archivo en el div
    });

    //evento de envio del formulario
    formRegistro.addEventListener("submit", function (event) {

    event.preventDefault(); //evita que recargue la pagina

    //se obtienen los valores del formulario (usuario, contrasena e imagen)
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const imagenArchivo = inputImagen.files[0];

    //verifica si ya existe un usuario con ese nombre
    if (localStorage.getItem(usuario)) {
      alert("Ese nombre de usuario ya existe. Elige otro.");
      return;
    }

    //lee la imagen como base64 y guarda usuario
    const reader = new FileReader();
    reader.onload = e => {
      //valor en localStorage
      const nuevoUsuario = {
        usuario,
        contrasena,
        imagen: e.target.result 
      };

      localStorage.setItem(usuario, JSON.stringify(nuevoUsuario)); //clave = nombre de usuario
      localStorage.setItem("usuarioActual", usuario); //quien esta conectado

      alert("Registro exitoso");
      //se redirige a al pagina de usuario
      window.location.href = "version-b.html";
    };

    //inicia la lectura del archivo de imagen y cuando termine se ejecutara reader.onload
    reader.readAsDataURL(imagenArchivo);
  });


});