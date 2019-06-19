import axios from 'axios';

const route = '/api/sunat/consultaruc';

export function SearchRuc(ruc) {
    const params = {
        ruc: ruc
    };
    return axios.get(route, {
        params: params
    }).then(response => response.data.data).catch(err => {
        throw err;
    });
}