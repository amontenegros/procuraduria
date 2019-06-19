import {
    createMuiTheme
} from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: red['A700']
        }, // Purple and green play nicely together.
        secondary: {
            main: grey[50]
        }, // This is just green.A700 as hex.
        text: {
            disabled: '#444'
        }

    },

    typography: {

        // In Japanese the characters are usually larger.

        fontSize: 13

    }

});