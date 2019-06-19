import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import moment from 'moment';
import 'moment/locale/es';
import { theme } from './constants/config';
import { configAxios } from './constants/axios-config';
configAxios();

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale="es">
            <App />
        </MuiPickersUtilsProvider>
    </MuiThemeProvider>,
    document.getElementById('root')
);
