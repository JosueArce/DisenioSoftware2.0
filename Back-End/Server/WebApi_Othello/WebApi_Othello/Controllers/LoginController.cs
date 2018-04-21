using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApi_Othello.Models;

namespace WebApi_Othello.Controllers
{
    public class LoginController : Controller
    {
        private LoginManager loginManager;
        public LoginController()
        {
            loginManager = new LoginManager();
        }

        public JsonResult LogIn(string ID_Facebook)
        {
            switch (Request.HttpMethod)
            {
                case "GET":
                    return Json(loginManager.check_existence(ID_Facebook),
                                JsonRequestBehavior.AllowGet);
            }

            return Json(new { Error = true, Message = "Operación HTTP desconocida" });
        }
    }
}