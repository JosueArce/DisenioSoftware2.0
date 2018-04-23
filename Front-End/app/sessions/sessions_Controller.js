angular.module("appModule")
    .controller("sessions_Controller",function ($scope,HttpRequest) {


        $scope.http_request = {
          endPoint : '',
          method : '',
          body : {}
        };
        $scope.listOfInvitations = [];
        $scope.invitacion = [];

        $scope.fichaJugador = "";

        $scope.localPlayer = {
          ID_Facebook :   JSON.parse(localStorage.getItem("user_information")).id,
          Nombre : JSON.parse(localStorage.getItem("user_information")).name
        };

        $scope.OnInit = function () {
          callEndPoint();
        };

        function callEndPoint() {
            var request = {
                method : "POST",
                endPoint : "extraerSesiones",
                body : {
                    ID_Facebook : JSON.parse(localStorage.getItem("user_information")).id
                }
            };
            HttpRequest.Sessions(request,function (response) {
                $scope.listOfInvitations = response.data;
            });
        }

        $scope.saveInvitation = function (invitacion) {
            $scope.invitacion.push(invitacion);
        };


        $scope.aceptarInvitacion = function() {//obtener invitacion seleccionada y cambiar el estado a aceptada. Luego reenviar a sesion de juego aceptada
            if($scope.fichaJugador === ""){
                $.notify("Debe seleccionar una ficha primero!","error")
            }
            else{
                $scope.http_request.endPoint = "aceptarSesion";
                $scope.http_request.method = "POST";
                $scope.http_request.body = {ID_Sesion : $scope.invitacion[0].ID_Sesion};
                HttpRequest.Accept_Invite($scope.http_request, function (response) {console.log(response);
                });
                $scope.http_request.endPoint = "updateFichaJ2";
                $scope.http_request.body = {ID_Sesion :  $scope.invitacion[0].ID_Sesion, fichaJ2:$scope.fichaJugador};debugger;
                HttpRequest.Sessions($scope.http_request, function (response) {
                });

                localStorage.setItem("last_accepted_invitation_JvJ",JSON.stringify($scope.invitacion[0]));

                var match = {
                  Host : $scope.invitacion[0].ID_Jugador1,
                  Invitado : $scope.invitacion[0].ID_Jugador2
                };

                localStorage.setItem("Curret_Match_JvJ",JSON.stringify(match));

                setTimeout(function () {
                    location.href = "#/board/JvJ";
                },3000);

            }

        };


        setInterval(function () {
            callEndPoint();
        },2000)
    })
;