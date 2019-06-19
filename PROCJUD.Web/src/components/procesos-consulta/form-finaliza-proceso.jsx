import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { dateFormat, ConvertJsonToMoment } from '../../constants/date';
import { DatePicker } from 'material-ui-pickers';
import Confirm from '../_common/confirm';

const styles = theme => ({
    labelRadio: {
        fontSize: theme.typography.fontSize - 1
    },
    textField: {
        width: '100%'
    }
});

const INITIAL_STATE = {
    loading: false,
    errors: {},
    form: {
        tipo_finalizacion: '1',
        estado_archivamiento: '1',
        cantidad: '',
        fecha_finalizacion: null,
        motivo: '',
        resolucion: '',
        id_tipo_monto: ''
    }
};

class FormFinalizaProceso extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    handleSubmit = e => {
        e.preventDefault();
        if (this.validate()) {
            Confirm('Se va finalizar el proceso. ¿Desea continuar?').then(ok => {
                if (ok) {
                    this.props.onConfirm(this.props.idProceso, this.state.form);
                    this.props.onClose();
                }
            });
        }
    };

    onInputChange = e => {
        const { form } = this.state;
        const target = e.target;
        this.setState({ form: { ...form, [target.name]: target.value } });
    };

    handleDateChange = name => date => {
        const { form } = this.state;
        this.setState({ form: { ...form, [name]: date } });
    };

    handleOpen = () => {
        this.setState({ ...INITIAL_STATE });
    };

    validate = () => {
        const { form } = this.state;
        let errors = {};
        let valid = true;

        if (!form.resolucion) {
            errors.resolucion = 'Ingrese la resolución';
            valid = false;
        }

        if (!form.fecha_finalizacion) {
            errors.fecha_finalizacion = 'Seleccione fecha';
            valid = false;
        }

        if (!form.motivo) {
            errors.motivo = 'Ingrese el motivo';
            valid = false;
        }

        if (!form.id_tipo_monto) {
            errors.id_tipo_monto = 'Seleccione el tipo de monto';
            valid = false;
        }

        if (!form.cantidad) {
            errors.cantidad = 'Ingrese el monto';
            valid = false;
        }

        if (!valid) {
            this.setState({ errors: errors });
        }

        return valid;
    };

    render() {
        const { loading, form, errors } = this.state;
        const { classes, onClose, open, tiposMonto } = this.props;

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
                <DialogTitle>Finalizar Proceso</DialogTitle>

                <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
                    <DialogContent>
                        <Grid container spacing={8}>
                            <Grid item xs={12}>
                                <Typography variant="subheading">Veredicto</Typography>
                                <div>
                                    <label className={classes.labelRadio}>
                                        Definitivo
                                        <Radio
                                            checked={form.tipo_finalizacion === '1'}
                                            onChange={this.onInputChange}
                                            value="1"
                                            name="tipo_finalizacion"
                                            color="primary"
                                            aria-label="tipo finalizacion"
                                            disabled={loading}
                                        />
                                    </label>
                                    {'  '}
                                    <label className={classes.labelRadio}>
                                        Provisional
                                        <Radio
                                            checked={form.tipo_finalizacion === '2'}
                                            onChange={this.onInputChange}
                                            value="2"
                                            name="tipo_finalizacion"
                                            color="primary"
                                            aria-label="tipo finalizacion"
                                            disabled={loading}
                                        />
                                    </label>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    error={errors.resolucion != null}
                                    helperText={errors.resolucion}
                                    label="Resolución"
                                    name="resolucion"
                                    type="text"
                                    value={form.resolucion}
                                    className={classes.textField}
                                    onChange={this.onInputChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DatePicker
                                    error={errors.fecha_finalizacion != null}
                                    helperText={errors.fecha_finalizacion}
                                    format={dateFormat}
                                    autoOk
                                    margin="dense"
                                    className={classes.textField}
                                    clearable
                                    label="Fecha"
                                    value={form.fecha_finalizacion}
                                    onChange={this.handleDateChange('fecha_finalizacion')}
                                    animateYearScrolling={false}
                                    fullWidth
                                    disabled={loading}
                                    cancelLabel="Cancelar"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    error={errors.motivo != null}
                                    helperText={errors.motivo}
                                    label="Motivo"
                                    multiline
                                    rows={3}
                                    name="motivo"
                                    value={form.motivo}
                                    className={classes.textField}
                                    onChange={this.onInputChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subheading">
                                    Estado de archivamiento
                                </Typography>
                                <div>
                                    <label className={classes.labelRadio}>
                                        A favor
                                        <Radio
                                            checked={form.estado_archivamiento === '1'}
                                            onChange={this.onInputChange}
                                            value="1"
                                            name="estado_archivamiento"
                                            color="primary"
                                            disabled={loading}
                                        />
                                    </label>
                                    {'  '}
                                    <label className={classes.labelRadio}>
                                        En contra
                                        <Radio
                                            checked={form.estado_archivamiento === '2'}
                                            onChange={this.onInputChange}
                                            value="2"
                                            name="estado_archivamiento"
                                            color="primary"
                                            disabled={loading}
                                        />
                                    </label>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    error={errors.id_tipo_monto != null}
                                    helperText={errors.id_tipo_monto}
                                    select
                                    label="Tipo monto *"
                                    className={classes.textField}
                                    name="id_tipo_monto"
                                    onChange={this.onInputChange}
                                    value={form.id_tipo_monto}
                                    disabled={loading}
                                >
                                    {tiposMonto.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    error={errors.cantidad != null}
                                    helperText={errors.cantidad}
                                    label="Monto"
                                    name="cantidad"
                                    type="number"
                                    value={form.cantidad}
                                    className={classes.textField}
                                    onChange={this.onInputChange}
                                    disabled={loading}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="primary" disabled={loading}>
                            Finalizar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

export default withStyles(styles)(FormFinalizaProceso);
