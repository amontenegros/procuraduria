import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DatePicker } from 'material-ui-pickers';
import { dateFormat } from '../../constants/date';
import ConsultaFiltersButtons from './consulta-filters-buttons';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    textField: {
        width: '100%',
        margin: 0
    },
    datePicker: {
        margin: 2
    }
});

const ConsultaFilters = ({
    classes,
    filters,
    onSearch,
    loading,
    loadingTipoProceso,
    loadingNaturalezas,
    onInputChange,
    onDateChange,
    naturalezas,
    tiposProceso,
    materias,
    abogados,
    estados,
    onClear
}) => (
    <div>
        <form onSubmit={onSearch} autoComplete="off">
            <CardContent>
                <Typography variant="title">Filtros</Typography>
                <Grid container spacing={16}>
                    <Grid item xs={12} sm={3} md={2}>
                        <TextField
                            label="Número"
                            className={classes.textField}
                            name="numero"
                            value={filters.numero}
                            onChange={onInputChange}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <TextField
                            select
                            label="Naturaleza"
                            className={classes.textField}
                            name="id_materia"
                            value={filters.id_materia}
                            onChange={onInputChange}
                            disabled={loading}
                        >
                            {materias.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <TextField
                            select
                            label="Tipo Proceso"
                            className={classes.textField}
                            name="id_tipo_proceso"
                            value={filters.id_tipo_proceso}
                            onChange={onInputChange}
                            disabled={loading}
                            InputProps={{
                                endAdornment: loadingTipoProceso && (
                                    <InputAdornment position="end">
                                        {<CircularProgress size={20} />}
                                    </InputAdornment>
                                )
                            }}
                        >
                            {tiposProceso.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <TextField
                            select
                            label="Materia"
                            className={classes.textField}
                            name="id_naturaleza"
                            value={filters.id_naturaleza}
                            onChange={onInputChange}
                            disabled={loading}
                            InputProps={{
                                endAdornment: loadingNaturalezas && (
                                    <InputAdornment position="end">
                                        {<CircularProgress size={20} />}
                                    </InputAdornment>
                                )
                            }}
                        >
                            {naturalezas.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Razón Social/Nombre apellido"
                            className={classes.textField}
                            name="razon_social"
                            value={filters.razon_social}
                            onChange={onInputChange}
                            disabled={loading}
                        />
                    </Grid>

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
                            label="Resolución"
                            className={classes.textField}
                            name="numero_resolucion"
                            value={filters.numero_resolucion}
                            onChange={onInputChange}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <DatePicker
                            emptyLabel="dd/mm/yyyy"
                            format={dateFormat}
                            autoOk
                            className={classnames(classes.textField, classes.datePicker)}
                            clearable
                            label="Buscar desde"
                            value={filters.fecha_inicio}
                            onChange={onDateChange('fecha_inicio')}
                            animateYearScrolling={false}
                            disabled={loading}
                            fullWidth
                            cancelLabel="Cancelar"
                            disableFuture
                        />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <DatePicker
                            emptyLabel="dd/mm/yyyy"
                            format={dateFormat}
                            autoOk
                            className={classnames(classes.textField, classes.datePicker)}
                            clearable
                            label="Buscar hasta"
                            value={filters.fecha_fin}
                            onChange={onDateChange('fecha_fin')}
                            animateYearScrolling={false}
                            disabled={loading}
                            fullWidth
                            cancelLabel="Cancelar"
                            disableFuture
                        />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <TextField
                            label="N° Exp. Judicial"
                            className={classes.textField}
                            name="expediente_judicial"
                            value={filters.expediente_judicial}
                            onChange={onInputChange}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <TextField
                            select
                            label="Estado"
                            className={classes.textField}
                            name="id_estado"
                            value={filters.id_estado}
                            onChange={onInputChange}
                            disabled={loading}
                        >
                            {estados.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </CardContent>
            <ConsultaFiltersButtons onClear={onClear} disabled={loading} />
        </form>
    </div>
);

ConsultaFilters.defaultProps = {
    loading: false
};

ConsultaFilters.propTypes = {
    loading: PropTypes.bool,
    filters: PropTypes.object.isRequired,
    onClear: PropTypes.func.isRequired
};

export default withStyles(styles)(ConsultaFilters);
