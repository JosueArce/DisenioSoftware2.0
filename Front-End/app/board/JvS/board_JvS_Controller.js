angular.module("appModule")
    .controller("boardJvSController",function ($scope,HttpRequest) {
        //va almacenar informacion del jugador actual, se le pueden incorporar más detalles
        $scope.player = {
            name : JSON.parse(localStorage.getItem('user_information')).name,
            currentPoints : 0,
            totalWins : 0,
            totalLoses : 0,
            totalTies: 0
        };
        //va almacenar información del oponente actual, se le pueden incorporar más detalles
        $scope.opponent = {
          name : "Sistema",
          currentPoints : 0
        };

        //Almacena la información necesaria para enviar al servidor la petición
        $scope.http_request = {
            method : "",
            endpoint : "",
            body : {
                "size" : "",
                "level" : "",
                "posFichasJ1" : "",
                "posFichasJ2" : "",
                "jugadorActual" : -1,
                "x" : "",
                "y": ""
            }
        };

        $scope.dificultad = JSON.parse(localStorage.getItem('match_details_SvS')).dificultad;
        $scope.cantidad_partidas = JSON.parse(localStorage.getItem('match_details_SvS')).partidasJugar;

        $scope.juego_Terminado = false;
        $scope.jugadorActual = "1";

        //Matriz logica que permitirá manejar los movimientos en el tablero
        $scope.matrizLogica = [];
        //Contiene el tamaño de la matriz, escogido por el usuario
        $scope.tam = {
           fila : JSON.parse(localStorage.getItem('match_details_SvS')).tam,
           col : JSON.parse(localStorage.getItem('match_details_SvS')).tam
        };

        //almacena las jugadas posibles para el jugador no el sistema
        $scope.movidasPosibles;

        //Permite crear la matriz con todos sus espacios por defecto para la primera vez
        //El tamaño lo recibe por parametros y luego se generar
        function generate_matriz() {
            $scope.matrizLogica = [];
            $scope.juego_Terminado = false;
            $scope.jugadorActual = "1";

            //Se crea toda la matriz y se inicializa cada espacio en -1
            for(var filas = 0; filas <  $scope.tam.fila; filas++){
                $scope.matrizLogica[filas] = [];
                for(var cols = 0; cols < $scope.tam.col; cols++){
                    $scope.matrizLogica[filas][cols] = 0;
                }
            }

            const set_fichas_iniciales_pos = Math.trunc($scope.tam.fila/2);
            $scope.matrizLogica[set_fichas_iniciales_pos-1][set_fichas_iniciales_pos-1] = 1; $scope.matrizLogica[set_fichas_iniciales_pos-1][set_fichas_iniciales_pos] = 2;
            $scope.matrizLogica[set_fichas_iniciales_pos][set_fichas_iniciales_pos-1] = 2; $scope.matrizLogica[set_fichas_iniciales_pos][set_fichas_iniciales_pos] = 1;
            pintar_matriz($scope.matrizLogica);
        }

        //Está a cargo de traducir la matriz lógica a la matriz visual
        function pintar_matriz(matriz) {
            var height = 600/$scope.tam.fila; // obtiene la altura de cada celda
            var width = 600/$scope.tam.col; // obtiene el ancho de cada celda
            var tBody = document.createElement('tbody');
            $("#table-board tbody").remove();
            var img;
            var celda;
            var hilera;

            for(var fila = 0; fila < $scope.tam.fila;fila++){

                hilera = document.createElement('tr');hilera.setAttribute('id',fila); // filas de la tabla

                for(var col = 0; col < $scope.tam.col;col++){

                    celda = document.createElement('td');celda.setAttribute('id',fila+","+col); // celda de cada fila

                    celda.style.width = width+"px";
                    celda.style.height = height+"px";

                    //celda.style.paddingTop = height/2+"px";
                    //celda.style.display = "flex";

                    img = document.createElement("img");
                     img.style.width = "100%";
                     img.style.height  = "100%";
                     img.style.display = "block";


                    if(matriz[fila][col] == 1)
                    {
                        img.src = "../Images/"+ JSON.parse(localStorage.getItem('match_details_SvS')).fichaJugador;
                        celda.appendChild(img);
                    }
                    else if(matriz[fila][col] == 2)
                    {
                        img.src = "../Images/f2.png";
                        celda.appendChild(img);
                    }

                    hilera.appendChild(celda);
                }
                tBody.appendChild(hilera);
            }
            document.getElementById("table-board").appendChild(tBody);
            if(!$scope.juego_Terminado && $scope.jugadorActual === "1")
                solicitar_movimientos();//pide y pintas las movidas posibles
        }

        //Obtiene el id de cada celda cuando se da click
        $(document).on("click", "#table-board td", function(e) {
            var data = $(this).attr('id');
            var arrayDeCadenas = data.split(",");
            if(validate_click(arrayDeCadenas[0]+","+arrayDeCadenas[1]))//obtiene la pos x y y clickeada
                jugar();//hace el movimiento

        });

        //Permite crear la lista con todos las fichas de un jugador X
        function obtenerArregloFichas(item) {
            var arreglo = [];
            for(var x = 0; x < $scope.tam.fila;x++){
                for(var y = 0; y< $scope.tam.col;y++){
                    if($scope.matrizLogica[x][y]==item){
                        arreglo.push(x + "," + y)
                    }
                }
            }
            return arreglo;
        }

        //permite aplicar el hover a los movimientos disponibles
        function apply_style_available_moves(lista_movimientos)
        {
            lista_movimientos.forEach(function(element) {
                document.getElementById(element).className = "table-cell-hover";
            });
        }


        //Verifica si el espacio clickeado es valido para jugar
        function validate_click(posClicked) {
            for(var i = 0;i<$scope.movidasPosibles.length;i++){
                var pos = JSON.parse("[" + posClicked + "]");
                if($scope.movidasPosibles[i][0]===pos[0] && $scope.movidasPosibles[i][1] ===pos[1]){
                    $scope.http_request.body.x = pos[0];//guarda las posiciones clickeadas
                    $scope.http_request.body.y = pos[1];//al final se va mantener siempre una posicion guardada
                    return true;
                }
            }
            return false;
        }

        function obtenerDificultad() {
            var level = "";
            if($scope.dificultad === "facil")
                level = 1;
            else if($scope.dificultad === "intermedio")
                level = 2;
            else if($scope.dificultad === "dificil")
                level = 3;
            return level;
        }

        //obtiene los movimientos disponibles para el jugador actual
        function solicitar_movimientos() {


            var fichasJ1 = obtenerArregloFichas(1);
            var fichasJ2 = obtenerArregloFichas(2);

            $scope.http_request.endpoint = "movidasPosibles";
            $scope.http_request.method = "POST";
            $scope.http_request.body = {
                "size" : $scope.tam.col,
                "level" : obtenerDificultad(),
                "posFichasJ1" : fichasJ1,
                "posFichasJ2" : fichasJ2,
                "jugadorActual" : 1
            };

             HttpRequest.player_vs_system($scope.http_request,function (response) {
                 $scope.movidasPosibles = response.data;
                 apply_style_available_moves(response.data);
             });
        }

        //suma el gane de la partida al jugador o al sistema
        function repartir_puntos() {
            if($scope.player.currentPoints > $scope.opponent.currentPoints){
                $scope.player.totalWins++;
            }
            else if($scope.player.currentPoints < $scope.opponent.currentPoints){
                $scope.opponent.totalWins++;
                $scope.player.totalLoses++
            }else
                $scope.player.totalTies++;
        }

        //hace los cambios en la base de datos
        function save_points() {
            var update = {
                endpoint : 'actualizarPuntos',
                method:'POST',
                body :{
                    ID_Facebook : JSON.parse(localStorage.getItem('user_information')).id,
                    Partidas_Ganadas : $scope.player.totalWins,
                    Partidas_Empatadas : $scope.player.totalTies,
                    Partidas_Perdidas : $scope.player.totalLoses
                }
            };
            HttpRequest.player_vs_system(update,function (response) {
                //no va hacer nada
            });
        }

        //verifica si la partida termina o no
        function partidaTermina() {
            repartir_puntos();
            save_points();
            if($scope.cantidad_partidas === 0){
                if($scope.player.currentPoints > $scope.opponent.currentPoints){
                    //sumar gane al jugador
                    $.notify("Has ganado "+$scope.player.name,"success");
                }
                else if($scope.player.currentPoints < $scope.opponent.currentPoints){
                    //sumar derrota al jugador
                    $.notify("Has perdido contra el sistema!","error")
                }
                else{
                    //sumar empate al jugador
                    $.notify("Empate!","info");
                }

                setTimeout(function () {
                    $scope.$apply(function () {
                        location.href = "#/";
                    });
                }, 6000);
            }
            else{
                //reiniciar todo
                generate_matriz();
            }
        }

        //permite hace la jugada
        function jugar() {
            if($scope.cantidad_partidas > 0){

                if(!$scope.juego_Terminado){
                    $scope.http_request.body.size = $scope.tam.col;
                    $scope.http_request.body.level = obtenerDificultad();
                    $scope.http_request.body.jugadorActual = $scope.jugadorActual;
                    $scope.http_request.body.posFichasJ1 = obtenerArregloFichas(1);
                    $scope.http_request.body.posFichasJ2 = obtenerArregloFichas(2);

                    if($scope.jugadorActual==="1"){
                        $scope.http_request.method = "POST";
                        $scope.http_request.endpoint = "realizarJugadaJugador";
                    }
                    else if($scope.jugadorActual==="2"){
                        $scope.http_request.method = "POST";
                        $scope.http_request.endpoint = "realizarJugadaSistema";
                    }

                    HttpRequest.player_vs_system($scope.http_request,function (response) {
                        setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.juego_Terminado = response.data.juego_Terminado;
                                $scope.jugadorActual = response.data.jugador_Actual;
                                $scope.matrizLogica = response.data.tablero;
                                pintar_matriz(response.data.tablero);
                                $scope.player.currentPoints = response.data.puntos_J1;
                                $scope.opponent.currentPoints = response.data.puntos_J2;

                                if($scope.juego_Terminado){
                                    $scope.cantidad_partidas--;
                                    partidaTermina();
                                }

                            });
                        }, 1000);
                    });
                }

            }
        }

        //Lamada de métodos principales
        generate_matriz($scope.matrizLogica);

        //mantiene un ojo siempre atento, cuando se cambie de jugador entonces se llama el metodo para hacer la jugada del sistema
        setInterval(function()
        {
            if($scope.jugadorActual === "2"){
                jugar();
            }
        }, 1000);

    })
;