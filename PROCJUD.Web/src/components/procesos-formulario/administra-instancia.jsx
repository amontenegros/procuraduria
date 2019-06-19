import React from 'react';
import PropTypes from 'prop-types';
import ListTable from '../_common/list-table';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import FormAgregaInstancia from './form-agregar-instancia';
import { FetchInstancias, FetchTiposMontos } from '../../api/enumerables';
import axios from 'axios';
import ActionsAdministraInstancia from './actions-administra-instancia';
import FormEditarInstancia from './form-editar-instancia';
import Confirm from '../_common/confirm';
import FormFinalizaInstancia from './form-finaliza-instancia';
import { FinalizaInstancia } from '../../api/proceso';

const styles = theme => ({
    typography: {
        flex: '1'
    },
    toolbar: {
        paddingLeft: 0,
        paddingRight: 0
    }
});

const createTableDef = renderActions => ({
    columns: [
        { label: 'Instancia', propertyName: '_instancia.nombre_tipo_instancia' },
        { label: 'N° Exp. Jud', propertyName: 'numero_instancia' },
        { label: 'Nombre', propertyName: 'nombre_instancia' },
        { label: 'Fecha', propertyName: 'fecha_inicio', isDate: true },
        { label: 'Estado', propertyName: 'estado_descripcion' },
        { label: 'Monto/Texto', propertyName: 'monto_descripcion' },
        { label: 'Finalizado el', propertyName: 'fecha_finalizacion', isDate: true },
        { label: 'Veredicto', propertyName: 'veredicto' },
        {
            label: 'Acción',
            render: renderActions
        }
    ]
});

class AdministraInstancias extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _instancias: [],
            _tiposMonto: [],
            instanciaModel: {},
            tableDef: createTableDef(this.renderActions),
            openFormAddInstancia: false,
            openFormEditInstancia: false,
            openFormFinalizaInstancia: false,
            idInstanciaToUpdate: 0,
            idInstanciaToFinalizar: 0
        };
    }

    HandleOpenFormAddInstancia = bool => e => {
        this.setState({ openFormAddInstancia: bool });
    };

    HandleOpenFormEditInstancia = (bool, id_instancia = 0) => e => {
        if (!bool) this.props.onCloseFormInstancia();
        this.setState({ openFormEditInstancia: bool, idInstanciaToUpdate: id_instancia });
    };

    handleOpenFormFinalizaInstancia = (bool, id_instancia = 0) => e => {
        this.setState({ openFormFinalizaInstancia: bool, idInstanciaToFinalizar: id_instancia });
    };

    renderActions = item => {
        return (
            <ActionsAdministraInstancia
                readonly={this.props.readonly}
                instancia={item}
                onClickDetalle={this.HandleOpenFormEditInstancia(true, item.id_proceso_instancia)}
                onClickFinalizar={this.handleOpenFormFinalizaInstancia(
                    true,
                    item.id_proceso_instancia
                )}
            />
        );
    };

    componentDidMount() {
        axios
            .all([FetchTiposMontos(), FetchInstancias(this.props.idTipoProceso)])
            .then(
                axios.spread((tiposMonto, instancias) => {
                    this.setState({ _instancias: instancias, _tiposMonto: tiposMonto });
                })
            )
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const {
            tableDef,
            openFormAddInstancia,
            openFormEditInstancia,
            openFormFinalizaInstancia,
            _instancias,
            _tiposMonto,
            idInstanciaToUpdate,
            idInstanciaToFinalizar
        } = this.state;
        const {
            readonly,
            idProceso,
            classes,
            instancias,
            onAddInstancia,
            onUpdateInstancia,
            toast,
            listaAbogados,
            onCloseFormInstancia,
            onFinalizaInstancia
        } = this.props;
        return (
            <div>
                <Toolbar className={classes.toolbar}>
                    <Typography color="inherit" variant="subheading" className={classes.typography}>
                        Instancias
                    </Typography>
                    {!readonly && (
                        <div>
                            <Button
                                aria-label="Add"
                                color="primary"
                                onClick={this.HandleOpenFormAddInstancia(true)}
                            >
                                <AddIcon /> Agregar Instancia
                            </Button>
                        </div>
                    )}
                </Toolbar>
                <ListTable
                    items={instancias}
                    tableDef={tableDef}
                    cellProps={{ style: { whiteSpace: 'nowrap', padding: '0px 0px 0px 24px' } }}
                />
                <FormAgregaInstancia
                    onAddInstancia={onAddInstancia}
                    open={openFormAddInstancia}
                    onClose={this.HandleOpenFormAddInstancia(false)}
                    instancias={_instancias}
                    tiposMonto={_tiposMonto}
                />

                <FormEditarInstancia
                    onUpdateInstancia={onUpdateInstancia}
                    toast={toast}
                    idProceso={idProceso}
                    idInstancia={idInstanciaToUpdate}
                    instancias={_instancias}
                    tiposMonto={_tiposMonto}
                    abogados={listaAbogados}
                    open={openFormEditInstancia}
                    onClose={this.HandleOpenFormEditInstancia(false)}
                />
                <FormFinalizaInstancia
                    open={openFormFinalizaInstancia}
                    idInstancia={idInstanciaToFinalizar}
                    onClose={this.handleOpenFormFinalizaInstancia(false)}
                    onConfirm={onFinalizaInstancia}
                />
            </div>
        );
    }
}

AdministraInstancias.propTypes = {
    instancias: PropTypes.array.isRequired,
    idProceso: PropTypes.number.isRequired
};

export default withStyles(styles)(AdministraInstancias);
