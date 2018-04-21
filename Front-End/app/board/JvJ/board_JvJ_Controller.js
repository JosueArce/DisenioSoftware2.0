angular.module("appModule")
    .controller("boardJvJController",function ($scope) {
        //va almacenar informacion del jugador actual, se le pueden incorporar más detalles
        $scope.player = {
            name : JSON.parse(localStorage.getItem('user_information')).name,
            currentPoints : 0
        };
        //va almacenar información del oponente actual, se le pueden incorporar más detalles
        $scope.opponent = {
          name : "Sistema",
          currentPoints : 0
        };

        $scope.dificultad = JSON.parse(localStorage.getItem('match_details_SvS')).dificultad;
        $scope.cantidad_partidas = JSON.parse(localStorage.getItem('match_details_SvS')).partidasJugar;

        //Matriz logica que permitirá manejar los movimientos en el tablero
        $scope.matrizLogica = [];
        //Contiene el tamaño de la matriz, escogido por el usuario
        $scope.tam = {
           fila : JSON.parse(localStorage.getItem('match_details_SvS')).tam,
           col : JSON.parse(localStorage.getItem('match_details_SvS')).tam
        };

        //Permite crear la matriz con todos sus espacios por defecto
        //El tamaño lo recibe por parametros y luego se generar
        function generate_matriz(tam) {
            //Se crea toda la matriz y se inicializa cada espacio en -1
            for(var filas = 0; filas <  tam.fila; filas++){
                $scope.matrizLogica[filas] = [];
                for(var cols = 0; cols < tam.col; cols++){
                    $scope.matrizLogica[filas][cols] = 0;
                }
            }
            const set_fichas_iniciales_pos = Math.trunc($scope.tam.fila/2);
            $scope.matrizLogica[set_fichas_iniciales_pos-1][set_fichas_iniciales_pos-1] = 1; $scope.matrizLogica[set_fichas_iniciales_pos-1][set_fichas_iniciales_pos] = 2;
            $scope.matrizLogica[set_fichas_iniciales_pos][set_fichas_iniciales_pos-1] = 2; $scope.matrizLogica[set_fichas_iniciales_pos][set_fichas_iniciales_pos] = 1;
            console.log($scope.matrizLogica);
            pintar_matriz(tam);
        }

        //Está a cargo de traducir la matriz lógica a la matriz visual
        function pintar_matriz(tam) {
            var height = 400/tam.fila; // obtiene la altura de cada celda
            var width = 400/tam.col; // obtiene el ancho de cada celda
            var tBody = document.createElement('tbody');
            var img;
            var celda;
            var hilera;

            for(var fila = 0; fila < tam.fila;fila++){

                hilera = document.createElement('tr');hilera.setAttribute('id',fila); // filas de la tabla

                for(var col = 0; col < tam.col;col++){

                    celda = document.createElement('td');celda.setAttribute('id',fila+","+col); // celda de cada fila

                    celda.style.width = width+"px";
                    celda.style.height = height+"px";

                    //celda.style.paddingTop = height/2+"px";
                    //celda.style.display = "flex";

                    img = document.createElement("img");
                     img.style.width = "100%";
                     img.style.height  = "100%";
                     img.style.display = "block";


                    if($scope.matrizLogica[fila][col] == 1)
                    {
                        img.src = "../Images/"+ JSON.parse(localStorage.getItem('match_details_SvS')).fichaJugador;
                        celda.appendChild(img);
                    }
                    else if($scope.matrizLogica[fila][col] == 2)
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

        $(document).on("click", "#table-board td", function(e) {
            var data = $(this).attr('id');
            console.log("X:"+data[0]+"--"+"Y:"+data[2]);
        });

        generate_matriz($scope.tam);


    })
;