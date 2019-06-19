import axios from 'axios';

const route = '/api/delegacion';

export function Buscar(codigo_trabajador, anio) {
    const params = {
        codigo_trabajador, anio
    };

    return axios.get(`${route}/buscar`, {
        params: params
    }).then(response => response.data).catch(err => {
        throw err.response;
    });
}