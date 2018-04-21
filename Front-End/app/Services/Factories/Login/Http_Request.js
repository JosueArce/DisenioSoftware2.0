angular.module("loginModule")
    .factory("HttpRequest",function ($http) {
        var obj = {
            http_request : function (http_data,callback) {
                $http({
                    method : http_data.method,
                    url : "http://localhost:50714/"+http_data.endPoint,
                    params : http_data.params
                }).then(function successCallback(response) {
                    callback(response);
                }).catch(function errorCallback(response) {
                    callback(response);
                })
            }
        };
        return obj;
    })
;
