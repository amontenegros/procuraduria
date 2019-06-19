using OfficeOpenXml;
using OfficeOpenXml.Style;
using PROCJUD.IAplicacionService;
using PROCJUD.Request;
using PROCJUD.Web.Models.Excel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Linq;
using System.Net.Mime;
using System.Reflection;
using System.Web.Mvc;

namespace PROCJUD.Web.Controllers
{
    [Authorize]
    public class ReporteController : Controller
    {
        private readonly IProcesoService procesoService;

        public ReporteController(IProcesoService procesoService)
        {
            this.procesoService = procesoService;
        }
        // GET: Reporte
        public ActionResult Procesos(string numero = null, int? id_naturaleza = null,
         int? id_tipo_proceso = null, int? id_materia = null, string razon_social = null, int? id_abogado = null, string numero_resolucion = null,
         DateTime? fecha_inicio = null, DateTime? fecha_fin = null, int? id_estado = null)
        {
            var filters = new ProcesoFilters
            {
                numero = numero,
                id_naturaleza = id_naturaleza,
                id_tipo_proceso = id_tipo_proceso,
                id_materia = id_materia,
                razon_social = razon_social,
                id_abogado = id_abogado,
                numero_resolucion = numero_resolucion,
                fecha_inicio = fecha_inicio,
                fecha_fin = fecha_fin,
                id_estado = id_estado
            };

            using (var excel = new ExcelPackage())
            {
                var lista = this.procesoService.Page(1, 500, filters, 0, false);
                var data = new List<ReporteProceso>();

                lista.items.ForEach(x =>
                {
                    var item = new ReporteProceso
                    {
                        numero = x.numero,
                        materia = x.materia_descripcion,
                        tipo_proceso = x.tipo_proceso_descripcion,
                        naturaleza = x.naturaleza_descripcion,
                        razon_social = string.Join(", ", x.personas.Select(p => p.razonsocial).ToArray()),
                        abogado = x.abogado,
                        resolucion = string.Join(", ", x.resoluciones.Select(r => r.numero).ToArray()),
                        fecha = x.auditmod,
                        estado = x.estado_descripcion
                    };
                    data.Add(item);
                });

                return this.Excel(data, "PROCESOS JUDICIALES", "PROCESOS JUDICIALES");

            }

            return null;
        }

        protected virtual ActionResult Excel<T>(IEnumerable<T> data, string name, string title)
        {

            using (var excel = new ExcelPackage())
            {

                excel.Workbook.Properties.Title = "Reportes";
                excel.Workbook.Properties.Author = "Ministerio de la Producción - OGTI";
                excel.Workbook.Properties.Comments = "Ministerio de la Producción - OGTI";
                excel.Workbook.Properties.Company = "Ministerio de la Producción - OGTI";

                var sheet = excel.Workbook.Worksheets.Add(name);

                sheet.HeaderFooter.OddHeader.CenteredText = "&amp;24&amp;U&amp;\"Arial,Regular Bold\" Inventory";

                sheet.HeaderFooter.OddHeader.RightAlignedText =
                string.Format("Page {0} of {1}", ExcelHeaderFooter.PageNumber, ExcelHeaderFooter.NumberOfPages);
                sheet.HeaderFooter.OddHeader.CenteredText = ExcelHeaderFooter.SheetName;

                //var Path = @"D:\meoci\MEOCI\Dev\Med.Meoci\Med.Meoci.Presentation.Infrastructure\Web\";
                sheet.HeaderFooter.OddHeader.LeftAlignedText = ExcelHeaderFooter.FilePath + ExcelHeaderFooter.FileName;

                PropertyInfo[] properties = typeof(T).GetProperties();

                int m = 1;

                sheet.Cells[m, (properties.Count() / 2)].Style.Font.Size = 16;
                sheet.Cells[m, (properties.Count() / 2)].Style.Font.Bold = true;
                sheet.Cells[m, (properties.Count() / 2)].Value = string.Format("{0}", title);

                m = 3;
                sheet.Cells[m, 1].Style.Font.Size = 12;
                sheet.Cells[m, 1].Style.Font.Bold = true;
                sheet.Cells[m, 1].Value = "Fecha de reporte: " + DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");

                m = 5;
                for (int i = 1; i <= properties.Length; i++)
                {
                    sheet.Cells[m, i].Value = properties[i - 1].GetCustomAttributes(typeof(DisplayAttribute), false).Cast<DisplayAttribute>().Single().Name;
                    //sheet.Cells[m, i + 1].AutoFilter = false;

                }

                using (var header = sheet.Cells[m, 1, m, sheet.Dimension.End.Column])
                {
                    header.Style.Font.Bold = true;
                    header.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    header.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(79, 129, 189));
                    //header.AutoFitColumns(20, 100);
                    header.AutoFitColumns(100);
                    header.Style.Font.Color.SetColor(System.Drawing.Color.White);
                    header.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    header.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    header.Style.Border.Left.Color.SetColor(System.Drawing.Color.White);
                }

                m++;
                int rowBody = m;
                bool colorCell = true;

                data.ToList().ForEach(delegate (T item)
                {
                    colorCell = !colorCell;

                    int j = 1;
                    IEnumerable<PropertyInfo> elementsToAudit = item.GetType().GetProperties();
                    foreach (PropertyInfo element in elementsToAudit)
                    {
                        var valor = element.GetValue(item, null);
                        if (valor != null)
                        {
                            sheet.Cells[m, j].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            sheet.Cells[m, j].Style.Fill.BackgroundColor.SetColor((colorCell ? System.Drawing.Color.FromArgb(229, 238, 250) : System.Drawing.Color.White));
                            Type t = valor.GetType();
                            if (t == typeof(DateTime))
                            {
                                sheet.Cells[m, j].Value = DateTime.Parse(valor.ToString()).ToString("dd/MM/yyyy");
                            }
                            else
                            {
                                sheet.Cells[m, j].Value = valor;
                                sheet.Cells[m, j].Style.WrapText = false;

                            }
                        }
                        j++;
                    }
                    m++;
                });

                using (var body = sheet.Cells[rowBody, 1, m, sheet.Dimension.End.Column])
                {
                    body.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    body.Style.Border.Top.Color.SetColor(ColorTranslator.FromHtml("#cacaca"));
                    body.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    body.Style.Border.Left.Color.SetColor(ColorTranslator.FromHtml("#cacaca"));
                    body.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    body.Style.Border.Bottom.Color.SetColor(ColorTranslator.FromHtml("#cacaca"));
                    body.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    body.Style.Border.Right.Color.SetColor(ColorTranslator.FromHtml("#cacaca"));
                }

                return File(excel.GetAsByteArray(), MediaTypeNames.Application.Octet, name + ".xlsx");
            }

        }
    }
}