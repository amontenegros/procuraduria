import axios from 'axios';

const route = '/api/reniec/consultadni';

export function SearchDni(dni) {
    const params = {
        dni: dni
    };
    return axios.get(route, {
        params: params
    }).then(response => response.data.data).catch(err => {
        console.log(err.response)
        throw err.response;
    });
}