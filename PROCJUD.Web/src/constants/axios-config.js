import axios from 'axios';

function HandleHttpError(err) {
    if (err.response.status != 406 && err.response.status != 404 && err.response.status != 400) {
        console.log(err.response)
    }
}

export function configAxios() {
    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (err) {
            HandleHttpError(err);
            return Promise.reject(err);
        }
    );
}