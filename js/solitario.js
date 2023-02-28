/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["ova", "cua", "hex", "cir"];
// Array de número de cartas
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [9, 10, 11, 12];

// Tapetes				
let tapete_inicial = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

let ultimoHijoTapeteInicial;

// Mazos
let mazo_inicial = [];
let mazo_sobrantes = [];
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

// Contadores de cartas
let cont_inicial = document.getElementById("cont_inicial");
let cont_sobrantes = document.getElementById("cont_sobrantes");
let cont_receptor1 = document.getElementById("cont_receptor1");
let cont_receptor2 = document.getElementById("cont_receptor2");
let cont_receptor3 = document.getElementById("cont_receptor3");
let cont_receptor4 = document.getElementById("cont_receptor4");
let cont_movimientos = document.getElementById("contador_movimientos");
let contador_movimientos = 0;

// Tiempo
let cont_tiempo = document.getElementById("cont_tiempo"); // span cuenta tiempo
let segundos = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/


// Rutina asociada a boton reset: comenzar_juego
document.getElementById("reset").onclick = comenzar_juego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/

// Desarrollo del comienzo de juego
function comenzar_juego() {
	/* Crear baraja, es decir crear el mazo_inicial. Este será un array cuyos 
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
	el path correcto en la URL asociada al atributo src de <img>). Una vez creado
	el elemento img, inclúyase como elemento del array mazo_inicial. 
	*/

	// vacío los tapetes y mazos
	mazo_inicial = []; // vaciar mazo inicial
	mazo_sobrantes = [];
	mazo_receptor1 = [];
	mazo_receptor2 = [];
	mazo_receptor3 = [];
	mazo_receptor4 = [];


	// por cada tapete vaciar su contenido menos el primer hijo
	while (tapete_inicial.childElementCount > 1) {
		tapete_inicial.removeChild(tapete_inicial.lastElementChild);
	}
	while (tapete_sobrantes.childElementCount > 1) {
		tapete_sobrantes.removeChild(tapete_sobrantes.lastElementChild);
	}
	while (tapete_receptor1.childElementCount > 1) {
		tapete_receptor1.removeChild(tapete_receptor1.lastElementChild);
	}
	while (tapete_receptor2.childElementCount > 1) {
		tapete_receptor2.removeChild(tapete_receptor2.lastElementChild);
	}
	while (tapete_receptor3.childElementCount > 1) {
		tapete_receptor3.removeChild(tapete_receptor3.lastElementChild);
	}
	while (tapete_receptor4.childElementCount > 1) {
		tapete_receptor4.removeChild(tapete_receptor4.lastElementChild);
	}

	// Los contadores de cartas los pongo a 0
	cont_sobrantes.innerHTML = 0;
	cont_receptor1.innerHTML = 0;
	cont_receptor2.innerHTML = 0;
	cont_receptor3.innerHTML = 0;
	cont_receptor4.innerHTML = 0;
	cont_movimientos.innerHTML = 0;
	contador_movimientos = 0;

	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	// Recorremos los arrays de palos y números para crear las cartas y añadirlas al mazo inicial
	for (let palo of palos) {
		for (let numero of numeros) {
			let carta = `${numero}-${palo}`;
			mazo_inicial.push(carta);
		}
	}

	// Barajar
	barajar(mazo_inicial);

	cont_inicial.innerHTML = mazo_inicial.length;
	cargar_tapete_inicial(mazo_inicial);

	ultimoHijoTapeteInicial = tapete_inicial.lastElementChild;
	// Puesta a cero de contadores de mazos
	set_contador(cont_sobrantes, 0);
	set_contador(cont_receptor1, 0);
	set_contador(cont_receptor2, 0);
	set_contador(cont_receptor3, 0);
	set_contador(cont_receptor4, 0);
	set_contador(cont_movimientos, 0);

	// Arrancar el conteo de tiempo
	arrancar_tiempo();

} // comenzar_juego

comenzar_juego();
/*
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el 
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a clearInterval en su caso.   
*/



function arrancar_tiempo() {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	if (temporizador) clearInterval(temporizador);
	let hms = function () {
		let seg = Math.trunc(segundos % 60);
		let min = Math.trunc((segundos % 3600) / 60);
		let hor = Math.trunc((segundos % 86400) / 3600);
		let tiempo = ((hor < 10) ? "0" + hor : "" + hor)
			+ ":" + ((min < 10) ? "0" + min : "" + min)
			+ ":" + ((seg < 10) ? "0" + seg : "" + seg);
		set_contador(cont_tiempo, tiempo);
		segundos++;
		contador_tiempo.innerHTML = tiempo;
	}
	segundos = 0;
	hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);

} // arrancar_tiempo

function detener_tiempo() {
	clearInterval(temporizador);
} // detener_tiempo

/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
	Para reordenar el array puede emplearse el siguiente pseudo código:

	- Recorramos con i todos los elementos del array
		- Sea j un indice cuyo valor sea un número aleatorio comprendido 
			entre 0 y la longitud del array menos uno. Este valor aleatorio
			puede conseguirse, por ejemplo con la instrucción JavaScript
				Math.floor( Math.random() * LONGITUD_DEL_ARRAY );
		- Se intercambia el contenido de la posición i-ésima con el de la j-ésima

*/
function barajar(mazo) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	for (let i = mazo.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const aux = mazo[i];
		mazo[i] = mazo[j];
		mazo[j] = aux;
	}
} // barajar



/**
	  En el elemento HTML que representa el tapete inicial (variable tapete_inicial)
	se deben añadir como hijos todos los elementos <img> del array mazo.
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas top y left, algun atributo de tipo data-...
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/

function cargar_tapete_inicial(mazo_inicial) {
	let zIndex = 0;
	// paso (top y left) en pixeles de una carta a la siguiente en un mazo
	let paso = 5;
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	mazo_inicial.forEach(elemento => {
		const nuevaCarta = document.createElement("img");
		nuevaCarta.draggable = true;
		nuevaCarta.src = "imagenes/baraja/" + elemento + ".png";
		nuevaCarta.id = elemento;
		nuevaCarta.setAttribute("numero", elemento.split("-")[0]);
		nuevaCarta.setAttribute("palo", elemento.split("-")[1]);
		nuevaCarta.style.width = "70px";
		nuevaCarta.style.position = "absolute";
		nuevaCarta.style.top = paso + "px";
		nuevaCarta.style.left = paso + "px";
		paso += 5;
		nuevaCarta.style.zIndex = zIndex;
		zIndex++;
		tapete_inicial.appendChild(nuevaCarta);
	});

} // cargar_tapete_inicial


/**
	  Esta función debe incrementar el número correspondiente al contenido textual
		  del elemento que actúa de contador
*/
function inc_contador(contador) {
	contador.innerHTML = +contador.innerHTML + 1;
} // inc_contador

/**
	Idem que anterior, pero decrementando 
*/
function dec_contador(contador) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! ***/
	contador.innerHTML = +contador.innerHTML - 1;
} // dec_contador

/**
	Similar a las anteriores, pero ajustando la cuenta al
	valor especificado
*/
function set_contador(contador, valor) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
} // set_contador


// Funciones estéticas para que se vea qué carta puede moverse en este momento
tapete_inicial.addEventListener("mouseover", (event) => {
	if (event.target === tapete_inicial.lastChild) {
		event.target.style.transform = "scale(1.2) rotate(10deg)";
	}
});

tapete_inicial.addEventListener("mouseout", (event) => {
	if (event.target === tapete_inicial.lastChild) {
		event.target.style.transform = "scale(1)";
	}
});

// Función dragstart para el tapete inicial
tapete_inicial.addEventListener("dragstart", (event) => {
	if (event.target === tapete_inicial.lastChild) {
		let padre = event.target.parentNode.id;
		event.dataTransfer.setData("padre", padre);
		event.dataTransfer.setData("text", event.target.id);
	} else {
		event.preventDefault();
	}
});

// Función dragstart para el tapete sobrantes
tapete_sobrantes.addEventListener("dragstart", (event) => {
	if (event.target === tapete_sobrantes.lastChild) {
		let padre = event.target.parentNode.id;
		event.dataTransfer.setData("padre", padre);
		event.dataTransfer.setData("text", event.target.id);
	} else {
		event.preventDefault();
	}
});

// FUNCIONES TAPETE SOBRANTES
// Funciones dragover y drop para el tapete sobrantes
tapete_sobrantes.addEventListener("dragover", (event) => {
	event.preventDefault();
	tapete_sobrantes.style.border = "2px solid green";
});
tapete_sobrantes.addEventListener("dragleave", (event) => {
	event.preventDefault();
	tapete_sobrantes.style.border = "none";
});
// Cuando se suelta una carta en el tapete de sobrantes se ejecuta la función soltarSobrantes
tapete_sobrantes.addEventListener("drop", function (event) {
	soltarCarta(event, this);
});


// FUNCIONES TAPETE RECEPTOR 1
// Funciones dragover y drop para el tapete receptor 1
tapete_receptor1.addEventListener("dragover", (event) => {
	event.preventDefault();
	tapete_receptor1.style.border = "2px solid green";
});
tapete_receptor1.addEventListener("drop", function (event) {
	soltarCarta(event, this);
});
tapete_receptor1.addEventListener("dragleave", (event) => {
	event.preventDefault();
	tapete_receptor1.style.border = "none";
});


// FUNCIONES TAPETE RECEPTOR 2
// Funciones dragover y drop para el tapete receptor 2
tapete_receptor2.addEventListener("dragover", (event) => {
	event.preventDefault();
	tapete_receptor2.style.border = "2px solid green";
});
tapete_receptor2.addEventListener("drop", function (event) {
	soltarCarta(event, this);
});
tapete_receptor2.addEventListener("dragleave", (event) => {
	event.preventDefault();
	tapete_receptor2.style.border = "none";
});

// FUNCIONES TAPETE RECEPTOR 3
// Funciones dragover y drop para el tapete receptor 3
tapete_receptor3.addEventListener("dragover", (event) => {
	event.preventDefault();
	tapete_receptor3.style.border = "2px solid green";
});
tapete_receptor3.addEventListener("drop", function (event) {
	soltarCarta(event, this);
});
tapete_receptor3.addEventListener("dragleave", (event) => {
	event.preventDefault();
	tapete_receptor3.style.border = "none";
});

// FUNCIONES TAPETE RECEPTOR 4
// Funciones dragover y drop para el tapete receptor 4
tapete_receptor4.addEventListener("dragover", (event) => {
	event.preventDefault();
	tapete_receptor4.style.border = "2px solid green";
});
tapete_receptor4.addEventListener("drop", function (event) {
	soltarCarta(event, this);
});
tapete_receptor4.addEventListener("dragleave", (event) => {
	event.preventDefault();
	tapete_receptor4.style.border = "none";
});



// Esto es para el estilo de la carta que se está moviendo
let zIndexDrop = 0;
function soltarCarta(event, tapete) {
	event.preventDefault();
	if (event.target.tagName === "DIV" || event.target.parentNode === tapete) {
		// Se obtiene el id de la carta que se está moviendo
		const data = event.dataTransfer.getData("text");
		// se obtiene el elemento que se está moviendo
		const card = document.getElementById(data);
		// Se obtiene el id del padre del elemento que se está moviendo
		const padre = event.dataTransfer.getData("padre");
		// Se define el mazo del cual borrar según el padre
		let mazo_a_borrar = "mazo_" + padre;
		let mazo_a_anadir = "mazo_" + tapete.id;

		function moverCarta() {
			// Estilos para la carta en el nuevo tapete
			card.style.position = "absolute";
			card.style.left = "50%";
			card.style.top = "50%";
			card.style.transform = "translate(-50%, -50%)";
			card.style.zIndex = zIndexDrop;
			zIndexDrop++;
			// Se añade la carta al nuevo tapete
			tapete.appendChild(card);
		}



		// TODO: Que todo sea dentro de los switch para añadir comprobante de cartas válidas

		// Cojo la carta del mazo que se va a borrar

		switch (mazo_a_borrar) {
			// En caso de que el mazo a borrar sea el inicial
			case "mazo_inicial":
				carta = mazo_inicial[mazo_inicial.length - 1];
				// Comprobamos en qué mazo se va a añadir
				switch (mazo_a_anadir) {
					// Si se añade en sobrantes no hace falta comprobar
					case "mazo_sobrantes":
						mazo_sobrantes.push(carta);
						mazo_inicial.pop();
						contador_movimientos++;
						cont_movimientos.innerHTML = contador_movimientos;
						moverCarta();
						break;
					// Si se añade al receptor 1 se comrpueba que sea válida
					case "mazo_receptor1":
						if (comprobarCartaValida(carta, mazo_receptor1)) {
							// Si es valida se añade en receptor, borra en inicial y ejecuta la función moverCarta
							mazo_receptor1.push(carta);
							mazo_inicial.pop();
							contador_movimientos++;
							cont_movimientos.innerHTML = contador_movimientos;
							moverCarta();
						} else {
							// Añadir un else
						}
						break;
					// Lo mismo para el resto de receptores
					case "mazo_receptor2":
						if (comprobarCartaValida(carta, mazo_receptor2)) {
							mazo_receptor2.push(carta);
							mazo_inicial.pop();
							contador_movimientos++;
							cont_movimientos.innerHTML = contador_movimientos;
							moverCarta();
						}
						break;
					case "mazo_receptor3":
						if (comprobarCartaValida(carta, mazo_receptor3)) {
							mazo_receptor3.push(carta);
							mazo_inicial.pop();
							contador_movimientos++;
							cont_movimientos.innerHTML = contador_movimientos;
							moverCarta();
						}
						break;
					case "mazo_receptor4":
						if (comprobarCartaValida(carta, mazo_receptor4)) {
							mazo_receptor4.push(carta);
							mazo_inicial.pop();
							contador_movimientos++;
							cont_movimientos.innerHTML = contador_movimientos;
							moverCarta();
						}
						break;
					default:
						console.log("Mazo no encontrado");
				}
				break;

			// En caso de que el mazo  desde el que movemos sea el de sobrantes
			case "mazo_sobrantes":
				carta = mazo_sobrantes[mazo_sobrantes.length - 1]
				// Comprobamos en qué mazo se va a añadir
				switch (mazo_a_anadir) {
					// Si se añade en sobrantes no hace falta comprobar
					case "mazo_sobrantes":
						mazo_sobrantes.push(carta);
						mazo_sobrantes.pop();
						contador_movimientos++;
						cont_movimientos.innerHTML = contador_movimientos;
						moverCarta();
						break;
					// Si se añade al receptor 1 se comrpueba que sea válida
					case "mazo_receptor1":
						if (comprobarCartaValida(carta, mazo_receptor1)) {
							// Si es valida se añade en receptor, borra en inicial y ejecuta la función moverCarta
							mazo_receptor1.push(carta);
							mazo_sobrantes.pop();
							contador_movimientos++;
							cont_movimientos.innerHTML = contador_movimientos;
							moverCarta();
						} else {
							// Añadir un else
						}
						break;
					// Lo mismo para el resto de receptores
					case "mazo_receptor2":
						if (comprobarCartaValida(carta, mazo_receptor2)) {
							mazo_receptor2.push(carta);
							mazo_sobrantes.pop();
							contador_movimientos++;
							cont_movimientos.innerHTML = contador_movimientos;
							moverCarta();
						}
						break;
					case "mazo_receptor3":
						if (comprobarCartaValida(carta, mazo_receptor3)) {
							mazo_receptor3.push(carta);
							mazo_sobrantes.pop();
							contador_movimientos++;
							cont_movimientos.innerHTML = contador_movimientos;
							moverCarta();
						}
						break;
					case "mazo_receptor4":
						if (comprobarCartaValida(carta, mazo_receptor4)) {
							mazo_receptor4.push(carta);
							mazo_sobrantes.pop();
							contador_movimientos++;
							cont_movimientos.innerHTML = contador_movimientos;
							moverCarta();
						}
						break;
					default:
						console.log("Mazo no encontrado");
				}
				break;
			default:
				console.log("Mazo no encontrado");
		}

		cont_inicial.innerHTML = mazo_inicial.length;
		cont_receptor1.innerHTML = mazo_receptor1.length;
		cont_receptor2.innerHTML = mazo_receptor2.length;
		cont_receptor3.innerHTML = mazo_receptor3.length;
		cont_receptor4.innerHTML = mazo_receptor4.length;
		cont_sobrantes.innerHTML = mazo_sobrantes.length;

		tapete_sobrantes.style.border = "none";
		tapete_receptor1.style.border = "none";
		tapete_receptor2.style.border = "none";
		tapete_receptor3.style.border = "none";
		tapete_receptor4.style.border = "none";

		// Si el mazo inicial está vacío, se añaden las cartas del mazo sobrantes
		if (mazo_inicial.length === 0) {

			// Dos opciones, si el mazo sobrantes está vacío, se muestra un mensaje de victoria
			// Si el mazo de sobrantes no está vacío, se añaden las cartas al mazo inicial
			if (mazo_sobrantes.length === 0) {
				detener_tiempo();
				alert("¡Has ganado!");
			} else {

			// Hacemos que el mazo inicial sea el mazo sobrantes
			mazo_inicial = mazo_sobrantes;
			// Borramos el mazo sobrantes
			mazo_sobrantes = [];
			// Hacemos la carga del tapete inicial con las cartas que hemos añadido desde sobrantes
			cargar_tapete_inicial(mazo_inicial);
			// Se borran las cartas del tapete sobrantes (todos los hijos menos el primero que es el contador)
			while (tapete_sobrantes.childElementCount > 1) {
				tapete_sobrantes.removeChild(tapete_sobrantes.lastElementChild);
			}
			// Se actualizan los contadores
			cont_inicial.innerHTML = mazo_inicial.length;
			cont_sobrantes.innerHTML = mazo_sobrantes.length;
		}
		}

	}

};

// Función para comprobar si la carta que se está moviendo es válida
function comprobarCartaValida(carta_moviendo, mazo_receptor) {
	// Si la ultima carta del mazo receptor es de distinto color y mayor valor, se puede mover la carta
	// Como el nombre del ultimo hijo es 'numero-palo', se separa el nombre en dos partes,
	// Si el palo es Ova o Cuad no puede mover a ninguno de esos, si es hex o cir no puede mover a hex ni cir

	let numero_carta_moviendo = carta_moviendo.split("-")[0];
	let palo_carta_moviendo = carta_moviendo.split("-")[1];

	let anterior_carta = mazo_receptor[mazo_receptor.length - 1]
	if (anterior_carta === undefined) {
		if (numero_carta_moviendo === "12") {
			return true;
		}
		return false;
	} else {
		let numero = anterior_carta.split("-")[0];
		let palo = anterior_carta.split("-")[1];

		if (palo_carta_moviendo === "ova" || palo_carta_moviendo === "cua") {
			if (palo === "hex" || palo === "cir") {
				if (Number(numero_carta_moviendo) == Number(numero) - 1) {
					return true;
				}
			}
		}

		if (palo_carta_moviendo === "hex" || palo_carta_moviendo === "cir") {
			if (palo === "ova" || palo === "cua") {
				if (Number(numero_carta_moviendo) == Number(numero) - 1) {
					return true;
				}
			}
		}

		return false;
	}

}

// Función para mover carta a un tapete 
