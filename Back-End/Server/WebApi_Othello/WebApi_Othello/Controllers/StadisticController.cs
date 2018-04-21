using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApi_Othello.Models;

namespace WebApi_Othello.Controllers
{
    public class StadisticController : Controller
    {
        private Estadisticas_Manager stats_manager;
        public StadisticController()
        {
            stats_manager = new Estadisticas_Manager();
        }

        public JsonResult Get_Stadistics(string ID_Facebook)
        {
            switch (Request.HttpMethod)
            {
                case "GET":
                    return Json(stats_manager.extract_stats(ID_Facebook),
                                JsonRequestBehavior.AllowGet);
            }

            return Json(new { Error = true, Message = "Operación HTTP desconocida" });
        }
    }
}