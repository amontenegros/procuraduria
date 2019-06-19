import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { dateFormat, ConvertJsonToMoment } from '../../constants/date';
import { DatePicker } from 'material-ui-pickers';
import update from 'immutability-helper';
import {
    GetInstancia,
    SaveDocumento,
    DeleteDocumento,
    SavePlazo,
    UpdatePlazo,
    DeletePlazo
} from '../../api/proceso';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListaDocumentos from './lista-documentos';
import ListaPlazos from './lista-plazos';
import { FetchPlazos } from '../../api/enumerables';

const styles = theme => ({
    textField: {
        width: '100%',
        margin: 0
    },
    loaderContainer: {
        height: 5
    },
    dialogContent: {
        maxHeight: 600,
        marginTop: 25
    }
});

const ProccessResponse = form => {
    form.fecha_inicio = form.fecha_inicio
        ? ConvertJsonToMoment(form.fecha_inicio, dateFormat)
        : null;
    let formString = JSON.stringify(form).replace(/null/g, '""');
    return JSON.parse(formString);
};

const INITIAL_ERRORS = {
    id_tipo_instancia: null,
    numero_instancia: null,
    nombre_instancia: null,
    fecha_inicio: null,
    cantidad_inicial: null
};

const INITIAL_STATE = {
    _plazos: [],
    readonly: false,
    loading: false,
    loadingPlazo: false,
    instancia: {
        id_tipo_instancia: '',
        numero_instancia: '',
        nombre_instancia: '',
        fecha_inicio: null,
        cantidad_inicial: '',
        cantidad_final: '',
        tipo_finalizacion: '',
        fecha_finalizacion: null,
        motivo_finalizacion: '',
        id_monto: '',
        proceso_instancia_documento: [],
        proceso_plazo: []
    },
    tableDefPlazos: {
        columns: [
            { label: 'Plazo', propertyName: '_plazo.nombre_plazo' },
            { label: 'Fecha Notificación', propertyName: 'fecha_inicio', isDate: true },
            { label: 'Abogado', propertyName: '_plazo.nombre_plazo' }
        ]
    },
    errors: { ...INITIAL_ERRORS }
};

class instanciaEditarInstancia extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    save = () => {
        const { idInstancia } = this.props;
        const { instancia } = this.state;
        this.setState({ loading: true, errors: { ...INITIAL_ERRORS } });
        this.props
            .onUpdateInstancia(idInstancia, instancia)
            .then(() => {
                this.setState({ loading: false });
            })
            .catch(err => {
                if (err.status === 406) this.setState({ loading: false, errors: err.data.errors });
            });
    };

    onDateChange = name => date => {
        const { instancia } = this.state;
        this.setState({ instancia: { ...instancia, [name]: date } });
    };

    onInputChange = e => {
        const target = e.target;
        const { instancia } = this.state;
        this.setState({
            instancia: update(instancia, {
                [target.name]: { $set: target.value }
            })
        });
    };

    handleOpen = () => {
        this.setState({ ...INITIAL_STATE, loading: true });
        GetInstancia(this.props.idProceso, this.props.idInstancia)
            .then(resp => {
                this.setState({
                    loading: false,
                    instancia: ProccessResponse(resp.data.instancia),
                    readonly: resp.data.instancia._readonly
                });
                this.loadPlazos(resp.data.instancia.id_tipo_instancia);
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
            });
    };

    loadPlazos = id_tipo_instancia => {
        FetchPlazos(id_tipo_instancia)
            .then(plazos => {
                this.setState({ _plazos: plazos });
            })
            .catch(err => {
                console.log(err);
            });
    };

    saveDocumento = documento => {
        this.setState({ loading: true });
        SaveDocumento(this.props.idProceso, this.props.idInstancia, documento)
            .then(resp => {
                this.setState({ loading: false, instancia: ProccessResponse(resp.data.instancia) });
                this.props.toast.open(resp.msg);
            })
            .catch(err => {
                this.setState({ loading: false });
                this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
            });
    };

    deleteDocumento = documento => {
        const { idProceso, idInstancia } = this.props;
        this.setState({ loading: true });
        DeleteDocumento(idProceso, idInstancia, documento.id_proceso_instancia_documento)
            .then(resp => {
                this.setState({ loading: false, instancia: ProccessResponse(resp.data.instancia) });
                this.props.toast.open(resp.msg);
            })
            .catch(err => {
                this.setState({ loading: false });
                this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
            });
    };

    savePlazo = proceso_plazo => {
        const { idProceso, idInstancia } = this.props;
        this.setState({ loading: true });
        SavePlazo(idProceso, idInstancia, proceso_plazo)
            .then(resp => {
                this.setState({ loading: false, instancia: ProccessResponse(resp.data.instancia) });
                this.props.toast.open(resp.msg);
            })
            .catch(err => {
                this.setState({ loading: false });
                this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
            });
    };

    updatePlazo = proceso_plazo => {
        const { idProceso, idInstancia } = this.props;
        this.setState({ loading: true });
        UpdatePlazo(idProceso, idInstancia, proceso_plazo.id_proceso_plazo, proceso_plazo)
            .then(resp => {
                this.setState({ loading: false, instancia: ProccessResponse(resp.data.instancia) });
                this.props.toast.open(resp.msg);
            })
            .catch(err => {
                this.setState({ loading: false });
                this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
            });
    };

    deletePlazo = proceso_plazo => {
        const { idProceso, idInstancia } = this.props;
        this.setState({ loading: true });
        DeletePlazo(idProceso, idInstancia, proceso_plazo.id_proceso_plazo)
            .then(resp => {
                this.setState({ loading: false, instancia: ProccessResponse(resp.data.instancia) });
                this.props.toast.open(resp.msg);
            })
            .catch(err => {
                this.setState({ loading: false });
                this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
            });
    };

    render() {
        const { loading, errors, instancia, _plazos, readonly } = this.state;
        const { classes, open, onClose, instancias, tiposMonto, toast, abogados } = this.props;

        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={open}
                onEnter={this.handleOpen}
                onClose={onClose}
                aria-labelledby="instancia-dialog-title"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Instancia</DialogTitle>
                <div className={classes.loaderContainer}>{loading && <LinearProgress />}</div>
                <DialogContent>
                    <div className={classes.dialogContent}>
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <TextField
                                    error={errors.id_tipo_instancia != null}
                                    helperText={errors.id_tipo_instancia}
                                    select
                                    label="Instancia *"
                                    className={classes.textField}
                                    name="id_tipo_instancia"
                                    value={instancia.id_tipo_instancia}
                                    disabled
                                >
                                    {instancias.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    error={errors.nombre_instancia != null}
                                    helperText={errors.nombre_instancia}
                                    label="Nombre *"
                                    className={classes.textField}
                                    name="nombre_instancia"
                                    onChange={this.onInputChange}
                                    value={instancia.nombre_instancia}
                                    disabled={loading || readonly}
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    error={errors.numero_instancia != null}
                                    helperText={errors.numero_instancia}
                                    label="Número *"
                                    className={classes.textField}
                                    name="numero_instancia"
                                    onChange={this.onInputChange}
                                    value={instancia.numero_instancia}
                                    disabled={loading || readonly}
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <DatePicker
                                    error={errors.fecha_inicio != null}
                                    helperText={errors.fecha_inicio}
                                    format={dateFormat}
                                    autoOk
                                    margin="dense"
                                    className={classes.textField}
                                    clearable
                                    label="Fecha *"
                                    value={instancia.fecha_inicio}
                                    onChange={this.onDateChange('fecha_inicio')}
                                    animateYearScrolling={false}
                                    disabled={loading || readonly}
                                    fullWidth
                                    cancelLabel="Cancelar"
                                    disableFuture
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    error={errors.id_monto != null}
                                    helperText={errors.id_monto}
                                    select
                                    label="Tipo monto *"
                                    className={classes.textField}
                                    name="id_monto"
                                    onChange={this.onInputChange}
                                    value={instancia.id_monto}
                                    disabled={loading || readonly}
                                >
                                    {tiposMonto.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    type="number"
                                    error={errors.cantidad_inicial != null}
                                    helperText={errors.cantidad_inicial}
                                    label="Cantidad *"
                                    className={classes.textField}
                                    name="cantidad_inicial"
                                    onChange={this.onInputChange}
                                    value={instancia.cantidad_inicial}
                                    disabled={loading || readonly}
                                />
                            </Grid>
                        </Grid>

                        {instancia.estado === '1' && (
                            <Grid container spacing={16}>
                                <Grid item xs={4}>
                                    <TextField
                                        type="text"
                                        label="Estado"
                                        className={classes.textField}
                                        value="Finalizado"
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <TextField
                                        type="text"
                                        label="Cantidad final"
                                        className={classes.textField}
                                        value={instancia.cantidad_final}
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <TextField
                                        type="text"
                                        label="Veredicto"
                                        className={classes.textField}
                                        value={instancia.veredicto}
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <DatePicker
                                        format={dateFormat}
                                        margin="dense"
                                        className={classes.textField}
                                        label="Fecha Finalización"
                                        value={instancia.fecha_finalizacion}
                                        onChange={() => {}}
                                        disabled
                                        disableFuture
                                        maxDateMessage={''}
                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <TextField
                                        type="text"
                                        label="Motivo Finalización"
                                        className={classes.textField}
                                        value={instancia.motivo_finalizacion}
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                        )}
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <ListaPlazos
                                    loading={loading}
                                    abogados={abogados}
                                    listaPlazos={_plazos}
                                    plazos={instancia.proceso_plazo}
                                    onAddPlazo={this.savePlazo}
                                    onUpdatePlazo={this.updatePlazo}
                                    onRemovePlazo={this.deletePlazo}
                                    readonly={readonly}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ListaDocumentos
                                    loading={loading}
                                    onAddDocumento={this.saveDocumento}
                                    onRemoveDocumento={this.deleteDocumento}
                                    documentos={instancia.proceso_instancia_documento}
                                    readonly={readonly}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cerrar
                    </Button>
                    {!instancia._readonly && (
                        <Button
                            type="button"
                            onClick={this.save}
                            color="primary"
                            disabled={loading}
                        >
                            Guardar
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(instanciaEditarInstancia);
