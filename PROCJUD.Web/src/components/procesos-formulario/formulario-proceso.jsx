import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import classnames from 'classnames';
import PersonasRegistradas from './personas-registradas';
import { DatePicker } from 'material-ui-pickers';
import { dateFormat } from '../../constants/date';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '../_common/autocomplete';
import { ChipsResoluciones, ChipsEmbarcaciones, ChipsPlantas } from './chips-datos';
import RegistroInstancia from './registro-instancia';
import { ENUM_FORM_TYPE } from '../../constants/enums';
import AdministraInstancias from './administra-instancia';
import VerInformacionHistorica from './ver-informacion-historica';

//www.teconseguimosellink.net
const styles = theme => ({
    flex: {
        display: 'flex'
    },
    textField: {
        width: '100%',
        margin: 0
    },
    datePicker: {
        margin: 2
    },
    divider: { marginTop: 20, marginBottom: 20 },
    button: {
        margin: theme.spacing.unit
    },
    labelRadio: {
        fontSize: theme.typography.fontSize - 1
    }
});

const FormularioProceso = ({
    classes,
    type,
    toast,
    form,
    readonly,
    loading,
    loadingTipoProceso,
    loadingNaturaleza,
    loadingInstancia,
    loadingPlazo,
    onInputChange,
    onSelectChange,
    onDateChange,
    enumerables,
    onClickBuscarPersona,
    onDeletePersona,
    onSelectResolucion,
    onDeleteResolucion,
    onSelectEmbarcacion,
    onDeleteEmbarcacion,
    onSelectPlanta,
    onDeletePlanta,
    onInputInstanciaChange,
    onDateInstanciaChange,
    onAddDocumentoSimpleInstancia,
    onRemoveDocumentoSimpleInstancia,
    errors,
    onAddInstancia,
    onUpdateInstancia,
    onAddPlazo,
    onRemovePlazo,
    onAddDocumentoInstancia,
    onRemoveDocumentoInstancia,
    onCloseFormInstancia,
    onFinalizaInstancia,
    openInformacionHistorica,
    onOpenInformacionHistorica,
    onCloseInformacionHistorica
}) => (
    <div>
        {type !== ENUM_FORM_TYPE.CREATE && (
            <div style={{ textAlign: 'right' }}>
                <Button color="primary" onClick={onOpenInformacionHistorica}>
                    Ver información anterior
                </Button>
            </div>
        )}
        <Grid container spacing={24}>
            <Grid item xs={12} sm={4} md={4}>
                <TextField
                    error={errors.materia != null}
                    helperText={errors.materia}
                    select
                    label="Naturaleza *"
                    className={classes.textField}
                    name="materia"
                    onChange={onSelectChange}
                    value={form.materia}
                    disabled={loading || type === ENUM_FORM_TYPE.UPDATE || readonly}
                >
                    {enumerables.materias.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                <TextField
                    error={errors.id_tipo_proceso != null}
                    helperText={errors.id_tipo_proceso}
                    select
                    label="Tipo Proceso *"
                    className={classes.textField}
                    name="id_tipo_proceso"
                    value={form.id_tipo_proceso}
                    onChange={onSelectChange}
                    disabled={loading || type === ENUM_FORM_TYPE.UPDATE || readonly}
                    InputProps={{
                        endAdornment: loadingTipoProceso && (
                            <InputAdornment position="end">
                                {<CircularProgress size={20} />}
                            </InputAdornment>
                        )
                    }}
                >
                    {enumerables.tiposProceso.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                <TextField
                    error={errors.id_naturaleza != null}
                    helperText={errors.id_naturaleza}
                    select
                    label="Materia *"
                    className={classes.textField}
                    name="id_naturaleza"
                    value={form.id_naturaleza}
                    onChange={onInputChange}
                    disabled={loading || type === ENUM_FORM_TYPE.UPDATE || readonly}
                    InputProps={{
                        endAdornment: loadingNaturaleza && (
                            <InputAdornment position="end">
                                {<CircularProgress size={20} />}
                            </InputAdornment>
                        )
                    }}
                >
                    {enumerables.naturalezas.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
                Sector
                <div>
                    <label className={classes.labelRadio}>
                        Pesca
                        <Radio
                            checked={form.sector === 'PESCA'}
                            onChange={onInputChange}
                            value="PESCA"
                            name="sector"
                            color="primary"
                            aria-label="PESCA"
                            disabled={loading || readonly}
                        />
                    </label>
                    {'  '}
                    <label className={classes.labelRadio}>
                        Industria
                        <Radio
                            checked={form.sector === 'INDUSTRIA'}
                            onChange={onInputChange}
                            value="INDUSTRIA"
                            name="sector"
                            color="primary"
                            aria-label="INDUSTRIA"
                            disabled={loading || readonly}
                        />
                    </label>
                    {'  '}
                    <label className={classes.labelRadio}>
                        Otro
                        <Radio
                            checked={form.sector === 'OTRO'}
                            onChange={onInputChange}
                            value="OTRO"
                            name="sector"
                            color="primary"
                            aria-label="OTRO"
                            disabled={loading || readonly}
                        />
                    </label>
                </div>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                <TextField
                    select
                    label="OPD"
                    className={classes.textField}
                    name="id_opd"
                    value={form.id_opd}
                    onChange={onInputChange}
                    disabled={loading || readonly}
                >
                    {enumerables.opd.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                <TextField
                    select
                    label="Condición Procesal del estado"
                    className={classes.textField}
                    name="id_tipo_responsabilidad"
                    value={form.id_tipo_responsabilidad}
                    onChange={onInputChange}
                    disabled={loading || readonly}
                >
                    {enumerables.tiposReponsabilidad.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} style={{ paddinTop: 0, marginTop: -25 }}>
                <PersonasRegistradas
                    disabled={readonly}
                    errors={errors}
                    personas={form.personas}
                    onDeletePersona={onDeletePersona}
                    onClickBuscarPersona={onClickBuscarPersona}
                />
            </Grid>
        </Grid>

        <Grid container spacing={24}>
            <Grid item xs={12} sm={4} md={4}>
                {readonly ? (
                    <Typography variant="subheading">Resoluciones</Typography>
                ) : (
                    <Autocomplete
                        disabled={loading}
                        placeholder="Buscar Resolución"
                        clearOnSelect
                        labelProp="nro_resol"
                        onSelect={onSelectResolucion}
                        url="/api/sitradoc/resoluciones"
                        suggestionsProp="data.resoluciones"
                    />
                )}
                <ChipsResoluciones
                    resoluciones={form.resoluciones}
                    disabled={readonly}
                    onDeleteResolucion={onDeleteResolucion}
                />
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                {readonly ? (
                    <Typography variant="subheading">Embarcaciones</Typography>
                ) : (
                    <Autocomplete
                        disabled={loading}
                        placeholder="Buscar Embarcación"
                        clearOnSelect
                        complexLabel={data => `${data.nombre_emb} - ${data.matricula_emb}`}
                        onSelect={onSelectEmbarcacion}
                        url="/api/general/buscarembarcacion"
                        suggestionsProp="data.embarcaciones"
                    />
                )}
                <ChipsEmbarcaciones
                    disabled={readonly}
                    embarcaciones={form.embarcaciones}
                    onDeleteEmbarcacion={onDeleteEmbarcacion}
                />
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                {readonly ? (
                    <Typography variant="subheading">Plantas</Typography>
                ) : (
                    <Autocomplete
                        disabled={loading}
                        placeholder="Buscar Planta"
                        clearOnSelect
                        labelProp="nombre"
                        onSelect={onSelectPlanta}
                        url="/api/general/buscarplanta"
                        suggestionsProp="data.plantas"
                    />
                )}
                <ChipsPlantas
                    disabled={readonly}
                    plantas={form.plantas}
                    onDeletePlanta={onDeletePlanta}
                />
            </Grid>
        </Grid>

        <Divider className={classes.divider} />
        <Grid container spacing={24}>
            <Grid item xs={12} sm={4} md={4}>
                <TextField
                    error={errors.id_abogado != null}
                    helperText={errors.id_abogado}
                    select
                    label="Abogado"
                    className={classes.textField}
                    name="id_abogado"
                    value={form.id_abogado}
                    onChange={onInputChange}
                    disabled={loading || readonly}
                >
                    {enumerables.abogados.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                <TextField
                    select
                    label="Etapa Procesal"
                    className={classes.textField}
                    name="id_etapa_procesal"
                    value={form.id_etapa_procesal}
                    onChange={onInputChange}
                    disabled={loading || readonly}
                >
                    {enumerables.etapasProcesales.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
                <DatePicker
                    format={dateFormat}
                    autoOk
                    margin="dense"
                    className={classnames(classes.textField, classes.datePicker)}
                    clearable
                    label="Fecha"
                    value={form.fechaVencimiento}
                    onChange={onDateChange('fechaVencimiento')}
                    animateYearScrolling={false}
                    disabled={loading || readonly}
                    fullWidth
                    cancelLabel="Cancelar"
                    invalidLabel=""
                />
            </Grid>
        </Grid>

        {form.estado_proceso === 1 && (
            <Grid container spacing={24}>
                <Grid item xs={12} sm={4} md={4}>
                    <TextField
                        label="Estado"
                        className={classes.textField}
                        value="Finalizado"
                        disabled
                    />
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                    <TextField
                        label="Tipo de Finalización"
                        className={classes.textField}
                        value={form.tipo_finalizacion_descripcion}
                        disabled
                    />
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                    <TextField
                        label="Resolución de Finalización"
                        className={classes.textField}
                        value={form.resolucion_finalizacion}
                        disabled
                    />
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                    <TextField
                        label="Fecha de Finalización"
                        className={classes.textField}
                        value={form.fecha_finalizacion}
                        disabled
                    />
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                    <TextField
                        select
                        label="Tipo de Monto"
                        className={classes.textField}
                        value={form.id_tipo_monto}
                        disabled
                    >
                        {enumerables.tiposMonto.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                    <TextField
                        label="Monto de Finalización"
                        className={classes.textField}
                        value={form.monto_finalizacion}
                        disabled
                    />
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                    <TextField
                        label="Estado Archivamiento"
                        className={classes.textField}
                        value={form.estado_archivamiento_descripcion}
                        disabled
                    />
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                    <TextField
                        label="Motivo Finalización"
                        className={classes.textField}
                        value={form.motivo_finalizacion}
                        disabled
                    />
                </Grid>
            </Grid>
        )}

        <Divider className={classes.divider} />
        {type === ENUM_FORM_TYPE.CREATE && (
            <RegistroInstancia
                errors={errors}
                toast={toast}
                loading={loading}
                loadingInstancia={loadingInstancia}
                loadingPlazo={loadingPlazo}
                listaInstancias={enumerables.instancias}
                listaPlazos={enumerables.plazos}
                instancia={form._instancia}
                onDateInstanciaChange={onDateInstanciaChange}
                onInputInstanciaChange={onInputInstanciaChange}
                onAddDocumentoSimpleInstancia={onAddDocumentoSimpleInstancia}
                onRemoveDocumentoSimpleInstancia={onRemoveDocumentoSimpleInstancia}
            />
        )}

        {type !== ENUM_FORM_TYPE.CREATE && (
            <AdministraInstancias
                readonly={readonly}
                toast={toast}
                idProceso={form.id}
                instancias={form.proceso_instancia}
                listaAbogados={enumerables.abogados}
                idTipoProceso={form.id_tipo_proceso}
                onAddInstancia={onAddInstancia}
                onUpdateInstancia={onUpdateInstancia}
                onAddPlazo={onAddPlazo}
                onRemovePlazo={onRemovePlazo}
                onAddDocumentoInstancia={onAddDocumentoInstancia}
                onRemoveDocumentoInstancia={onRemoveDocumentoInstancia}
                onCloseFormInstancia={onCloseFormInstancia}
                onFinalizaInstancia={onFinalizaInstancia}
            />
        )}

        {type !== ENUM_FORM_TYPE.CREATE && (
            <VerInformacionHistorica
                open={openInformacionHistorica}
                proceso={form}
                onClose={onCloseInformacionHistorica}
            />
        )}
    </div>
);

FormularioProceso.defaultProps = {
    loadingTipoProceso: false,
    loadingNaturaleza: false,
    readonly: false
};

FormularioProceso.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.number.isRequired,
    toast: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    readonly: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    loadingTipoProceso: PropTypes.bool,
    loadingNaturaleza: PropTypes.bool,
    loadingInstancia: PropTypes.bool,
    loadingPlazo: PropTypes.bool,
    onInputChange: PropTypes.func.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    enumerables: PropTypes.object.isRequired,
    onClickBuscarPersona: PropTypes.func.isRequired,
    onDeletePersona: PropTypes.func.isRequired,
    onSelectResolucion: PropTypes.func.isRequired,
    onDeleteResolucion: PropTypes.func.isRequired,
    onSelectEmbarcacion: PropTypes.func.isRequired,
    onDeleteEmbarcacion: PropTypes.func.isRequired,
    onSelectPlanta: PropTypes.func.isRequired,
    onDeletePlanta: PropTypes.func.isRequired,
    onInputInstanciaChange: PropTypes.func.isRequired,
    onDateInstanciaChange: PropTypes.func.isRequired,
    onAddDocumentoSimpleInstancia: PropTypes.func.isRequired,
    onRemoveDocumentoSimpleInstancia: PropTypes.func.isRequired,
    onAddInstancia: PropTypes.func.isRequired,
    onAddPlazo: PropTypes.func.isRequired,
    onAddDocumentoInstancia: PropTypes.func.isRequired,
    onRemoveDocumentoInstancia: PropTypes.func.isRequired,
    onFinalizaInstancia: PropTypes.func.isRequired
};

export default withStyles(styles)(FormularioProceso);
