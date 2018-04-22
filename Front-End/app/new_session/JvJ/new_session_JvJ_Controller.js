angular.module("appModule")
    .controller("new_sessionJvJ_Controller",function ($scope,HttpRequest) {

        $scope.match_details = {
            tam : 5,
            fichaJugador : 'f1.png',
            partidasJugar : 1
        };

        $scope.connectedPlayersList = [];
        $scope.selected_player ={
            ID_Opponent : 0,
            Nombre : ''
        };

        $scope.OnInit = function () {
            var request = {
                method : "POST",
                endPoint : "ConnectedPlayers"
            };
            HttpRequest.Connected_Players(request,function (response) {
                $scope.connectedPlayersList = response.data;
            });
        };

        $scope.selectPlayer = function () {
            if($scope.selected_player)
            {
                document.getElementById("checkUser").disabled = false;
                for(item in $scope.connectedPlayersList){
                    if($scope.connectedPlayersList[item].ID_Facebook === $scope.selected_player.ID_Opponent)
                        $scope.selected_player.Nombre = $scope.connectedPlayersList[item].Nombre;
                }
            }
            else  document.getElementById("checkUser").disabled = true;
        };

        $scope.openConfirmModal = function () {
          if($scope.selected_player.ID_Opponent != "" && $scope.match_details.tam > 3 && $scope.match_details.partidasJugar > 0){
              $("#ConfirmData").modal("show");
          }
          else !$.notify("Complete todos los campos de manera correcta!","error");
        };




        $scope.startMatch = function () {
            var match_details = {
              Host : {
                ID_Facebook : JSON.parse(localStorage.getItem('user_information')).id,
                Nombre_Jugador :   JSON.parse(localStorage.getItem('user_information')).name
              },
              Opponent : {
                ID_Facebook : $scope.selected_player.ID_Opponent,
                Nombre_Jugador : $scope.selected_player.Nombre
              },
               tam_matriz : $scope.match_details.tam,
               partidas_jugar : $scope.match_details.partidasJugar,
               ficha_jugador1 : $scope.match_details.fichaJugador,
               ficha_jugador2: ""
            };
            localStorage.setItem("last_match_created_JvJ",JSON.stringify(match_details));

            HttpRequest.Sesions(
                {
                    method : "POST",
                    endPoint : "crearSesion",
                    body : {
                        ID_Jugador1 : JSON.parse(localStorage.getItem('user_information')).id,
                        ID_Jugador2 : $scope.selected_player.ID_Opponent,
                        tam_matriz : match_details.tam_matriz,
                        fichaJ1 : match_details.ficha_jugador1

                    }
                },function (response) {

            });

            location.href = "#/board/JvJ";
        }



    })
;
