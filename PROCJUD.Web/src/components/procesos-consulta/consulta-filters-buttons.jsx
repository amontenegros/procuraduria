import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    button: {
        marginLeft: 2 * theme.spacing.unit,
        marginRight: 2 * theme.spacing.unit
    },
    icon: {
        marginRight: theme.spacing.unit,
        fontSize: 20
    },
    buttonsContainer: {
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10
    }
});

const ConsultaFiltersButtons = ({ classes, disabled, onClear }) => (
    <div className={classes.buttonsContainer}>
        <Button
            type="button"
            variant="contained"
            className={classes.button}
            size="small"
            disabled={disabled}
            onClick={onClear}
        >
            <Icon className={classes.icon}>clear_all</Icon>
            Limpiar
        </Button>
        <Button
            type="submit"
            variant="contained"
            size="small"
            color="primary"
            className={classes.button}
            disabled={disabled}
        >
            <SearchIcon className={classes.icon} />
            Buscar
        </Button>
    </div>
);


export default withStyles(styles)(ConsultaFiltersButtons);

