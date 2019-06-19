import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { SearchDni } from '../../api/reniec';
import { SearchRuc } from '../../api/sunat';
import { SearchPersonas } from '../../api/general';
import Toast from '../_common/toast';

const styles = theme => ({
    flex: {
        flexGrow: 1
    },
    searchButton: {
        color: '#d5d5d5'
    },
    content: {
        [theme.breakpoints.up('sm')]: {
            minWidth: 550
        }
    }
});

const listItemStyles = { listItem: { width: 180, marginLeft: 25, float: 'right', marginTop: -5 } };

class ListItemPersonaDefault extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            condicion: {
                id_condicion: 0,
                descripcion: ''
            }
        };
    }

    handleChangeCondicion = e => {
        const value = e.target.value;
        if (value == 0) {
            this.setState({ condicion: { id_condicion: 0, descripcion: '' } });
            return false;
        }

        const condicion_selec = this.props.condiciones.filter(item => item.id === value)[0];

        const condicion = {
            id_condicion: value,
            descripcion: condicion_selec.label
        };

        this.setState({ condicion: condicion });
    };

    handleSelect = e => {
        if (this.state.condicion.id_condicion == 0)
            this.props.openToast(
                'Debe seleccionar la condición antes de elegir una persona',
                'warning'
            );
        else this.props.onSelect(this.props.persona, this.state.condicion)(e);
    };

    render() {
        const { persona, condiciones, classes } = this.props;
        const { condicion } = this.state;
        return (
            <ListItem button>
                <ListItemText
                    primary={
                        <div>
                            {persona.nombre}
                            <TextField
                                select
                                onChange={this.handleChangeCondicion}
                                value={condicion.id_condicion}
                                className={classes.listItem}
                            >
                                <MenuItem value={0}>Seleccione</MenuItem>
                                {condiciones.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    }
                />
                <ListItemSecondaryAction>
                    <IconButton aria-label="Delete" onClick={this.handleSelect} title="Elegir">
                        <ArrowForwardIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

const ListItemPersona = withStyles(listItemStyles)(ListItemPersonaDefault);

const INITIAL_STATE = {
    personas: [],
    buscarPorRuc: true,
    input_razon_social: '',
    input_ruc_dni: '',
    loading: false,
    toast: {
        open: false,
        variant: 'success',
        message: ''
    }
};

class BoxBuscaPersona extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    handleSubmitRazonSocial = e => {
        e.preventDefault();
        if (this.state.input_razon_social.length < 5) {
            this.openToast(`Debe ingresar al menos 5 caracteres para poder buscar`, 'warning');
            return false;
        }
        this.buscarPersona();
    };

    handleSubmitRucDni = e => {
        e.preventDefault();
        const countDigits = this.state.buscarPorRuc ? 11 : 8;
        if (this.state.input_ruc_dni.length != countDigits) {
            this.openToast(`Debe ingresar ${countDigits} dígitos para poder buscar`, 'warning');
            return false;
        }
        if (this.state.buscarPorRuc) this.buscarRuc();
        else this.buscarDni();
    };

    buscarDni = () => {
        this.setState({ loading: true });
        SearchDni(this.state.input_ruc_dni)
            .then(persona => {
                if (!persona.apellidos) throw 'No hay persona';
                this.setState({ loading: false });
                const result = {
                    id_persona: persona.id_persona,
                    nombre: `${persona.nombres} ${persona.apellidos}`,
                    nro_documento: persona.dni
                };
                this.setState({ personas: [result] });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
                this.openToast('No se encontró el DNI', 'error');
            });
    };

    buscarRuc = () => {
        this.setState({ loading: true });
        SearchRuc(this.state.input_ruc_dni)
            .then(persona => {
                this.setState({ loading: false });
                const result = {
                    id_persona: persona.id_persona,
                    nombre: persona.razon_social,
                    nro_documento: persona.ruc
                };
                this.setState({ personas: [result] });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
                this.openToast('No se encontró el RUC', 'error');
            });
    };

    buscarPersona = () => {
        this.setState({ loading: true });
        SearchPersonas(this.state.input_razon_social)
            .then(personas => {
                this.setState({ loading: false });
                this.setState({
                    personas: personas.map(item => ({
                        id_persona: item.id,
                        nombre: item.nombre,
                        nro_documento: item.nro_docpernatural
                            ? item.nro_docpernatural
                            : item.nro_documento
                    }))
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
            });
    };

    handleChangeSwitchRuc = e => {
        this.setState({ buscarPorRuc: e.target.checked, input_ruc_dni: '' });
    };

    handleChangeInputRucDni = e => {
        this.setState({ input_ruc_dni: e.target.value });
    };

    handleKeyPressInputRucDni = e => {
        const keyCode = e.keyCode || e.which;
        if (keyCode == 13) return true;
        const keyValue = String.fromCharCode(keyCode);
        if (!/^\d+$/.test(keyValue)) {
            e.preventDefault();
        }
    };

    handleChangeInputRazonSocial = e => {
        this.setState({ input_razon_social: e.target.value });
    };

    handleOpen = () => {
        this.setState({ ...INITIAL_STATE });
    };

    handleSelect = (persona, condicion) => e => {
        this.props.onSelectPersona(persona, condicion);
        this.props.onClose();
    };

    openToast = (msg, variant) => {
        this.setState({ toast: { open: true, message: msg, variant: variant } });
    };

    closeToast = () => {
        const { toast } = this.state;
        this.setState({ toast: { ...toast, open: false } });
    };

    render() {
        const { classes, open, listaCondiciones } = this.props;
        const {
            loading,
            buscarPorRuc,
            input_razon_social,
            input_ruc_dni,
            toast,
            personas
        } = this.state;

        const lista_personas = personas.map((item, i) => (
            <ListItemPersona
                persona={item}
                key={i}
                onSelect={this.handleSelect}
                condiciones={listaCondiciones}
                openToast={this.openToast}
            />
        ));

        return (
            <Drawer
                anchor="right"
                open={open}
                onClose={this.props.onClose}
                onRendered={this.handleOpen}
                disableBackdropClick
                disableEscapeKeyDown
            >
                <AppBar position="static" color="primary" className={classes.content}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Buscar persona
                        </Typography>
                        <IconButton variant="fab" color="inherit" onClick={this.props.onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <AppBar position="static" color="default" className={classes.content}>
                    <Toolbar>
                        <form onSubmit={this.handleSubmitRazonSocial} className={classes.flex}>
                            <Input
                                autoFocus
                                placeholder="Razón social/Nomb. Ape."
                                classes={{ focused: classes.textFieldFocused }}
                                className={classes.textField}
                                onChange={this.handleChangeInputRazonSocial}
                                disabled={loading}
                                inputProps={{ className: classes.input }}
                                value={input_razon_social}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            type="submit"
                                            className={classes.searchButton}
                                            aria-label="Search numero"
                                            disabled={loading}
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </form>
                    </Toolbar>
                    <Toolbar>
                        <form onSubmit={this.handleSubmitRucDni} className={classes.flex}>
                            <Input
                                placeholder={buscarPorRuc ? 'RUC' : 'DNI'}
                                className={classes.textField}
                                classes={{ focused: classes.textFieldFocused }}
                                onChange={this.handleChangeInputRucDni}
                                disabled={loading}
                                inputProps={{
                                    className: classes.input,
                                    maxLength: buscarPorRuc ? 11 : 8
                                }}
                                value={input_ruc_dni}
                                onKeyPress={this.handleKeyPressInputRucDni}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            type="submit"
                                            className={classes.searchButton}
                                            aria-label="Search numero"
                                            disabled={loading}
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <Switch
                                checked={buscarPorRuc}
                                onChange={this.handleChangeSwitchRuc}
                                value="check"
                                color="primary"
                            />
                        </form>
                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                    <List dense={false} component="nav">
                        {personas.length == 0 && (
                            <ListItem>
                                <ListItemText primary="No hay resultados" />
                            </ListItem>
                        )}
                        {lista_personas}
                    </List>
                </div>
                <Toast
                    open={toast.open}
                    variant={toast.variant}
                    onClose={this.closeToast}
                    message={toast.message}
                />
            </Drawer>
        );
    }
}

export default withStyles(styles)(BoxBuscaPersona);
