angular.module("appModule")
    .controller("boardSvSController",function ($scope,HttpRequest) {

        $scope.player = {
            name : "Sistema1",
            currentPoints : 0
        };
        //va almacenar información del oponente actual, se le pueden incorporar más detalles
        $scope.opponent = {
            name : "Sistema2",
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
                "jugadorActual" : -1
            }
        };

        //Matriz logica que permitirá manejar los movimientos en el tablero
        $scope.matrizLogica = [];
        $scope.cantidad_partidas = 1;

        $scope.juego_Terminado = false;
        $scope.jugadorActual = "1";
        $scope.tam = 4;

        //Permite crear la lista con todos las fichas de un jugador X
        function obtenerArregloFichas(item) {
            var arreglo = [];
            for(var x = 0; x < $scope.tam;x++){
                for(var y = 0; y< $scope.tam;y++){
                    if($scope.matrizLogica[x][y]==item){
                        arreglo.push(x + "," + y)
                    }
                }
            }
            return arreglo;
        }

        function pintar_matriz(matriz) {
            var height = 600/$scope.tam; // obtiene la altura de cada celda
            var width = 600/$scope.tam; // obtiene el ancho de cada celda
            var tBody = document.createElement('tbody');
            $("#table-board tbody").remove();
            var img;
            var celda;
            var hilera;

            for(var fila = 0; fila < $scope.tam;fila++){

                hilera = document.createElement('tr');hilera.setAttribute('id',fila); // filas de la tabla

                for(var col = 0; col < $scope.tam;col++){

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
        }

        function generate_matriz() {
            $scope.matrizLogica = [];
            $scope.juego_Terminado = false;
            $scope.jugadorActual = "1";

            //Se crea toda la matriz y se inicializa cada espacio en -1
            for(var filas = 0; filas <  $scope.tam; filas++){
                $scope.matrizLogica[filas] = [];
                for(var cols = 0; cols < $scope.tam; cols++){
                    $scope.matrizLogica[filas][cols] = 0;
                }
            }

            const set_fichas_iniciales_pos = Math.trunc($scope.tam/2);
            $scope.matrizLogica[set_fichas_iniciales_pos-1][set_fichas_iniciales_pos-1] = 1; $scope.matrizLogica[set_fichas_iniciales_pos-1][set_fichas_iniciales_pos] = 2;
            $scope.matrizLogica[set_fichas_iniciales_pos][set_fichas_iniciales_pos-1] = 2; $scope.matrizLogica[set_fichas_iniciales_pos][set_fichas_iniciales_pos] = 1;
            pintar_matriz($scope.matrizLogica);
        }

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

        function partidaTermina() {
            repartir_puntos();
            if($scope.cantidad_partidas === 0){
                if($scope.player.currentPoints > $scope.opponent.currentPoints){
                    //sumar gane al jugador
                    $.notify("Ha ganado "+$scope.player.name,"success");
                }
                else if($scope.player.currentPoints < $scope.opponent.currentPoints){
                    //sumar derrota al jugador
                    $.notify("Ha ganado "+$scope.opponent.name,"success")
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
                    $scope.http_request.body.size = $scope.tam;
                    $scope.http_request.body.level = 3;
                    $scope.http_request.body.jugadorActual = $scope.jugadorActual;
                    $scope.http_request.body.posFichasJ1 = obtenerArregloFichas(1);
                    $scope.http_request.body.posFichasJ2 = obtenerArregloFichas(2);

                    $scope.http_request.method = "POST";
                    $scope.http_request.endpoint = "realizarJugadaSistema";

                    HttpRequest.system_vs_system($scope.http_request,function (response) {
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
        //llamada metodos principales
        generate_matriz($scope.matrizLogica);

        setInterval(function () {
            jugar();
        }, 4000);

    })
;