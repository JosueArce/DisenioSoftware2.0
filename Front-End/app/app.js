angular.module("appModule",['ngRoute'])
    .config(
        function ($routeProvider,$locationProvider) {
            $locationProvider.hashPrefix('');
            $routeProvider.when('/board/JvS',{
                templateUrl : "board/JvS/board_JvS_View.html",
                controller : "boardJvSController"
            }).when('/board/JvJ',{
                templateUrl : "board/JvJ/board_JvJ_View.html",
                controller : "boardJvJController"
            }).when('/board/SvS',{
                templateUrl : "board/SvS/board_SvS_View.html",
                controller : "boardSvSController"
            }).when('/newSession/JvS',{
                templateUrl : "new_session/JvS/new_session_JvS_View.html",
                controller : "new_sessionJvS_Controller"
            }).when('/newSession/JvJ',{
                templateUrl : "new_session/JvJ/new_session_JvJ_View.html",
                controller : "new_sessionJvJ_Controller"
            }).when('/status',{
                templateUrl : "status/status_View.html",
                controller : "status_Controller"
            }).when('/sessions',{
                templateUrl : "",
                controller : ""
            }).when('/',{
                templateUrl : "home/home_View.html",
                controller : "home_Controller"
            }).when('/about',{
                templateUrl : "",
                controller : ""
            }).otherwise({redirectTo:'/'})
        }
    )
;