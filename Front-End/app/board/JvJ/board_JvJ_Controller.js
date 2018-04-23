angular.module("appModule")
    .controller("boardJvJController",function ($scope,HttpRequest,$timeout) {

        $scope.Host = {
            ID: 0,
            Nombre: '',
            FichaImagen : '',
            Puntos : 0,
            totalWins : 0,
            totalLoses : 0,
            totalTies : 0
        };
        $scope.Invitado = {
            ID: 0,
            Nombre: '',
            FichaImagen : '',
            Puntos : 0,
            totalWins : 0,
            totalLoses: 0,
            totalTies :0
        };
        $scope.MatchDetails = {
            ID: 0,
            Estado : true,
            CantidadPartidas : 0,
            Tam_Matriz : 0,
            jugadoresRegistrados : [],
            JugadorActual : "1",
            MatrizLogica : [],
            MovidasPosibles : [],
            ID_JugadorActual : $scope.Host.ID,
            Nombre_JugadorActual : $scope.Host.Nombre
        };
        $scope.http_request = {
            method : "",
            endPoint : "",
            body : {
                size:0,
                level : "1",
                posFichasJ1 : "",
                posFichasJ2 : "",
                x : "",
                y : ""
            }
        };

        $scope.OnInit = function () {
          HttpRequest.Sessions({
              method : "POST",
              endPoint : "extraerJugadores"
          },function (response) {
              $scope.MatchDetails.jugadoresRegistrados = response.data;

          });

          HttpRequest.Sessions({
              method :"POST",
              endPoint : "extraerSesion",
              body : {
                  ID_J1 : JSON.parse(localStorage.getItem("Curret_Match_JvJ")).Host,
                  ID_J2 : JSON.parse(localStorage.getItem("Curret_Match_JvJ")).Invitado
              }
          },function (response) {

              setTimeout(function () {
                  $scope.$apply(function () {
                      $scope.MatchDetails.ID = response.data[0].ID_Sesion;
                      $scope.MatchDetails.Estado = response.data[0].estado;
                      $scope.MatchDetails.CantidadPartidas = response.data[0].CantidadPartidas;
                      $scope.MatchDetails.Tam_Matriz = response.data[0].tam_matriz;

                      $scope.Host.ID = response.data[0].ID_Jugador1;
                      $scope.Host.FichaImagen = response.data[0].ficha_J1;
                      $scope.Invitado.ID = response.data[0].ID_Jugador2;
                      $scope.Invitado.FichaImagen = response.data[0].ficha_J2;

                      for(player in $scope.MatchDetails.jugadoresRegistrados){
                          if($scope.MatchDetails.jugadoresRegistrados[player].ID_Facebook === $scope.Host.ID){
                              $scope.Host.Nombre = $scope.MatchDetails.jugadoresRegistrados[player].Nombre;
                          }
                          if($scope.MatchDetails.jugadoresRegistrados[player].ID_Facebook === $scope.Invitado.ID){
                              $scope.Invitado.Nombre = $scope.MatchDetails.jugadoresRegistrados[player].Nombre;
                          }
                      }
                  });
              }, 500);
          });
        };

        function generate_matriz() {
            //Se crea toda la matriz y se inicializa cada espacio en -1
            for(var filas = 0; filas <  $scope.MatchDetails.Tam_Matriz; filas++){
                $scope.MatchDetails.MatrizLogica[filas] = [];
                for(var cols = 0; cols < $scope.MatchDetails.Tam_Matriz; cols++){
                    $scope.MatchDetails.MatrizLogica[filas][cols] = 0;
                }
            }
            const set_fichas_iniciales_pos = Math.trunc($scope.MatchDetails.Tam_Matriz/2);
            $scope.MatchDetails.MatrizLogica[set_fichas_iniciales_pos-1][set_fichas_iniciales_pos-1] = 1; $scope.MatchDetails.MatrizLogica[set_fichas_iniciales_pos-1][set_fichas_iniciales_pos] = 2;
            $scope.MatchDetails.MatrizLogica[set_fichas_iniciales_pos][set_fichas_iniciales_pos-1] = 2; $scope.MatchDetails.MatrizLogica[set_fichas_iniciales_pos][set_fichas_iniciales_pos] = 1;
            console.log($scope.MatchDetails.MatrizLogica);
            pintar_matriz();
        }
        function pintar_matriz() {
            var height = 400/$scope.MatchDetails.Tam_Matriz; // obtiene la altura de cada celda
            var width = 400/$scope.MatchDetails.Tam_Matriz; // obtiene el ancho de cada celda
            var tBody = document.createElement('tbody');
            var img;
            var celda;
            var hilera;

            for(var fila = 0; fila < $scope.MatchDetails.Tam_Matriz;fila++){

                hilera = document.createElement('tr');hilera.setAttribute('id',fila); // filas de la tabla

                for(var col = 0; col < $scope.MatchDetails.Tam_Matriz;col++){

                    celda = document.createElement('td');celda.setAttribute('id',fila+","+col); // celda de cada fila

                    celda.style.width = width+"px";
                    celda.style.height = height+"px";

                    //celda.style.paddingTop = height/2+"px";
                    //celda.style.display = "flex";

                    img = document.createElement("img");
                    img.style.width = "100%";
                    img.style.height  = "100%";
                    img.style.display = "block";


                    if($scope.MatchDetails.MatrizLogica[fila][col] == 1)
                    {
                        img.src = "../Images/"+ $scope.Host.FichaImagen;
                        celda.appendChild(img);
                    }
                    else if($scope.MatchDetails.MatrizLogica[fila][col] == 2)
                    {
                        img.src = "../Images/"+ $scope.Invitado.FichaImagen;
                        celda.appendChild(img);
                    }

                    hilera.appendChild(celda);
                }
                tBody.appendChild(hilera);
            }
            document.getElementById("table-board").appendChild(tBody);
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
            for(var x = 0; x < $scope.MatchDetails.Tam_Matriz;x++){
                for(var y = 0; y< $scope.MatchDetails.Tam_Matriz;y++){
                    if($scope.MatchDetails.MatrizLogica[x][y]==item){
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
            for(var i = 0;i<$scope.MatchDetails.MovidasPosibles.length;i++){
                var pos = JSON.parse("[" + posClicked + "]");
                if($scope.MatchDetails.MovidasPosibles[i][0]===pos[0] && $scope.MatchDetails.MovidasPosibles[i][1] ===pos[1]){
                    $scope.http_request.body.x = pos[0];//guarda las posiciones clickeadas
                    $scope.http_request.body.y = pos[1];//al final se va mantener siempre una posicion guardada
                    return true;
                }
            }
            return false;
        }

        function solicitar_movimientos()
        {
            $scope.http_request.endPoint = "movidasPosibles";
            $scope.http_request.method = "POST";
            $scope.http_request.body = {
                "size" : $scope.MatchDetails.Tam_Matriz,
                "level" : 1,
                "posFichasJ1" : obtenerArregloFichas(1),
                "posFichasJ2" : obtenerArregloFichas(2),
                "jugadorActual" : 1
            };

            HttpRequest.player_vs_player($scope.http_request,function (response) {
                $scope.MatchDetails.MovidasPosibles = response.data;
                apply_style_available_moves(response.data);
            });
        }

        function repartir_puntos() {
            if($scope.Host.Puntos > $scope.Invitado.Puntos){
                $scope.Host.totalWins++;
                $scope.Invitado.totalLoses--;
            }
            else if($scope.Host.Puntos < $scope.Invitado.Puntos){
                $scope.Invitado.totalWins++;
                $scope.Host.totalLoses++
            }else{
                $scope.Host.totalTies++;
                $scope.Invitado.totalTies++;
            }

        }

        //hace los cambios en la base de datos
        function save_points(user) {
            var update = {
                endpoint : 'actualizarPuntos',
                method:'POST',
                body :{
                    ID_Facebook : user.id,
                    Partidas_Ganadas : user.totalWins,
                    Partidas_Empatadas : user.totalTies,
                    Partidas_Perdidas : user.totalLoses
                }
            };
            HttpRequest.player_vs_system(update,function (response) {
                //no va hacer nada
            });
        }

        //verifica si la partida termina o no
        function partidaTermina() {
            repartir_puntos();
            save_points($scope.Host);save_points($scope.Invitado)
            if($scope.MatchDetails.CantidadPartidas === 0){
                if($scope.Host.Puntos > $scope.Invitado.Puntos){
                    //sumar gane al jugador
                    $.notify("Has ganado: "+$scope.Host.Nombre,"success");
                }
                else if($scope.Host.Puntos < $scope.Invitado.Puntos){
                    //sumar derrota al jugador
                    $.notify("Ha ganado: "+$scope.Invitado.Nombre,"success")
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
            if($scope.MatchDetails.CantidadPartidas > 0){

                if($scope.MatchDetails.Estado){
                    $scope.http_request.body.size = $scope.MatchDetails.Tam_Matriz;
                    $scope.http_request.body.jugadorActual = $scope.MatchDetails.JugadorActual;
                    $scope.http_request.body.posFichasJ1 = obtenerArregloFichas(1);
                    $scope.http_request.body.posFichasJ2 = obtenerArregloFichas(2);

                    $scope.http_request.method = "POST";
                    $scope.http_request.endPoint = "realizarJugadaJugador";

                    console.log($scope.http_request);
                    HttpRequest.player_vs_player($scope.http_request,function (response) {
                        console.log(response);
                        setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.MatchDetails.Estado = response.data.juego_Terminado;
                                $scope.MatchDetails.JugadorActual = response.data.jugador_Actual;
                                $scope.MatchDetails.MatrizLogica = response.data.tablero;
                                debugger;
                                pintar_matriz(response.data.tablero);
                                $scope.Host.Puntos = response.data.puntos_J1;
                                $scope.Invitado.Puntos = response.data.puntos_J2;

                                if(!$scope.MatchDetails.Estado){
                                    $scope.MatchDetails.CantidadPartidas--;
                                    partidaTermina();
                                }

                            });
                        }, 1000);
                    });
                }

            }
        }

        function main() {
            // console.log($scope.MatchDetails);
            // console.log($scope.Host);
            // console.log($scope.Invitado);
            setTimeout(function () {
                generate_matriz();
            },1000)
        }


        setInterval(function () {
            console.log($scope.MatchDetails.Nombre_JugadorActual);
            if(JSON.parse(localStorage.getItem("user_information")).id === $scope.MatchDetails.ID_JugadorActual && $scope.MatchDetails.Estado){
                //permitir escoger movida
                solicitar_movimientos();
            }
        },1000);

        main();
    })
;