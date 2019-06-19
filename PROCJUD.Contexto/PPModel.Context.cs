﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PROCJUD.Contexto
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using PROCJUD.Entidades;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class DB_PROCURADURIAEntities : DbContext
    {
        public DB_PROCURADURIAEntities()
            : base("name=DB_PROCURADURIAEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<EMBXPROCESO> EMBXPROCESO { get; set; }
        public virtual DbSet<EXCEPCIONXPROCESO> EXCEPCIONXPROCESO { get; set; }
        public virtual DbSet<PLANTAXPROCESO> PLANTAXPROCESO { get; set; }
        public virtual DbSet<RESOLIMPUGNADAXPROCESO> RESOLIMPUGNADAXPROCESO { get; set; }
        public virtual DbSet<TIPO_EXCEPCION> TIPO_EXCEPCION { get; set; }
        public virtual DbSet<DAT_PROCESO_INSTANCIA> DAT_PROCESO_INSTANCIA { get; set; }
        public virtual DbSet<DAT_PROCESO_INSTANCIA_DOCUMENTO> DAT_PROCESO_INSTANCIA_DOCUMENTO { get; set; }
        public virtual DbSet<DAT_PROCESO_PLAZO> DAT_PROCESO_PLAZO { get; set; }
        public virtual DbSet<PROCESO> PROCESO { get; set; }
        public virtual DbSet<TIPO_INSTANCIA> TIPO_INSTANCIA { get; set; }
        public virtual DbSet<TIPO_MONTO> TIPO_MONTO { get; set; }
        public virtual DbSet<TIPO_PLAZO> TIPO_PLAZO { get; set; }
        public virtual DbSet<tipo_proceso> tipo_proceso { get; set; }
        public virtual DbSet<opd> opd { get; set; }
        public virtual DbSet<VW_DAT_PROCESO_INSTANCIA> VW_DAT_PROCESO_INSTANCIA { get; set; }
        public virtual DbSet<VW_DAT_PROCESO_PLAZO> VW_DAT_PROCESO_PLAZO { get; set; }
        public virtual DbSet<VW_DOCUMENTO_SITRADOC> VW_DOCUMENTO_SITRADOC { get; set; }
        public virtual DbSet<VW_EMBARCACION> VW_EMBARCACION { get; set; }
        public virtual DbSet<VW_PERSONA> VW_PERSONA { get; set; }
        public virtual DbSet<VW_PLANTA_PESQUERA> VW_PLANTA_PESQUERA { get; set; }
        public virtual DbSet<VW_PROCESO> VW_PROCESO { get; set; }
        public virtual DbSet<VW_TIPO_INSTANCIA> VW_TIPO_INSTANCIA { get; set; }
        public virtual DbSet<VW_TIPO_PLAZO> VW_TIPO_PLAZO { get; set; }
        public virtual DbSet<VW_TIPO_PROCESO> VW_TIPO_PROCESO { get; set; }
        public virtual DbSet<VW_TRABAJADOR_PRODUCE> VW_TRABAJADOR_PRODUCE { get; set; }
        public virtual DbSet<condicion> condicion { get; set; }
        public virtual DbSet<distritojudicial> distritojudicial { get; set; }
        public virtual DbSet<ETAPA_PROCESAL> ETAPA_PROCESAL { get; set; }
        public virtual DbSet<ETAPAS> ETAPAS { get; set; }
        public virtual DbSet<materia> materia { get; set; }
        public virtual DbSet<medida> medida { get; set; }
        public virtual DbSet<naturaleza> naturaleza { get; set; }
        public virtual DbSet<RZ_procuraduria> RZ_procuraduria { get; set; }
        public virtual DbSet<sede> sede { get; set; }
        public virtual DbSet<tipo_responsabilidad> tipo_responsabilidad { get; set; }
        public virtual DbSet<dat_materia_tipo_proceso> dat_materia_tipo_proceso { get; set; }
        public virtual DbSet<VW_RESOLUCION_SITRADOC> VW_RESOLUCION_SITRADOC { get; set; }
    
        public virtual int sp_get_correlativo(Nullable<int> iD_MATERIA, ObjectParameter cORRELATIVO)
        {
            var iD_MATERIAParameter = iD_MATERIA.HasValue ?
                new ObjectParameter("ID_MATERIA", iD_MATERIA) :
                new ObjectParameter("ID_MATERIA", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_get_correlativo", iD_MATERIAParameter, cORRELATIVO);
        }
    
        public virtual int sp_get_id_resolucion_consav(Nullable<int> iD_RESOLUCION, ObjectParameter id_resolucion_directoral)
        {
            var iD_RESOLUCIONParameter = iD_RESOLUCION.HasValue ?
                new ObjectParameter("ID_RESOLUCION", iD_RESOLUCION) :
                new ObjectParameter("ID_RESOLUCION", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_get_id_resolucion_consav", iD_RESOLUCIONParameter, id_resolucion_directoral);
        }
    
        public virtual int sp_contar_pagina_proceso(string numero, Nullable<int> id_abogado, Nullable<int> id_materia, Nullable<int> id_naturaleza, Nullable<int> id_tipo_proceso, Nullable<int> id_estado, Nullable<System.DateTime> fecha_inicio, Nullable<System.DateTime> fecha_fin, string razon_social, string numero_resolucion, string expediente_judicial, ObjectParameter total)
        {
            var numeroParameter = numero != null ?
                new ObjectParameter("numero", numero) :
                new ObjectParameter("numero", typeof(string));
    
            var id_abogadoParameter = id_abogado.HasValue ?
                new ObjectParameter("id_abogado", id_abogado) :
                new ObjectParameter("id_abogado", typeof(int));
    
            var id_materiaParameter = id_materia.HasValue ?
                new ObjectParameter("id_materia", id_materia) :
                new ObjectParameter("id_materia", typeof(int));
    
            var id_naturalezaParameter = id_naturaleza.HasValue ?
                new ObjectParameter("id_naturaleza", id_naturaleza) :
                new ObjectParameter("id_naturaleza", typeof(int));
    
            var id_tipo_procesoParameter = id_tipo_proceso.HasValue ?
                new ObjectParameter("id_tipo_proceso", id_tipo_proceso) :
                new ObjectParameter("id_tipo_proceso", typeof(int));
    
            var id_estadoParameter = id_estado.HasValue ?
                new ObjectParameter("id_estado", id_estado) :
                new ObjectParameter("id_estado", typeof(int));
    
            var fecha_inicioParameter = fecha_inicio.HasValue ?
                new ObjectParameter("fecha_inicio", fecha_inicio) :
                new ObjectParameter("fecha_inicio", typeof(System.DateTime));
    
            var fecha_finParameter = fecha_fin.HasValue ?
                new ObjectParameter("fecha_fin", fecha_fin) :
                new ObjectParameter("fecha_fin", typeof(System.DateTime));
    
            var razon_socialParameter = razon_social != null ?
                new ObjectParameter("razon_social", razon_social) :
                new ObjectParameter("razon_social", typeof(string));
    
            var numero_resolucionParameter = numero_resolucion != null ?
                new ObjectParameter("numero_resolucion", numero_resolucion) :
                new ObjectParameter("numero_resolucion", typeof(string));
    
            var expediente_judicialParameter = expediente_judicial != null ?
                new ObjectParameter("expediente_judicial", expediente_judicial) :
                new ObjectParameter("expediente_judicial", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_contar_pagina_proceso", numeroParameter, id_abogadoParameter, id_materiaParameter, id_naturalezaParameter, id_tipo_procesoParameter, id_estadoParameter, fecha_inicioParameter, fecha_finParameter, razon_socialParameter, numero_resolucionParameter, expediente_judicialParameter, total);
        }
    
        public virtual ObjectResult<VW_PROCESO> sp_listar_pagina_proceso(Nullable<int> page, Nullable<int> pageSize, string numero, Nullable<int> id_abogado, Nullable<int> id_materia, Nullable<int> id_naturaleza, Nullable<int> id_tipo_proceso, Nullable<int> id_estado, Nullable<System.DateTime> fecha_inicio, Nullable<System.DateTime> fecha_fin, string razon_social, string numero_resolucion, string expediente_judicial)
        {
            var pageParameter = page.HasValue ?
                new ObjectParameter("page", page) :
                new ObjectParameter("page", typeof(int));
    
            var pageSizeParameter = pageSize.HasValue ?
                new ObjectParameter("pageSize", pageSize) :
                new ObjectParameter("pageSize", typeof(int));
    
            var numeroParameter = numero != null ?
                new ObjectParameter("numero", numero) :
                new ObjectParameter("numero", typeof(string));
    
            var id_abogadoParameter = id_abogado.HasValue ?
                new ObjectParameter("id_abogado", id_abogado) :
                new ObjectParameter("id_abogado", typeof(int));
    
            var id_materiaParameter = id_materia.HasValue ?
                new ObjectParameter("id_materia", id_materia) :
                new ObjectParameter("id_materia", typeof(int));
    
            var id_naturalezaParameter = id_naturaleza.HasValue ?
                new ObjectParameter("id_naturaleza", id_naturaleza) :
                new ObjectParameter("id_naturaleza", typeof(int));
    
            var id_tipo_procesoParameter = id_tipo_proceso.HasValue ?
                new ObjectParameter("id_tipo_proceso", id_tipo_proceso) :
                new ObjectParameter("id_tipo_proceso", typeof(int));
    
            var id_estadoParameter = id_estado.HasValue ?
                new ObjectParameter("id_estado", id_estado) :
                new ObjectParameter("id_estado", typeof(int));
    
            var fecha_inicioParameter = fecha_inicio.HasValue ?
                new ObjectParameter("fecha_inicio", fecha_inicio) :
                new ObjectParameter("fecha_inicio", typeof(System.DateTime));
    
            var fecha_finParameter = fecha_fin.HasValue ?
                new ObjectParameter("fecha_fin", fecha_fin) :
                new ObjectParameter("fecha_fin", typeof(System.DateTime));
    
            var razon_socialParameter = razon_social != null ?
                new ObjectParameter("razon_social", razon_social) :
                new ObjectParameter("razon_social", typeof(string));
    
            var numero_resolucionParameter = numero_resolucion != null ?
                new ObjectParameter("numero_resolucion", numero_resolucion) :
                new ObjectParameter("numero_resolucion", typeof(string));
    
            var expediente_judicialParameter = expediente_judicial != null ?
                new ObjectParameter("expediente_judicial", expediente_judicial) :
                new ObjectParameter("expediente_judicial", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<VW_PROCESO>("sp_listar_pagina_proceso", pageParameter, pageSizeParameter, numeroParameter, id_abogadoParameter, id_materiaParameter, id_naturalezaParameter, id_tipo_procesoParameter, id_estadoParameter, fecha_inicioParameter, fecha_finParameter, razon_socialParameter, numero_resolucionParameter, expediente_judicialParameter);
        }
    
        public virtual ObjectResult<VW_PROCESO> sp_listar_pagina_proceso(Nullable<int> page, Nullable<int> pageSize, string numero, Nullable<int> id_abogado, Nullable<int> id_materia, Nullable<int> id_naturaleza, Nullable<int> id_tipo_proceso, Nullable<int> id_estado, Nullable<System.DateTime> fecha_inicio, Nullable<System.DateTime> fecha_fin, string razon_social, string numero_resolucion, string expediente_judicial, MergeOption mergeOption)
        {
            var pageParameter = page.HasValue ?
                new ObjectParameter("page", page) :
                new ObjectParameter("page", typeof(int));
    
            var pageSizeParameter = pageSize.HasValue ?
                new ObjectParameter("pageSize", pageSize) :
                new ObjectParameter("pageSize", typeof(int));
    
            var numeroParameter = numero != null ?
                new ObjectParameter("numero", numero) :
                new ObjectParameter("numero", typeof(string));
    
            var id_abogadoParameter = id_abogado.HasValue ?
                new ObjectParameter("id_abogado", id_abogado) :
                new ObjectParameter("id_abogado", typeof(int));
    
            var id_materiaParameter = id_materia.HasValue ?
                new ObjectParameter("id_materia", id_materia) :
                new ObjectParameter("id_materia", typeof(int));
    
            var id_naturalezaParameter = id_naturaleza.HasValue ?
                new ObjectParameter("id_naturaleza", id_naturaleza) :
                new ObjectParameter("id_naturaleza", typeof(int));
    
            var id_tipo_procesoParameter = id_tipo_proceso.HasValue ?
                new ObjectParameter("id_tipo_proceso", id_tipo_proceso) :
                new ObjectParameter("id_tipo_proceso", typeof(int));
    
            var id_estadoParameter = id_estado.HasValue ?
                new ObjectParameter("id_estado", id_estado) :
                new ObjectParameter("id_estado", typeof(int));
    
            var fecha_inicioParameter = fecha_inicio.HasValue ?
                new ObjectParameter("fecha_inicio", fecha_inicio) :
                new ObjectParameter("fecha_inicio", typeof(System.DateTime));
    
            var fecha_finParameter = fecha_fin.HasValue ?
                new ObjectParameter("fecha_fin", fecha_fin) :
                new ObjectParameter("fecha_fin", typeof(System.DateTime));
    
            var razon_socialParameter = razon_social != null ?
                new ObjectParameter("razon_social", razon_social) :
                new ObjectParameter("razon_social", typeof(string));
    
            var numero_resolucionParameter = numero_resolucion != null ?
                new ObjectParameter("numero_resolucion", numero_resolucion) :
                new ObjectParameter("numero_resolucion", typeof(string));
    
            var expediente_judicialParameter = expediente_judicial != null ?
                new ObjectParameter("expediente_judicial", expediente_judicial) :
                new ObjectParameter("expediente_judicial", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<VW_PROCESO>("sp_listar_pagina_proceso", mergeOption, pageParameter, pageSizeParameter, numeroParameter, id_abogadoParameter, id_materiaParameter, id_naturalezaParameter, id_tipo_procesoParameter, id_estadoParameter, fecha_inicioParameter, fecha_finParameter, razon_socialParameter, numero_resolucionParameter, expediente_judicialParameter);
        }
    }
}
