using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ASP_NET_Karttapaikat.Models;

namespace ASP_NET_Karttapaikat.Controllers
{
    public class MapController : Controller
    {
        // GET: Map
        public ActionResult Index()
        {
            PaikkaDbEntities entities = new PaikkaDbEntities();
            List<PaikanTyyppi> model_paikkatyypit = entities.PaikanTyyppi.ToList();  //paikkatyypit, eli paikkakunnat, nähtävyydet...
            List<Siirtymistapa> model_siirtymistavat = entities.Siirtymistapa.ToList(); //autolla, kävellen tai pyörällä
            List<Kiertue> model_kiertueet = entities.Kiertue.ToList(); //kiertueet
            //ViewBag.OmaTieto = model_paikkatyypit.Count();
            entities.Dispose();

            var viewModel = new OmaModel
            {
                PaikanTyyppi = model_paikkatyypit,
                Siirtymistapa = model_siirtymistavat,
                Kiertue = model_kiertueet
            };

            return View(viewModel);
        }
    }
}