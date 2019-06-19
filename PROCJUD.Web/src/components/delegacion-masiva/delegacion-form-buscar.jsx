import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ClearIcon from '@material-ui/icons/Clear';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DatePicker } from 'material-ui-pickers';
import { dateFormat } from '../../constants/date';
import DelegacionMasivaContainer from '../delegacion-masiva/delegacion-masiva-container';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
    actionButtons: {
        width: 35,
        height: 35
    },
    actionIcons: {
        width: 25,
        height: 25
    },
    button: {
        marginLeft: 2 * theme.spacing.unit,
        marginRight: 2 * theme.spacing.unit
    },
    icon: {
        marginRight: theme.spacing.unit,
        fontSize: 20
    },
    buttonsContainer: {
        textAlign: 'right',
        marginTop: 10,
        marginBottom: 10
    },
    cardFiltros: {
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 20
    },
    textField: {
        width: '100%',
        margin: 0
    },
    datePicker: {
        margin: 2
    }
});

const DelegacionFilters = ({
    classes,
    filters,
    onSearch,
    loading,
    onInputChange,
    abogados,
    onClear,
    estados,
    disabled,
    anios
}) => (
        <div>
            <form onSubmit={onSearch} autoComplete="off">
                <CardContent>
                    <Typography variant="title">Filtros</Typography>
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={3} md={2}>
                        <TextField
                            select
                            label="Abogado"
                            className={classes.textField}
                            name="id_abogado"
                            value={filters.id_abogado}
                            onChange={onInputChange}
                            disabled={loading}
                        >
                            {abogados.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        </Grid>


                        <Grid item xs={12} sm={3} md={2}>
                            <TextField
                                select
                                label="Año"
                                className={classes.textField}
                                name="anio"
                                value={filters.anio}
                                onChange={onInputChange}
                                disabled={loading}
                            >
                                {anios.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid>
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
                                //disabled={disabled}
                            >
                                <SearchIcon className={classes.icon} />
                                Buscar
                        </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </form>
        </div>
    );

DelegacionFilters.defaultProps = {
    loading: false
};
DelegacionFilters.propTypes = {
    loading: PropTypes.bool,
    filters: PropTypes.object.isRequired,
    onClear: PropTypes.func.isRequired
};


export default withStyles(styles)(DelegacionFilters);
