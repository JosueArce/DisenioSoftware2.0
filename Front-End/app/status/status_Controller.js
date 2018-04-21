angular.module("appModule")
    .controller("status_Controller",function ($scope,HttpRequest) {

        $scope.user = {
            userName : JSON.parse(localStorage.getItem('user_information')).name,
            fb_picture : JSON.parse(localStorage.getItem('user_information')).picture.data.url,
            partidas_ganadas : "",
            partidas_empatadas : "",
            partidas_perdidas : ""
        };

        var http_request = {
            method : "GET",
            endpoint : "stadistics",
            params : JSON.parse(localStorage.getItem('user_information')).id
        };

        $scope.init = function(){
            HttpRequest.stats_request(http_request,function (response) {
                $scope.user.partidas_ganadas = response.data[0].Partidas_Ganadas;
                $scope.user.partidas_empatadas = response.data[0].Partidas_Empatadas;
                $scope.user.partidas_perdidas = response.data[0].Partidas_Perdidas;
            });
        };

    })
;
