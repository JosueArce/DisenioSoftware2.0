angular.module("loginModule",['ngRoute'])
    .config(
        function ($routeProvider,$locationProvider) {
            $locationProvider.hashPrefix('');
            $routeProvider.when('/loginWindow',{
                templateUrl : "app/logIn/login_View.html",
                controller : "loginController"
            }).otherwise({redirectTo:'/loginWindow'})
        }
    )
    .controller("loginController",function ($scope,$location,HttpRequest) {

        var app_id = "807099809474052";

        var btn_login = '<a href="#" id="login" class="btn btn-primary">Iniciar Sesión</a>';

        var div_session = "<div id='facebook-session'" +
            "<strong></strong>"+
            "<img>"+
            "<a href='#' id='logout' class='btn btn-danger'>Log Out</a>"+
            "</div>";


        /*Va cargar los sdk de Facebook apenas se cargue la ventana*/
        $scope.onLoad = function () {
            //Loads the SDK asynchronously
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
            window.fbAsyncInit = function() {
                FB.init({
                    appId      : app_id,
                    cookie     : true,  // enable cookies to allow the server to access
                    status     : true,
                    xfbml      : true,  // parse social plugins on this page
                    version    : 'v2.8' // use graph api version 2.8
                });
                FB.getLoginStatus(function(response) {
                    statusChangeCallback(response,function () {
                        
                    });
                });

            };

        };

        /*Verifica si el usuario se encuentra conectado o no, en caso de que lo esté se extraen los datos del mismo*/
        var statusChangeCallback = function(response,callback) {
            if (response.status === 'connected') {
                getFacebookData();
            } else {
                callback(false);
            }
        };

        /*Verifica el estado de logeo del usuario, en caso de que tenga remember me este va permitir logearse sin tener que escribir de nuevo los datos*/
        var checkLoginState = function(callback) {
            FB.getLoginStatus(function(response) {
                statusChangeCallback(response,function (data) {
                    callback(data);
                });
            });
        };

        /*Obtiene la información del usuario*/
        var getFacebookData = function () {
          FB.api('/me','GET', {fields: 'first_name,last_name,name,id,picture.width(150).height(150)'},function (response) {
              $("#login").after(div_session);
              $("#login").remove();
              $("#facebook-session strong").text("Bienvenido: "+response.name);


              //Almacena la información obtenida en el navegador para así manejarla en las siguientes ventanas
              localStorage.setItem("user_information",JSON.stringify(response));

              var request = {
                  method : 'GET',
                  endPoint : 'logIn',
                  params : {
                      ID_Facebook : JSON.parse(localStorage.getItem('user_information')).id,
                      nombre_jugador : JSON.parse(localStorage.getItem('user_information')).name
                  }
              };
              HttpRequest.http_request(request,function (response) {
                  //nothing will happen
              });

              window.setTimeout(function () {
                  $.notify("Welcome "+response.name,"success");
                  location.href = "app/index.html";
              },1000);
              //$.notify("Welcome "+response.name,"success");
          });
        };

        /*Ejecuta las funciones de logeo cuando se presiona el botón de logearse*/
        $scope.facebookLogin = function () {
          checkLoginState(function (response) {
              if(!response){
                  FB.login(function (response) {
                      if(response.status === 'connected'){
                          getFacebookData();
                      }
                  },{scope:'publish_actions '});
              }
          });  
        };

        /*Permite cerrar sesión cuando se presione el botón de cerrar sesión*/
        facebookLogOut = function () {
           FB.getLoginStatus(function (response) {
               if(response.status === "connected"){
                   FB.logout(function (response) {
                       $("#facebook-session").before(btn_login);
                       $("#facebook-session").remove();
                   })
               }
           })
        };
        $(document).on('click','#logout',function (event) {
            event.preventDefault();
           // facebookLogOut();
            window.setTimeout(function () {
                facebookLogOut();
                $.notify("Logged Out","info");
            },1000);
           //$.notify("Logged Out","info");
        });


    })

;