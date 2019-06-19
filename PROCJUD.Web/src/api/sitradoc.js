import axios from 'axios';

const routes = {
    sitradoc: '/api/sitradoc',
};

export function FecthRegistrosSitradoc(numero, page, pageSize) {
    const params = {
        numero: numero,
        page: page,
        pageSize: pageSize
    };
    return axios.get(`${routes.sitradoc}/documentos`, {
        params: params
    }).then(function (response) {
        return response.data;
    }).catch(error => {
        throw (err.response.data || null)
    });
}