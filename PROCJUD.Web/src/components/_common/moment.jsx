import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

function Moment(props) {
    let dateFormatted = '';
    let { date, format } = props;
    if (!format) format = 'DD/MM/YYYY';

    if (!date || date === '') {
        dateFormatted = '-';
    } else if (date instanceof moment) {
        dateFormatted = date.format(format);
    } else if (moment(date, format, true).isValid()) {
        dateFormatted = date;
    } else {
        dateFormatted = moment(date).format(format);
    }
    return <span>{dateFormatted}</span>;
}

Moment.propTypes = {
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    format: PropTypes.string
};

export default Moment;
