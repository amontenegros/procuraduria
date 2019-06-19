import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { dateFormat, ConvertJsonToMoment } from '../../constants/date';
import { DatePicker } from 'material-ui-pickers';
import { ENUM_FORM_TYPE } from '../../constants/enums';
import update from 'immutability-helper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    textField: {
        width: '100%',
        margin: 0
    },
    loaderContainer: {
        height: 5
    },
    typography: {}
});

const INITIAL_ERRORS = {};

const INITIAL_STATE = {
    _type: ENUM_FORM_TYPE.CREATE,
    loading: false,
    errors: { ...INITIAL_ERRORS },
    form: { id_plazo: '', fecha_inicio: null }
};

class FormAgregaPlazo extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onInputChange = e => {
        const { form } = this.state;
        const target = e.target;
        this.setState({ form: { ...form, [target.name]: target.value } });
    };

    onDateChange = name => date => {
        const { form } = this.state;
        this.setState({ form: { ...form, [name]: date } });
    };

    handleSubmit = e => {
        e.preventDefault();

        const valid = this.validarFormulario();

        if (valid) {
            this.setState({ loading: true });
            if (this.state._type === ENUM_FORM_TYPE.CREATE) {
                this.props.onAddPlazo(this.state.form);
            } else {
                this.props.onUpdatePlazo(this.state.form);
            }
            this.props.onClose();
        }
    };

    handleOpen = () => {
        this.setState({ ...INITIAL_STATE });
        if (this.props.model) {
            const new_form = update(this.props.model, {
                fecha_inicio: { $apply: el => ConvertJsonToMoment(el) }
            });
            this.setState({ _type: ENUM_FORM_TYPE.UPDATE, form: new_form });
        }
    };

    validarFormulario = () => {
        const { form, _type } = this.state;
        let errors = { ...INITIAL_ERRORS };
        let valid = true;

        if (!form.id_plazo) {
            errors.id_plazo = 'Seleccione plazo';
            valid = false;
        }

        if (!form.fecha_inicio) {
            errors.fecha_inicio = 'Seleccione fecha';
            valid = false;
        }

        if (_type === ENUM_FORM_TYPE.UPDATE) {
            if (!form.id_abogado) {
                errors.id_abogado = 'Seleccione abogado';
                valid = false;
            }
        }

        if (!valid) {
            this.setState({ errors: errors });
        }

        return valid;
    };

    render() {
        const { classes, open, onClose, listaPlazos, abogados } = this.props;
        const { loading, errors, form, _type } = this.state;
        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={open}
                onEnter={this.handleOpen}
                onClose={onClose}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    {_type === ENUM_FORM_TYPE.CREATE ? 'Nuevo' : 'Editar'} Plazo
                </DialogTitle>
                <div className={classes.loaderContainer}>{loading && <LinearProgress />}</div>
                <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
                    <DialogContent>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
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
                                >
                                    {listaPlazos.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    error={errors.fecha_inicio != null}
                                    helperText={errors.fecha_inicio}
                                    format={dateFormat}
                                    autoOk
                                    margin="dense"
                                    className={classes.textField}
                                    clearable
                                    label="Fecha Notificación*"
                                    value={form.fecha_inicio}
                                    onChange={this.onDateChange('fecha_inicio')}
                                    animateYearScrolling={false}
                                    disabled={loading}
                                    fullWidth
                                    cancelLabel="Cancelar"
                                    disableFuture
                                />
                            </Grid>
                        </Grid>

                        {_type == ENUM_FORM_TYPE.UPDATE && (
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <TextField
                                        error={errors.id_abogado != null}
                                        helperText={errors.id_abogado}
                                        select
                                        label="Abogado"
                                        className={classes.textField}
                                        name="id_abogado"
                                        value={form.id_abogado}
                                        onChange={this.onInputChange}
                                        disabled={loading}
                                    >
                                        {abogados.map(option => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography className={classes.typography} variant="subheading">
                                        Finalización
                                    </Typography>
                                    <DatePicker
                                        error={errors.fecha_final != null}
                                        helperText={errors.fecha_final}
                                        format={dateFormat}
                                        autoOk
                                        margin="dense"
                                        className={classes.textField}
                                        clearable
                                        label="Fecha Final"
                                        value={form.fecha_final}
                                        onChange={this.onDateChange('fecha_final')}
                                        animateYearScrolling={false}
                                        disabled={loading}
                                        fullWidth
                                        cancelLabel="Cancelar"
                                        invalidLabel=""
                                        disableFuture
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        error={errors.anotacion != null}
                                        helperText={errors.anotacion}
                                        label="Anotación"
                                        className={classes.textField}
                                        name="anotacion"
                                        value={form.anotacion}
                                        onChange={this.onInputChange}
                                        disabled={loading}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="primary" disabled={loading}>
                            {_type === ENUM_FORM_TYPE.CREATE ? 'Agregar' : 'Actualizar'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

export default withStyles(styles)(FormAgregaPlazo);
