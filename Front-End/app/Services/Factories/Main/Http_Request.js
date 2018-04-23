angular.module("appModule")
    .factory("HttpRequest",function ($http) {
        var obj = {
            stats_request : function (http_data,callback) {
                $http({
                    method : http_data.method,
                    url : "http://localhost:50714/"+http_data.endpoint+"?ID_Facebook="+http_data.params
                }).then(function successCallback(response) {
                    callback(response);
                }).catch(function errorCallback(response) {
                    callback(response);
                })
            },
            player_vs_player : function (http_data,callback) {
                $http({
                    method : http_data.method,
                    url : "http://localhost:50714/"+http_data.endPoint,
                    dataType: 'json',
                    params : http_data.body,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function successCallback(response) {
                    callback(response);
                }).catch(function errorCallback(response) {
                    callback(response);
                })
            },
            player_vs_system : function (http_data,callback) {
                $http({
                    method : http_data.method,
                    url : "http://localhost:50714/"+http_data.endpoint,
                    dataType: 'json',
                    params : http_data.body,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function successCallback(response) {
                    callback(response);
                }).catch(function errorCallback(response) {
                    callback(response);
                })
            },
            system_vs_system : function (http_data,callback) {
                $http({
                    method : http_data.method,
                    url : "http://localhost:50714/"+http_data.endpoint,
                    dataType: 'json',
                    params : http_data.body,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function successCallback(response) {
                    callback(response);
                }).catch(function errorCallback(response) {
                    callback(response);
                })
            },
            Connected_Players : function (http_data,callback) {
                $http({
                    method : http_data.method,
                    url : "http://localhost:50714/"+http_data.endPoint,
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function successCallback(response) {
                    callback(response);
                }).catch(function errorCallback(response) {
                    callback(response);
                })
            },
            Sessions : function (http_data,callback) {
                $http({
                    method : http_data.method,
                    url : "http://localhost:50714/"+http_data.endPoint,
                    dataType: 'json',
                    params : http_data.body,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function successCallback(response) {
                    callback(response);
                }).catch(function errorCallback(response) {
                    callback(response);
                })
            },
            Accept_Invite : function (http_data, callback) {
                $http({
                    method : http_data.method,
                    url : "http://localhost:50714/"+http_data.endPoint,
                    dataType: 'json',
                    params : http_data.body,
                    headers: {
                        "Content-Type": "application/json"
                    }

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