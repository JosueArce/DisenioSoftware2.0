using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi_Othello.Models
{
    public class Sesion
    {
        public int ID_Sesion { get; set; }
        public string ID_Jugador1 { get; set; } 
        public string ID_Jugador2 { get; set; } 
        public string pos_fichas_J1 { get; set; }
        public string pos_fichas_J2 { get; set; }
        public int tam_matriz { get; set; }
        public bool estado { get; set; }
        public string ficha_J1 { get; set; }
        public string ficha_J2 { get; set; }
        public string turno { get; set; }
        public bool aceptado { get; set; }
        public string Nombre_Oponente { get; set; }
        public int CantidadPartidas { get; set; }
    }
}