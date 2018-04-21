
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebApi_Othello
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //LOGIN ROUTE
            routes.MapRoute(
                "logIn",//ID de la ruta 
                "logIn",//URL, ruta de acceso, para acceder al endPoint
                new
                {
                    controller = "Login",//controlador usado(PersonaController)
                    action = "Login"//metodo a realizar(Login()), está en el controller Login
                }
            );

            //EXTRACT STADISTICS
            routes.MapRoute(
                "stadistics",//ID de la ruta 
                "stadistics",//URL, ruta de acceso, para acceder al endPoint
                new
                {
                    controller = "Stadistic",//controlador usado(PersonaController)
                    action = "Get_Stadistics"//metodo a realizar(Login()), está en el controller Login
                }
            );

            routes.MapRoute(
                "movidasPosibles",//ID de la ruta 
                "movidasPosibles",//URL, ruta de acceso, para acceder al endPoint
                new
                {
                    controller = "Juego",//controlador usado(PersonaController)
                    action = "Get_Movidas_Posibles"//metodo a realizar(Get_Movidas_Posibles()), está en el controller Juego
                }
            );

            routes.MapRoute(
                "realizarJugadaJugador",//ID de la ruta 
                "realizarJugadaJugador",//URL, ruta de acceso, para acceder al endPoint
                new
                {
                    controller = "Juego",//controlador usado(PersonaController)
                    action = "Realizar_Jugada_Jugador"//metodo a realizar(Realizar_Jugada_Sis_Sis()), está en el controller Juego
                }
            );

            routes.MapRoute(
                "realizarJugadaSistema",//ID de la ruta 
                "realizarJugadaSistema",//URL, ruta de acceso, para acceder al endPoint
                new
                {
                    controller = "Juego",//controlador usado(PersonaController)
                    action = "Realizar_Jugada_Sistema"//metodo a realizar(Realizar_Jugada_Sis_Sis()), está en el controller Juego
                }
            );

            routes.MapRoute(
                "actualizarPuntos",//ID de la ruta 
                "actualizarPuntos",//URL, ruta de acceso, para acceder al endPoint
                new
                {
                    controller = "Juego",//controlador usado(PersonaController)
                    action = "actualizar_Puntos_Jugador"//metodo a realizar(Realizar_Jugada_Sis_Sis()), está en el controller Juego
                }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
