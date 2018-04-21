using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApi_Othello.Models;

namespace WebApi_Othello.Controllers
{
    public class JuegoController : Controller
    {
        private Juego juego;

        public JuegoController()
        {
            this.juego = new Juego();
        }

        public JsonResult Get_Movidas_Posibles(int size, int level, String jugadorActual, List<String> posFichasJ1, List<String> posFichasJ2)
        {
            switch (Request.HttpMethod)
            {
                case "GET":
                    return Json(juego.retornarMovidasPosibles(size, level, jugadorActual, posFichasJ1, posFichasJ2),
                                JsonRequestBehavior.AllowGet);
                case "POST":
                    return Json(juego.retornarMovidasPosibles(size, level, jugadorActual, posFichasJ1, posFichasJ2));
            }

            return Json(new { Error = true, Message = "Operación HTTP desconocida" });
        }
        
        public JsonResult Realizar_Jugada_Jugador(int size, int level, String jugadorActual, int x, int y, List<String> posFichasJ1, List<String> posFichasJ2)
        {
            switch (Request.HttpMethod)
            {
                case "POST":
                    return Json(juego.jugadaJugador(size, level, jugadorActual, x, y, posFichasJ1, posFichasJ2));
            }

            return Json(new { Error = true, Message = "Operación HTTP desconocida" });
        }

        public JsonResult Realizar_Jugada_Sistema(int size, int level, String jugadorActual, List<String> posFichasJ1, List<String> posFichasJ2)
        {
            switch (Request.HttpMethod)
            {
                case "POST":
                    return Json(juego.jugadaSistema(size, level, jugadorActual, posFichasJ1, posFichasJ2));
            }

            return Json(new { Error = true, Message = "Operación HTTP desconocida" });
        }
        

        public JsonResult actualizar_Puntos_Jugador(Estadisticas_Model stats)
        {
            switch (Request.HttpMethod)
            {
                case "POST":
                    return Json(juego.actualizarPuntosBD(stats));
            }

            return Json(new { Error = true, Message = "Operación HTTP desconocida" });
        }

    }
}