import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import DelegacionMasivaContainer from '../delegacion-masiva/delegacion-masiva-container';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

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

const DelegacionModalFilters = ({
    classes,
    filters,
    onSearch,
    loading,
    onInputChange,
    abogados,
    onClear
}) => (
        <div>
        <form onSubmit={onSearch} autoComplete="off">
            <CardContent>            
                <Grid container spacing={16}>
                    <Grid item xs={12} sm={12} md={12}>
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
                </Grid>
            </CardContent>
            </form>
        </div>
    );

DelegacionModalFilters.defaultProps = {
    loading: false
};
DelegacionModalFilters.propTypes = {
    loading: PropTypes.bool,
    filters: PropTypes.object.isRequired,
    //onClear: PropTypes.func.isRequired
};


export default withStyles(styles)(DelegacionModalFilters);
