import moment from 'moment';

export const dateFormat = 'DD/MM/YYYY';

export function ConvertStringToMoment(string, format) {
    return moment(string, format);
}

export function ConvertJsonDate(date) {
    return moment(date).toDate();
}

export function FormatDate(date, format) {
    return moment(date).format(format);
}

export function ConvertJsonToMoment(date) {
    return moment(date);
}