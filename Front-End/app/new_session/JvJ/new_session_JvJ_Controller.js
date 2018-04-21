angular.module("appModule")
    .controller("new_sessionJvJ_Controller",function ($scope) {

        $scope.match_details = {
            tam : 5,
            dificultad : 'intermedio',
            fichaJugador : 'f1.png',
            partidasJugar : 1
        };

        $scope.connectedPlayersList = [
            {
                id: "123",
                name:"Josue"
            }
        ];


        $scope.aceptar = function () {
            if($scope.match_details.tam > 3 && $scope.match_details.partidasJugar && $scope.match_details.fichaJugador && $scope.match_details.dificultad){
                localStorage.setItem("match_details_SvS",JSON.stringify($scope.match_details));
                location.href="#/board/JvS"
            }
            else
                $.notify("Complete todos los campos primero!","error");
        }

    })
;
