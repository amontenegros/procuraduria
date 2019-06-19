import axios from 'axios';

const route = '/api/proceso';

export function GetPage(page, pageSize, filters) {
    const params = {
        page: page,
        pageSize: pageSize,
        ...filters
    };
    return axios.get(`${route}`, {
        params: params
    }).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function Save(form) {
    return axios.post(route, form).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function Get(id) {
    return axios.get(`${route}/${id}`).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function Update(id, form) {
    return axios.put(`${route}/${id}`, form).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function Finalizar(id, form) {
    return axios.post(`${route}/${id}/finalizar`, form).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function DelegacionMasivaLegajos(id_abogado, legajos) {
    return axios.post(`${route}/DelegacionMasivaLegajos`, { legajos: legajos, id_abogado: id_abogado }).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function GetPageDelegacionMasiva(filters) {
    return axios.get(`${route}/DelegacionMasivaBuscarLegajos`, {
        params: filters
    }).then(response => response.data).catch(err => {
        throw err.response;
    });
}

//================================================
//PERSONAS
//================================================
export function SavePersona(id, persona) {
    return axios.post(`${route}/${id}/persona`, persona).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function DeletePersona(id, id_rz) {
    return axios.delete(`${route}/${id}/persona/${id_rz}`).then(response => response.data).catch(err => {
        throw err.response;
    });
}
//================================================
//RESOLUCIONES
//================================================
export function SaveResolucion(id, resolucion) {
    return axios.post(`${route}/${id}/resolucion`, resolucion).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function DeleteResolucion(id, id_resol) {
    return axios.delete(`${route}/${id}/resolucion/${id_resol}`).then(response => response.data).catch(err => {
        throw err.response;
    });
}
//================================================
//EMBARCACIONES
//================================================
export function SaveEmbarcacion(id, embarcacion) {
    return axios.post(`${route}/${id}/embarcacion`, embarcacion).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function DeleteEmbarcacion(id, id_embxproceso) {
    return axios.delete(`${route}/${id}/embarcacion/${id_embxproceso}`).then(response => response.data).catch(err => {
        throw err.response;
    });
}

//================================================
//PLANTAS
//================================================
export function SavePlanta(id, planta) {
    return axios.post(`${route}/${id}/planta`, planta).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function DeletePlanta(id, id_plantaxproceso) {
    return axios.delete(`${route}/${id}/planta/${id_plantaxproceso}`).then(response => response.data).catch(err => {
        throw err.response;
    });
}

//================================================
//INSTANCIAS
//================================================
export function GetInstancia(id, id_proceso_instancia) {
    return axios.get(`${route}/${id}/instancia/${id_proceso_instancia}`).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function SaveInstancia(id, instancia) {
    return axios.post(`${route}/${id}/instancia`, instancia).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function UpdateInstancia(id, id_proceso_instancia, instancia) {
    return axios.put(`${route}/${id}/instancia/${id_proceso_instancia}`, instancia).then(response => response.data).catch(err => {
        throw err.response;
    });
}

export function FinalizaInstancia(id, id_proceso_instancia, form) {
    return axios.post(`${route}/${id}/instancia/${id_proceso_instancia}/finalizar`, form).then(response => response.data).catch(err => {
        throw err.response;
    });
}
//================================================
//DOCUMENTOS
//================================================

export function SaveDocumento(id_proceso, id_proceso_instancia, documento) {
    return axios.post(`${route}/${id_proceso}/instancia/${id_proceso_instancia}/documento`, documento)
        .then(response => response.data).catch(err => {
            throw err.response;
        });
}

export function DeleteDocumento(id_proceso, id_proceso_instancia, id_proceso_instancia_documento) {
    return axios.delete(`${route}/${id_proceso}/instancia/${id_proceso_instancia}/documento/${id_proceso_instancia_documento}`)
        .then(response => response.data).catch(err => {
            throw err.response;
        });
}

//================================================
//PLAZOS
//================================================

export function SavePlazo(id_proceso, id_proceso_instancia, proceso_plazo) {
    return axios.post(`${route}/${id_proceso}/instancia/${id_proceso_instancia}/plazo`, proceso_plazo)
        .then(response => response.data).catch(err => {
            throw err.response;
        });
}

export function UpdatePlazo(id_proceso, id_proceso_instancia, id_proceso_plazo, plazo) {
    return axios.put(`${route}/${id_proceso}/instancia/${id_proceso_instancia}/plazo/${id_proceso_plazo}`, plazo)
        .then(response => response.data).catch(err => {
            throw err.response;
        });
}

export function DeletePlazo(id_proceso, id_proceso_instancia, id_proceso_plazo) {
    return axios.delete(`${route}/${id_proceso}/instancia/${id_proceso_instancia}/plazo/${id_proceso_plazo}`)
        .then(response => response.data).catch(err => {
            throw err.response;
        });
}