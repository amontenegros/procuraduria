import axios from 'axios';

const routes = {
    personas: '/api/general/buscarpersona'
};

export function SearchPersonas(nombre) {
    return axios.get(routes.personas, {
        params: {
            term: nombre
        }
    }).then(response => response.data.data.personas).catch(err => {
        throw err.response;
    });
}