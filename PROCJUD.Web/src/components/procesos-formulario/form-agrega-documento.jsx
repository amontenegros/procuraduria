import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { dateFormat, ConvertJsonToMoment } from '../../constants/date';
import { DatePicker } from 'material-ui-pickers';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import FileUpload from '../_common/file-upload';
import BoxSearchRegistroSitradoc from '../_common/box-search-registro-sitradoc';

const styles = theme => ({
    textField: {
        width: '100%'
    }
});

const INITIAL_FORM = {
    numero_documento: '',
    fecha_documento: null,
    archivo: '',
    numero_documento_sitradoc: '',
    fecha_documento_sitradoc: ''
};

const INITIAL_ERRORS = {
    numero_documento: null,
    fecha_documento: null
};

const INITIAL_STATE = {
    loading: false,
    buscarEnSitradoc: true,
    form: { ...INITIAL_FORM },
    openBoxDocumentos: false,
    errors: { ...INITIAL_ERRORS }
};

class FormAgregaDocumento extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    handleSubmit = () => {
        const valid = this.validarFormulario();

        if (valid) {
            this.setState({ loading: true });
            this.props.onAddDocumento(this.state.form);
            this.props.onClose();
        }
    };

    handleCheckBoxChange = e => {
        this.setState({ buscarEnSitradoc: e.target.checked, form: { ...INITIAL_FORM } });
    };

    handleDateChange = date => {
        //if (this.state.buscarEnSitradoc) return false;
        const { form } = this.state;
        this.setState({ form: { ...form, fecha_documento: date } });
    };

    handleInputChange = e => {
        //if (this.state.buscarEnSitradoc) return false;
        const { form } = this.state;
        this.setState({ form: { ...form, [e.target.name]: e.target.value } });
    };

    handleOpen = () => {
        this.setState({ ...INITIAL_STATE });
    };

    handleUploadFile = resp => {
        const { form } = this.state;
        this.setState({ form: { ...form, archivo: resp.data.filename } });
    };

    handleSelectDocumento = documento => {
        const { form } = this.state;
        this.setState({
            form: {
                ...form,
                numero_documento_sitradoc: documento.num_tram_documentario,
                fecha_documento_sitradoc: ConvertJsonToMoment(documento.auditmod).format(
                    dateFormat
                ),
                id_documento: documento.id_documento
            }
        });
    };

    handleClickOpenBoxDocumentos = e => {
        this.setState({ openBoxDocumentos: true });
    };

    handleCloseBoxDocumentos = e => {
        this.setState({ openBoxDocumentos: false });
    };

    validarFormulario = () => {
        const { form } = this.state;
        let errors = { ...INITIAL_ERRORS };
        let valid = true;

        if (!form.numero_documento) {
            errors.numero_documento = 'Ingrese documento';
            valid = false;
        }

        if (!form.fecha_documento) {
            errors.fecha_documento = 'Ingrese fecha';
            valid = false;
        }

        if (!valid) {
            this.setState({ errors: errors });
        }

        return valid;
    };

    render() {
        const { classes, open, onClose } = this.props;
        const { loading, buscarEnSitradoc, form, openBoxDocumentos, errors } = this.state;

        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={open}
                onEnter={this.handleOpen}
                onClose={onClose}
                //onExited={this.handleExited}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Agregar Documentoo</DialogTitle>

                <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
                    <DialogContent>
                        <Grid container spacing={16}>
                            {/* <Grid item xs={12}>
                                <label>
                                    Buscar en sitradoc
                                    <Checkbox
                                        color="primary"
                                        checked={buscarEnSitradoc}
                                        onChange={this.handleCheckBoxChange}
                                        value="buscar"
                                    />
                                </label>
                            </Grid> */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Documento sitradoc"
                                    name="numero_documento_sitradoc"
                                    value={form.numero_documento_sitradoc}
                                    className={classes.textField}
                                    onChange={this.handleInputChange}
                                    disabled
                                    InputProps={{
                                        endAdornment: buscarEnSitradoc && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    title="Buscar documento"
                                                    aria-label="Search registro"
                                                    disabled={loading}
                                                    onClick={this.handleClickOpenBoxDocumentos}
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            {form.fecha_documento_sitradoc && (
                                <Grid item xs={12}>
                                    <TextField
                                        label="Fecha Doc. sitradoc"
                                        name="fecha_documento_sitradoc"
                                        value={form.fecha_documento_sitradoc}
                                        className={classes.textField}
                                        onChange={this.handleInputChange}
                                        disabled
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <TextField
                                    error={errors.numero_documento != null}
                                    helperText={errors.numero_documento}
                                    label="N° Documento"
                                    name="numero_documento"
                                    value={form.numero_documento}
                                    className={classes.textField}
                                    onChange={this.handleInputChange}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DatePicker
                                    error={errors.fecha_documento != null}
                                    helperText={errors.fecha_documento}
                                    format={dateFormat}
                                    autoOk
                                    margin="dense"
                                    className={classnames(classes.textField, classes.datePicker)}
                                    clearable
                                    label="Fecha"
                                    value={form.fecha_documento}
                                    onChange={this.handleDateChange}
                                    animateYearScrolling={false}
                                    fullWidth
                                    disabled={loading}
                                    cancelLabel="Cancelar"
                                    disableFuture
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Archivo"
                                    name="archivo"
                                    value={form.archivo}
                                    className={classes.textField}
                                    disabled={loading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <FileUpload
                                                    lite
                                                    route="/api/file/upload"
                                                    onSuccess={this.handleUploadFile}
                                                />
                                            </InputAdornment>
                                        )
                                    }}
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

                <BoxSearchRegistroSitradoc
                    open={openBoxDocumentos}
                    onClose={this.handleCloseBoxDocumentos}
                    onSelect={this.handleSelectDocumento}
                />
            </Dialog>
        );
    }
}

FormAgregaDocumento.propTypes = {
    onAddDocumento: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    toast: PropTypes.object
};

export default withStyles(styles)(FormAgregaDocumento);
