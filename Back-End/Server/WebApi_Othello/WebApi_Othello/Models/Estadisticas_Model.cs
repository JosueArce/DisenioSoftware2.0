using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi_Othello.Models
{
    public class Estadisticas_Model
    {
        public string ID_Facebook { get; set; }
        public int Partidas_Ganadas { get; set; }
        public int Partidas_Empatadas { get; set; }
        public int Partidas_Perdidas { get; set; }
    }
}