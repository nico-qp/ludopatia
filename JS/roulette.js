
let ruleta_girando = false;
const posiciones = {1:{numero:32,color:"red"},2:{numero:15,color:"black"},3:{numero:19,color:"red"},4:{numero:4,color:"black"},5:{numero:21,color:"red"},6:{numero:2,color:"black"},7:{numero:25,color:"red"},8:{numero:17,color:"black"},9:{numero:34,color:"red"},10:{numero:6,color:"black"},11:{numero:27,color:"red"},12:{numero:13,color:"black"},13:{numero:36,color:"red"},14:{numero:11,color:"black"},15:{numero:30,color:"red"},16:{numero:8,color:"black"},17:{numero:23,color:"red"},18:{numero:10,color:"black"},19:{numero:5,color:"red"},20:{numero:24,color:"black"},21:{numero:16,color:"red"},22:{numero:33,color:"black"},23:{numero:1,color:"red"},24:{numero:20,color:"black"},25:{numero:14,color:"red"},26:{numero:31,color:"black"},27:{numero:9,color:"red"},28:{numero:22,color:"black"},29:{numero:18,color:"red"},30:{numero:29,color:"black"},31:{numero:7,color:"red"},32:{numero:28,color:"black"},33:{numero:12,color:"red"},34:{numero:35,color:"black"},35:{numero:3,color:"red"},36:{numero:26,color:"black"},37:{numero:0,color:"green"}};
let apuestas = {};
const numerosFila1 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
const numerosFila2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
const numerosFila3 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
const input_resultado = document.getElementById('input_resultado');
const inputPuntos = document.getElementById('puntos');

document.addEventListener('DOMContentLoaded', function () {
  preguntar_dificultad();
});

function preguntar_dificultad(){
  inputPuntos.value = 100;
  Swal.fire({
    title: "Elige la dificultad",
    text: "(varia su saldo inicial)",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Normal',
    denyButtonText: 'Dificil',
    cancelButtonText: 'Personalizado'
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      inputPuntos.value = 100;
    } else if (result.isDenied) {
      inputPuntos.value = 50;
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      preguntar_monto_inicial();
    }
  });

  puntos_iniciales = +inputPuntos.value;
}

document.addEventListener("keydown", function(event){
  if(event.key == "Enter"){
    girar_ruleta();
  }
});

async function preguntar_monto_inicial() {
  // Solicitar la apuesta al jugador
  const { value: bet, isDismissed } = await Swal.fire({
    title: "Ingrese su saldo inicial",
    input: "number",
    inputPlaceholder: "Ingresa un número positivo",
    inputAttributes: {
      min: 1,
      step: 1,
      max: 9999
    },
    showCancelButton: false,
    inputValidator: (value) => {
      if (value === '' || value < 1 || isNaN(value)) {
        return "Por favor ingresa una apuesta válida!";
      }
    }
  });

  // Verificar si el jugador canceló o si la apuesta es válida
  if (isDismissed || bet === null || bet < 1) {
    preguntar_monto_inicial();
  }

  inputPuntos.value = bet;
}



function girar_ruleta(){
  if(ruleta_girando == false){
    if(apuestas && Object.keys(apuestas).length === 0){
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Aposta a alguna casilla antes de girar",
        showConfirmButton: false,
        timer: 1500
      });
      return
    }
    ruleta_girando = true;
    // Obtener la ruleta
    const ruleta = document.getElementById('ruleta');
    const div_pelota = document.getElementById('div_pelota');
    
    let resultado_ruleta = calcular_vueltas();
    let resultado_pelota = calcular_vueltas();

    let casilla_ganadora = calcular_ganador(resultado_ruleta[0], resultado_pelota[0]);
    
    reiniciar_ruleta_pelota();
    
    ruleta.style.transform = `translate(-50%, -50%) rotate(${-resultado_ruleta[1]}deg)`;
    div_pelota.style.transform = `translate(-50%, -100%) rotate(${resultado_pelota[1]}deg)`;

    // Espera 3 segundos antes de permitir otra rotación
    setTimeout(() => {
      setear_input(casilla_ganadora);
      for (const [casillas, monto] of Object.entries(apuestas)) {
        apuesta_ganadora = 0;
        switch (casillas) {
          case 'primera docena':
            if(casilla_ganadora.numero>=1 & casilla_ganadora.numero<=12){
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 2);
            }
            break;
          case 'segunda docena':
            if(casilla_ganadora.numero>=13 & casilla_ganadora.numero<=24){
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 2);
            }
            break;
          case 'tercera docena':
            if(casilla_ganadora.numero>=25 & casilla_ganadora.numero<=36){
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 2);
            }
            break;
          case '1-18':
            if(casilla_ganadora.numero>=1 & casilla_ganadora.numero<=18){
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 1);
            }
            break;
          case '19-36':
            if(casilla_ganadora.numero>=19 & casilla_ganadora.numero<=36){
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 1);
            }
            break;
          case 'par':
            if (casilla_ganadora.numero % 2 === 0 && casilla_ganadora.numero != 0) {
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 1);
            }
            break;
          case 'impar':
            if (casilla_ganadora.numero % 2 != 0) {
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 1);
            }
            break;
          case 'rojo':
            if (casilla_ganadora.color === 'red') {
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 1);
            }
            break;
          case 'negro':
            if (casilla_ganadora.color === 'black') {
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 1);
            }
            break;
          case 'fila1':
            if (numerosFila1.includes(casilla_ganadora.numero)) {
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 2);
            }
            break;
            case 'fila2':
            if (numerosFila2.includes(casilla_ganadora.numero)) {
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 2);
            }
            break;
          case 'fila3':
            if (numerosFila3.includes(casilla_ganadora.numero)) {
              apuesta_ganadora = 1;
              monto_a_sumar = monto + (monto * 2);
            }
            break;
            default:
              let casillasArray = casillas.split(',').map(Number); // Convierte a array de números
            if(casillasArray.includes(casilla_ganadora.numero)){
              apuesta_ganadora = 1;
              if(casillasArray.length == 1){
                monto_a_sumar = monto + (monto * 35);
              }
              if(casillasArray.length == 2){
                monto_a_sumar = monto + (monto * 17);
              }
              if(casillasArray.length == 3){
                monto_a_sumar = monto + (monto * 11);
              }
              if(casillasArray.length == 4){
                monto_a_sumar = monto + (monto * 8);
              }
              if(casillasArray.length == 6){
                monto_a_sumar = monto + (monto * 5);
              }
            }
            break; 
        }
        if(apuesta_ganadora == 1){
          inputPuntos.value = +inputPuntos.value + monto_a_sumar;
          Swal.fire({
            position: "top",
            icon: "success",
            title: "Felicidades, tu apuesta: " + casillas +  ", gano!",
            showConfirmButton: false,
            timer: 1500
          });

        }
      }
      
      apuestas = {};
      ruleta_girando = false;
      if(inputPuntos.value == 0){
        Swal.fire({
          icon: "error",
          title: "Perdiste :,C",
          text: "Te quedaste sin puntos",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 3000
        });

        setTimeout(() => {
          preguntar_dificultad();
        }, 3000);
      }
    }, 5100);
      
  }else{
    Swal.fire({
      position: "bottom",
      icon: "error",
      title: "Espera que termine la anterior tirada",
      showConfirmButton: false,
      timer: 1000
    });
  }
}

function setear_input(casilla_ganadora){


  input_resultado.value = '';
  input_resultado.value = casilla_ganadora.numero;
  
  input_resultado.style.backgroundColor = casilla_ganadora.color;
}

function calcular_ganador(resultado_ruleta, resultado_pelota){
  
  let posicion_ganadora = (resultado_ruleta + resultado_pelota);
  
  if(posicion_ganadora > 37){
    posicion_ganadora = posicion_ganadora - 37;
  }
  
  let casilla_ganadora = posiciones[posicion_ganadora];
  
  return casilla_ganadora;
}

function calcular_vueltas(){
  const vueltas_minimas = 5 * 360;
  let casillas = Math.floor(Math.random() * 37) + 1;
  let grados = (casillas * 9.72) + vueltas_minimas; // 9.72 es la medida en grados de cada campo
  let resultado = [casillas, grados];
  return resultado;
}

function reiniciar_ruleta_pelota(){
  const ruleta = document.getElementById('ruleta');
  const div_pelota = document.getElementById('div_pelota');
  // Deshabilitar la transición para volver instantáneamente a 0 grados
  ruleta.style.transition = "none";
  ruleta.style.transform = `translate(-50%, -50%) rotate(0deg)`;

  // Forzar un repaint para aplicar el cambio instantáneo
  void ruleta.offsetWidth;

  // Habilitar nuevamente la transición para el giro
  ruleta.style.transition = "transform 5s ease-out";

  div_pelota.style.transition = "none";
  div_pelota.style.transform = `translate(-50%, -100%) rotate(0deg)`;

  // Forzar un repaint para aplicar el cambio instantáneo
  void pelota.offsetWidth;

  // Habilitar nuevamente la transición para el giro
  div_pelota.style.transition = "transform 5s ease-out";
}

document.querySelectorAll('td').forEach(td => {
  const circle = document.createElement('div');
  circle.className = 'circle';
  td.appendChild(circle);

  td.addEventListener('mousemove', (event) => {
    const rect = td.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    // Mostrar el círculo
    circle.style.display = 'block';

    td.classList.remove(
      'arr-izq', 'arr', 'arr-der',
      'med-izq', 'med', 'med-der',
      'aba-izq', 'aba', 'aba-der'
    );

    // Determinar la zona
    if (y < height / 3) {
      if (x < width / 3 & !td.classList.contains('up-left')) {
        // Arriba-Izquierda
        td.classList.add('arr-izq');
        circle.style.top = '-17%';
        circle.style.left = '-17%';
        circle.style.transform = 'translate(0%)';
      } else if (x < (2 * width) / 3  & !td.classList.contains('up')) {
        // Arriba-Centro
        td.classList.add('arr');
        circle.style.top = '-17%';
        circle.style.left = '50%';
        circle.style.transform = 'translateX(-50%)';
      } else if(!td.classList.contains('up-right')){
        // Arriba-Derecha
        td.classList.add('arr-der');
        circle.style.top = '-17%';
        circle.style.left = '117%';
        circle.style.transform = 'translateX(-100%)';
      }
    } else if (y < (2 * height) / 3) {
      if (x < width / 3 & !td.classList.contains('center-left')) {
        // Medio-Izquierda
        td.classList.add('med-izq');
        circle.style.top = '50%';
        circle.style.left = '-17%';
        circle.style.transform = 'translateY(-50%)';
      } else if (x < (2 * width) / 3 & !td.classList.contains('center')) {
        // Medio-Centro
        td.classList.add('med');
        circle.style.top = '50%';
        circle.style.left = '50%';
        circle.style.transform = 'translate(-50%, -50%)';
      } else if(!td.classList.contains('center-right')){
        // Medio-Derecha
        td.classList.add('med-der');
        circle.style.top = '50%';
        circle.style.left = '117%';
        circle.style.transform = 'translate(-100%, -50%)';
      }
    }else{
      if (x < width / 3 & !td.classList.contains('bottom-left')) {
        // Abajo-Izquierda
        td.classList.add('aba-izq');
        circle.style.top = '117%';
        circle.style.left = '-17%';
        circle.style.transform = 'translateY(-100%)';
      } else if (x < (2 * width) / 3 & !td.classList.contains('bottom')) {
        // Abajo-Centro
        td.classList.add('aba');
        circle.style.top = '117%';
        circle.style.left = '50%';
        circle.style.transform = 'translate(-50%, -100%)';
      } else if(!td.classList.contains('bottom-right')){
        // Abajo-Derecha
        td.classList.add('aba-der');
        circle.style.top = '117%';
        circle.style.left = '117%';
        circle.style.transform = 'translate(-100%, -100%)';
      }
    }

    if (td.classList.contains('none')) {circle.style.display = 'none';}

    if (td.classList.contains('center-only')) {
      // Centro
      td.classList.add('med');
      circle.style.top = '50%';
      circle.style.left = '50%';
      circle.style.transform = 'translate(-50%, -50%)';
    }
  });

  td.addEventListener('mouseleave', () => {
    circle.style.display = 'none';
    td.classList.remove(
      'arr-izq', 'arr', 'arr-der',
      'med-izq', 'med', 'med-der',
      'aba-izq', 'aba', 'aba-der'
    );
  });
  
});

async function tdclick() {
  if(ruleta_girando){
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Espera que termine la tirada",
      showConfirmButton: false,
      timer: 1000
    });
    return;
  }
  var clickeado = event.target;
  var td_id = clickeado.id;
  var nueva_apuesta;
  var ubicacion_circulo = obtener_ubicacion_circulo(clickeado.classList);

  var casillas_apostadas = obtener_casillas_apostadas(ubicacion_circulo, td_id);

  nueva_apuesta = !apuestas[casillas_apostadas] ? true : false;

  monto_antiguo = !nueva_apuesta ? apuestas[casillas_apostadas] :null;
  // Pedir monto de la apuesta
  var monto = await preguntar_monto(nueva_apuesta, casillas_apostadas, monto_antiguo);
  
  if(typeof(monto) === "number"){
    // Asignar el monto al diccionario apuestas
    if (monto > 0) {
      if(!nueva_apuesta){
        devolver = apuestas[casillas_apostadas];
        inputPuntos.value = +inputPuntos.value + devolver;
      }
      apuestas[casillas_apostadas] = monto;
      inputPuntos.value = +inputPuntos.value - monto;
    } else {
      if(apuestas[casillas_apostadas]){
        devolver = apuestas[casillas_apostadas];
        inputPuntos.value = +inputPuntos.value + devolver;
        delete apuestas[casillas_apostadas];
      }
    }
  }
}

async function preguntar_monto(nueva_apuesta, casillas_apostadas, monto_antiguo) {
  // Determinar el valor inicial del input
  const inputValue = monto_antiguo != null ? +monto_antiguo : '';

  // Solicitar la apuesta al jugador
  const { value: bet, isDismissed } = await Swal.fire({
    title: nueva_apuesta ? "Ingrese su apuesta" : "Modifique su apuesta",
    text: "Está apostando a: " + casillas_apostadas,
    input: "number",
    inputValue: inputValue,
    inputPlaceholder: "Ingresa un número positivo o 0 para cancelar",
    inputAttributes: {
      min: 0,
      step: 1
    },
    showCancelButton: true,
    inputValidator: (value) => {
      if (value === '' || value < 0 || isNaN(value)) {
        return "Por favor ingresa una apuesta válida!";
      }
      if(value > +inputPuntos.value){
        return "No cuenta con suficientes puntos";
      }
    }
  });

  // Verificar si el jugador canceló o si la apuesta es válida
  if (isDismissed || bet === null || bet < 0) {
    await Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Apuesta cancelada",
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      timerProgressBar: true
    });
    return 0; // Retorna 0 si el jugador cancela o si la apuesta no es válida
  }

  return parseInt(bet); // Retorna la apuesta como número entero
}


function obtener_ubicacion_circulo(clases){
  var cantidad_clases = clases.length;
  var ubicacion_circulo = clases[cantidad_clases - 1]; // med, arr, aba, izq, der
  
  return ubicacion_circulo;
}

function obtener_casillas_apostadas(ubicacion_circulo, td_id){
  switch (ubicacion_circulo) {
    case 'arr-izq':
      if(numerosFila1.includes(+td_id)){
        casillas_apostadas = [String(+td_id-5), String(+td_id-4), String(+td_id-3), String(+td_id-2), String(+td_id-1), td_id];
      }else{
        casillas_apostadas = [String(+td_id-3), String(+td_id-2), td_id, String(+td_id+1)];
      }
      break;
    case 'arr':
      if(numerosFila1.includes(+td_id)){
        casillas_apostadas = [String(+td_id-2), String(+td_id-1), td_id]
      }else{
        casillas_apostadas = [td_id, String(+td_id+1)];
      }
      break;
    case 'arr-der':
      if(numerosFila1.includes(+td_id)){
        casillas_apostadas = [String(+td_id-2), String(+td_id-1), td_id, String(+td_id+1), String(+td_id+2), String(+td_id+3)];
      }else{
        casillas_apostadas = [td_id, String(+td_id+1), String(+td_id+3), String(+td_id+4)];
      }
      break;
    case 'med-izq':
      casillas_apostadas = [String(+td_id-3), td_id];
      break;
    case 'med':
      casillas_apostadas = [td_id];
      break;
    case 'med-der':
      casillas_apostadas = [td_id, String(+td_id+3)];
      break;
    case 'aba-izq':
      casillas_apostadas = [String(+td_id-4), String(+td_id-3), String(+td_id-1), td_id];
      break;
    case 'aba':
      casillas_apostadas = [String(+td_id-1), td_id];
      break;
    case 'aba-der':
      casillas_apostadas = [String(+td_id-1), td_id, String(+td_id+2), String(+td_id+3)];
      break; 
  }
  const resultado = casillas_apostadas.join(',');
  return resultado;
}