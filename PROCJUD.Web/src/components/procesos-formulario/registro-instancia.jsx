import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from 'material-ui-pickers';
import { dateFormat } from '../../constants/date';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListaDocumentos from './lista-documentos';

const styles = theme => ({
    textField: {
        width: '100%',
        margin: 0
    }
});

const RegistroInstancia = ({
    classes,
    listaInstancias,
    listaPlazos,
    instancia,
    onDateInstanciaChange,
    onInputInstanciaChange,
    onAddDocumentoSimpleInstancia,
    onRemoveDocumentoSimpleInstancia,
    //onInputPlazoChange,
    loading,
    loadingInstancia,
    loadingPlazo,
    toast,
    errors
}) => (
    <div>
        <Grid container spacing={24}>
            <Grid item xs={12} sm={4} md={4}>
                <TextField
                    error={errors._instancia_id_tipo_instancia != null}
                    helperText={errors._instancia_id_tipo_instancia}
                    select
                    label="Instancia *"
                    className={classes.textField}
                    name="id_tipo_instancia"
                    onChange={onInputInstanciaChange}
                    value={instancia.id_tipo_instancia}
                    disabled={loading}
                    InputProps={{
                        endAdornment: loadingInstancia && (
                            <InputAdornment position="end">
                                {<CircularProgress size={20} />}
                            </InputAdornment>
                        )
                    }}
                >
                    {listaInstancias.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                <TextField
                    error={errors._instancia_nombre_instancia != null}
                    helperText={errors._instancia_nombre_instancia}
                    label="Nombre *"
                    className={classes.textField}
                    name="nombre_instancia"
                    onChange={onInputInstanciaChange}
                    value={instancia.nombre_instancia}
                    disabled={loading}
                />
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                <TextField
                    error={errors._instancia_numero_instancia != null}
                    helperText={errors._instancia_numero_instancia}
                    label="Número *"
                    className={classes.textField}
                    name="numero_instancia"
                    onChange={onInputInstanciaChange}
                    value={instancia.numero_instancia}
                    disabled={loading}
                />
            </Grid>

            <Grid item xs={12} sm={8} md={8}>
                <TextField
                    error={errors._instancia_id_plazo != null}
                    helperText={errors._instancia_id_plazo}
                    select
                    label="Plazo *"
                    className={classes.textField}
                    name="id_plazo"
                    onChange={onInputInstanciaChange}
                    value={instancia.id_plazo}
                    disabled={loading}
                    InputProps={{
                        endAdornment: loadingPlazo && (
                            <InputAdornment position="end">
                                {<CircularProgress size={20} />}
                            </InputAdornment>
                        )
                    }}
                >
                    {listaPlazos.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                <DatePicker
                    error={errors._instancia_fecha_notificacion != null}
                    helperText={errors._instancia_fecha_notificacion}
                    format={dateFormat}
                    autoOk
                    margin="dense"
                    className={classnames(classes.textField, classes.datePicker)}
                    clearable
                    label="Fecha Notificación *"
                    value={instancia.fecha_inicio}
                    onChange={onDateInstanciaChange('fecha_inicio')}
                    animateYearScrolling={false}
                    disabled={loading}
                    fullWidth
                    cancelLabel="Cancelar"
                    disableFuture
                />
            </Grid>

            <Grid item xs={12}>
                <ListaDocumentos
                    toast={toast}
                    loading={loading}
                    documentos={instancia.documentos}
                    onAddDocumento={onAddDocumentoSimpleInstancia}
                    onRemoveDocumento={onRemoveDocumentoSimpleInstancia}
                />
            </Grid>
        </Grid>
    </div>
);

RegistroInstancia.propTypes = {
    classes: PropTypes.object.isRequired,
    listaInstancias: PropTypes.array.isRequired,
    listaPlazos: PropTypes.array.isRequired,
    instancia: PropTypes.object.isRequired,
    onDateInstanciaChange: PropTypes.func.isRequired,
    onInputInstanciaChange: PropTypes.func.isRequired,
    onAddDocumentoSimpleInstancia: PropTypes.func.isRequired,
    onRemoveDocumentoSimpleInstancia: PropTypes.func.isRequired,
    //onInputPlazoChange: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    toast: PropTypes.object,
    errors: PropTypes.object
};

export default withStyles(styles)(RegistroInstancia);
