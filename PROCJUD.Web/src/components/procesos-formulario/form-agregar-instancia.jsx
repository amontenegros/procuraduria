import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from 'material-ui-pickers';
import { dateFormat } from '../../constants/date';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { FetchPlazos } from '../../api/enumerables';
import update from 'immutability-helper';

const styles = theme => ({
    textField: {
        width: '100%',
        margin: 0
    },
    loaderContainer: {
        height: 5
    }
});

const INITIAL_ERRORS = {
    id_tipo_instancia: null,
    numero_instancia: null,
    nombre_instancia: null,
    fecha_inicio: null,
    cantidad_inicial: null,
    id_plazo: null,
    fecha_notificacion: null,
    id_monto: null
};

const INITIAL_STATE = {
    _plazos: [],
    loading: false,
    loadingPlazo: false,
    form: {
        id_tipo_instancia: '',
        numero_instancia: '',
        nombre_instancia: '',
        fecha_inicio: null,
        cantidad_inicial: 0,
        id_plazo: '',
        fecha_notificacion: null,
        id_monto: ''
    },
    errors: { ...INITIAL_ERRORS }
};

class FormAgregaInstancia extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true, errors: { ...INITIAL_ERRORS } });
        this.props
            .onAddInstancia(this.state.form)
            .then(() => {
                this.props.onClose();
            })
            .catch(err => {
                if (err.status === 406) this.setState({ errors: err.data.errors });
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    onDateChange = name => date => {
        const { form } = this.state;
        this.setState({ form: { ...form, [name]: date } });
    };

    onInputChange = e => {
        const target = e.target;
        const { form } = this.state;
        this.setState({
            form: update(form, {
                id_plazo: { $apply: x => (target.name === 'id_tipo_instancia' ? '' : x) },
                [target.name]: { $set: target.value }
            })
        });
        if (target.name === 'id_tipo_instancia') {
            this.loadPlazos(target.value);
        }
    };

    handleOpen = () => {
        this.setState({ ...INITIAL_STATE });
    };

    loadPlazos(id_instancia) {
        this.setState({ loadingPlazo: true });
        FetchPlazos(id_instancia)
            .then(plazos => {
                this.setState({ _plazos: plazos, loadingPlazo: false });
            })
            .catch(err => {
                this.setState({ loadingPlazo: false });
                console.log(err);
            });
    }

    validarForm() {
        const { form } = this.state;
        let errors = { ...INITIAL_ERRORS };
        let valid = true;

        if (!form.id_tipo_instancia) {
            errors.id_tipo_instancia = 'Seleccione tipo instancia';
            valid = false;
        }

        if (!form.nombre_documento) {
            errors.fecha_documento = 'Ingrese fecha';
            valid = false;
        }

        if (!valid) {
            this.setState({ errors: errors });
        }

        return valid;
    }

    render() {
        const { loading, errors, form, _plazos, loadingPlazo } = this.state;
        const { classes, onClose, open, instancias, tiposMonto, saveInstancia } = this.props;

        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={open}
                onEnter={this.handleOpen}
                onClose={onClose}
                aria-labelledby="form-dialog-title"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Agregar Instancia</DialogTitle>
                <div className={classes.loaderContainer}>{loading && <LinearProgress />}</div>
                <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
                    <DialogContent>
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <TextField
                                    error={errors.id_tipo_instancia != null}
                                    helperText={errors.id_tipo_instancia}
                                    select
                                    label="Instancia *"
                                    className={classes.textField}
                                    name="id_tipo_instancia"
                                    onChange={this.onInputChange}
                                    value={form.id_tipo_instancia}
                                    disabled={loading}
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
                                    value={form.nombre_instancia}
                                    disabled={loading}
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
                                    value={form.numero_instancia}
                                    disabled={loading}
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
                                    value={form.fecha_inicio}
                                    onChange={this.onDateChange('fecha_inicio')}
                                    animateYearScrolling={false}
                                    disabled={loading}
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
                                    value={form.id_monto}
                                    disabled={loading}
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
                                    value={form.cantidad_inicial}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={8}>
                                <TextField
                                    error={errors.id_plazo != null}
                                    helperText={errors.id_plazo}
                                    select
                                    label="Plazo *"
                                    className={classes.textField}
                                    name="id_plazo"
                                    onChange={this.onInputChange}
                                    value={form.id_plazo}
                                    disabled={loading}
                                    InputProps={{
                                        endAdornment: loadingPlazo && (
                                            <InputAdornment position="end">
                                                {<CircularProgress size={20} />}
                                            </InputAdornment>
                                        )
                                    }}
                                >
                                    {_plazos.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={4}>
                                <DatePicker
                                    error={errors.fecha_notificacion != null}
                                    helperText={errors.fecha_notificacion}
                                    format={dateFormat}
                                    autoOk
                                    margin="dense"
                                    className={classes.textField}
                                    clearable
                                    label="Fecha Notificación*"
                                    value={form.fecha_notificacion}
                                    onChange={this.onDateChange('fecha_notificacion')}
                                    animateYearScrolling={false}
                                    disabled={loading}
                                    fullWidth
                                    cancelLabel="Cancelar"
                                    disableFuture
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="primary" disabled={loading}>
                            Agregar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

export default withStyles(styles)(FormAgregaInstancia);
