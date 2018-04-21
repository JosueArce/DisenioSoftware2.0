using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi_Othello.Models
{
    class Data
    {
        public int puntos_J1 { get; set; }
        public int puntos_J2 { get; set; }
        public string[][] tablero { get; set; }
        public bool juego_Terminado { get; set; }
        public string jugador_Actual { get; set; }
    }
}
