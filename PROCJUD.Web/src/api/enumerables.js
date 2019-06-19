import axios from 'axios';

const routes = {
    condicion: '/api/enumerable/condicion',
    opd: '/api/enumerable/opd',
    materia: '/api/enumerable/materia',
    naturaleza: '/api/enumerable/naturaleza',
    tiposProceso: '/api/enumerable/tiposproceso',
    tiposResponsabilidad: '/api/enumerable/tiporesponsabilidad',
    etapaProcesal: '/api/enumerable/etapaprocesal',
    abogados: '/api/enumerable/abogados',
    tipoInstancia: '/api/enumerable/tipoinstancia',
    tipoPlazo: '/api/enumerable/tipoplazo',
    tipoMonto: '/api/enumerable/tipomonto'
};

export function FetchCondiciones() {
    return axios.get(routes.condicion).then(response => response.data.data.condiciones).catch(err => {
        throw err;
    });
}

export function FetchOpd() {
    return axios.get(routes.opd).then(response => response.data.data.opd).catch(err => {
        throw err;
    });
}

export function FetchMaterias() {
    return axios.get(routes.materia).then(response => response.data.data.materias).catch(err => {
        throw err;
    });
}

export function FetchNaturalezas(id_materia, all = false) {
    let config = {
        params: {
            id_materia: id_materia
        }
    };
    if (all)
        config.params.all = 1;
    return axios.get(routes.naturaleza, config).then(response => response.data.data.naturalezas).catch(err => {
        throw err;
    });
}

export function FetchTiposProcesos(id_materia, all = false) {
    let config = {
        params: {
            id_materia: id_materia
        }
    };
    if (all)
        config.params.all = 1;
    return axios.get(routes.tiposProceso, config).then(response => response.data.data.tiposProceso).catch(err => {
        throw err;
    });
}

export function FetchTiposResponsabilidades() {
    return axios.get(routes.tiposResponsabilidad).then(response => response.data.data.tipos_responsabilidad).catch(err => {
        throw err;
    });
}

export function FetchEtapasProcesales() {
    return axios.get(routes.etapaProcesal).then(response => response.data.data.etapas_procesales).catch(err => {
        throw err;
    });
}

export function FetchAbogados() {
    return axios.get(routes.abogados).then(response => response.data.data.abogados).catch(err => {
        throw err;
    });
}

export function FetchInstancias(id_tipo_proceso) {
    const config = {
        params: {
            id_tipo_proceso: id_tipo_proceso
        }
    };
    return axios.get(routes.tipoInstancia, config).then(response => response.data.data.instancias).catch(err => {
        throw err;
    });
}

export function FetchPlazos(id_tipo_instancia) {
    const config = {
        params: {
            id_tipo_instancia: id_tipo_instancia
        }
    };
    return axios.get(routes.tipoPlazo, config).then(response => response.data.data.plazos).catch(err => {
        throw err;
    });
}

export function FetchTiposMontos() {
    return axios.get(routes.tipoMonto).then(response => response.data.data.tiposMonto).catch(err => {
        throw err;
    });
}