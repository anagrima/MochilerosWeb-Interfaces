document.addEventListener("DOMContentLoaded", function() {
    //valida el campo nombre completo y titular de la tarjeta
    const nombreCompletoInput = document.getElementById("nombre"); //obtiene el input del nombre completo
    const titularInput = document.getElementById("titular"); //obtiene el input del titular

    [nombreCompletoInput, titularInput].forEach(function(input) {
        input.addEventListener("input", function() {
            const valor = this.value.trim(); //elimina los espacios en blanco

            //si el nombre completo tiene entre 1 y 2 caracteres, muestra un mensaje de error
            if (valor.length > 0 && valor.length < 3) {
                this.setCustomValidity("Debe tener al menos 3 caracteres"); //mensaje de error
            } 
            //restablece el mensaje de error
            else {
                this.setCustomValidity("");
            }
        });
    });

    //validar el campo correo
    const emailInput = document.getElementById("correo"); //obtiene el input del correo

    emailInput.addEventListener("input", function() {
        const valor = this.value.trim(); //elimina espacios en blanco

        //valida solo si hay algo escrito
        if (valor.length > 0) {
            const partesEmail = valor.split("@"); //divide el valor en partes usando @ como separador

            //debe contener una sola @
            if (partesEmail.length !== 2) {
                this.setCustomValidity("El correo debe contener una sola @"); //mensaje de error
            }
            //debe contener un dominio valido
            else {
                const nombre = partesEmail[0]; //parte antes de @
                const dominio = partesEmail[1]; //parte despues de @
                const partesDominio = dominio.split("."); //divide el dominio en partes usando . como separador

                //valida el nombre
                if (nombre.length < 1) {
                    this.setCustomValidity("Debe haber un nombre antes del @"); //mensaje de error
                }
                //valida el dominio
                else if (partesDominio.length < 2) {
                    this.setCustomValidity("El dominio debe contener al menos una extensión: .es, .com, .org"); //mensaje de error
                }
                else if (partesDominio.some(parte => parte.length < 1)) {
                    this.setCustomValidity("El dominio no puede tener partes vacías"); //mensaje de error
                }
                //restablece el mensaje de error
                else {
                    this.setCustomValidity("");
                }
            }
        }
        else {
            this.setCustomValidity(""); //restablece el mensaje de error --> se maneja con required
        }
    });

    //validar campo tipo de tarjeta
    const tarjetaSelect = document.getElementById("tarjeta");

    if (tarjetaSelect) {
        // limpiar error cuando el usuario elige una opcion valida
        tarjetaSelect.addEventListener("change", function() {
            if (this.value) {
                this.setCustomValidity("");
            } else {
                this.setCustomValidity("Selecciona un tipo de tarjeta");
            }
        });
    }

    //validar el campo numero de tarjeta
    const tarjetaNumInput = document.getElementById("tarjeta-num");

    if (tarjetaNumInput) {
        tarjetaNumInput.addEventListener("input", function() {
            // permitir solo dígitos
            const soloDigitos = this.value.replace(/\D/g, "");
            // limitar a 19 caracteres
            this.value = soloDigitos.slice(0, 19);

            // validar longitud permitida (13,15,16,19)
            const len = this.value.length;
            if (len > 0 && ![13,15,16,19].includes(len)) {
                this.setCustomValidity("El número de tarjeta debe tener 13, 15, 16 o 19 dígitos");
            } else {
                this.setCustomValidity("");
            }
        });
    }

    //validar el campo fecha de caducidad
    const fechaCaducidadInput = document.getElementById("fecha-caducidad");

    fechaCaducidadInput.addEventListener("input", function() {
        const fechaSeleccionada = new Date(this.value); //convierte el valor a un objeto Date
        const fechaActual = new Date(); //obtiene la fecha actual
        const AnoActual = fechaActual.getFullYear(); //obtiene el año actual
        const anoSeleccionado = fechaSeleccionada.getFullYear(); //obtiene el año seleccionado

        //calcular fecha de caducidad
        let edad = AnoActual - anoSeleccionado; //diferencia de años
        const mesActual = fechaActual.getMonth(); //obtiene el mes actual
        const mesCaducidad = fechaSeleccionada.getMonth(); //obtiene el mes de caducidad

        //ajusta la fecha de caducidad
        if (mesCaducidad > mesActual || (mesCaducidad === mesActual && diaCaducidad > diaActual)) {
            edad--;
        }

        //valida la fecha de caducidad
        if (fechaSeleccionada < fechaActual) {
            this.setCustomValidity("La fecha de caducidad no puede ser pasada"); //mensaje de error
        }
        //restablece el mensaje de error
        else {
            this.setCustomValidity("");
        }
    });

    //validar el campo cvv
    const cvvInput = document.getElementById("cvv"); //obtiene el input del cvv

    if (cvvInput) {
        // permitir solo dígitos y limitar longitud a 3 en tiempo real
        cvvInput.addEventListener("input", function() {
            // eliminar cualquier carácter que no sea dígito
            const soloDigitos = this.value.replace(/\D/g, "");
            // limitar a 3 caracteres
            this.value = soloDigitos.slice(0, 3);

            // comprobar longitud
            if (this.value.length > 0 && this.value.length !== 3) {
                this.setCustomValidity("El CVV debe tener exactamente 3 dígitos");
            } else {
                this.setCustomValidity("");
            }
        });
    }
});

//validar que todos los campos requeridos esten completos al enviar el formulario
const formulario = document.querySelector(".formulario-compra");

if (formulario) {
    formulario.addEventListener("submit", function(event) {
        //obtiene todos los campos requeridos
        const camposEspecificos = [
            document.getElementById("nombre"),
            document.getElementById("correo"),
            document.getElementById("tarjeta"),
            document.getElementById("tarjeta-num"),
            document.getElementById("titular"),
            document.getElementById("fecha-caducidad"),
            document.getElementById("cvv"),
        ];

        let incompleto = false; //bandera para campos incompletos

        //verifica cada campo
        camposEspecificos.forEach(function(campo) {
            if (!campo) return; //si el campo no existe --> salta al siguiente

            const valor = (campo.value || "").toString().trim();

            // si el campo ya tiene un mensaje de validacion especifico --> lo respetamos
            const tieneMensajeEspecifico = campo.validationMessage && campo.validationMessage !== "" && campo.validationMessage !== "Completa este campo";

            if (!valor || !campo.checkValidity()) {
                // solo asignar el mensaje generico si no hay ya uno mas especifico
                if (!tieneMensajeEspecifico) {
                    campo.setCustomValidity("Completa este campo"); //mensaje generico
                }
                incompleto = true; //marca como incompleto
                campo.reportValidity(); //muestra el mensaje de error
            } else {
                // si esta bien --> limpiar mensajes anteriores
                campo.setCustomValidity(""); //restablece el mensaje de error
            }
        });
        //si hay campos incompletos --> evita el envio y muestra los mensajes de error
        if (incompleto) {
            event.preventDefault(); //evita el envio del formulario
            formulario.reportValidity(); //muestra los mensajes de error
        } else {
            // todos los campos requeridos son validos -> simular compra
            event.preventDefault();
            // muestra la ventana emergente/alerta de exito
            alert("Compra realizada");

            // limpiar cualquier mensaje de validacion
            camposEspecificos.forEach(function(campo) {
                if (campo) campo.setCustomValidity("");
            });
        }
    });

    // boton 'Borrar' --> reset
    formulario.addEventListener('reset', function() {
        // ejecutar después del reset nativo
        setTimeout(function() {
            // limpiar customValidity de todos los elementos del formulario
            Array.from(formulario.elements).forEach(function(el) {
                if (el && typeof el.setCustomValidity === 'function') {
                    el.setCustomValidity('');
                }
            });
        }, 0);
    });
}