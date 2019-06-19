import React from 'react';
import PropTypes from 'prop-types';
import ListTable from '../_common/list-table';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FormAgregaPlazo from './form-agrega-plazo';
import Confirm from '../_common/confirm';

const styles = theme => ({
    root: {
        //border: 'solid 1px #ddd'
    },
    typography: {
        flex: '1'
    },
    toolbar: {
        paddingLeft: 0,
        paddingRight: 0
    }
});

class ListaPlazos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openFormAddPlazo: false,
            modelPlazo: null,
            tableDef: {
                columns: [
                    {
                        label: 'Plazo',
                        propertyName: '_plazo.nombre_plazo'
                    },
                    { label: 'Fecha Notificación', propertyName: 'fecha_inicio', isDate: true },
                    { label: 'Abogado', propertyName: 'nombre_abogado' },
                    { label: 'Estado', propertyName: 'estado_descripcion' },
                    { label: 'Fecha Atención', propertyName: 'fecha_final', isDate: true },
                    { label: 'Anotación', propertyName: 'anotacion' },
                    {
                        label: 'ACCIÓN',
                        render: item => (
                            <div>
                                {!item.estado &&
                                    !this.props.readonly && (
                                        <div>
                                            <IconButton onClick={this.handleOpenFormPlazo(item)}>
                                                <EditIcon />
                                            </IconButton>

                                            <IconButton onClick={this.handleRemovePlazoClick(item)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    )}
                            </div>
                        )
                    }
                ]
            }
        };
    }

    handleRemovePlazoClick = item => () => {
        Confirm('Se va eliminar el plazo. ¿Desea continuar?').then(ok => {
            if (ok) {
                this.props.onRemovePlazo(item);
            }
        });
    };

    handleOpenFormPlazo = (model = null) => e => {
        this.setState({ openFormAddPlazo: true, modelPlazo: model ? { ...model } : null });
    };

    handleCloseFormPlazo = e => {
        this.setState({ openFormAddPlazo: false });
    };

    render() {
        const {
            classes,
            plazos,
            onAddPlazo,
            onUpdatePlazo,
            listaPlazos,
            abogados,
            readonly,
            loading
        } = this.props;
        const { tableDef, openFormAddPlazo, modelPlazo } = this.state;
        return (
            <div className={classes.root}>
                <Toolbar className={classes.toolbar}>
                    <Typography color="inherit" variant="subheading" className={classes.typography}>
                        Plazos
                    </Typography>
                    {!readonly && (
                        <div>
                            <Button
                                aria-label="Add"
                                color="primary"
                                onClick={this.handleOpenFormPlazo()}
                                disabled={loading}
                            >
                                <AddIcon /> Agregar Plazo
                            </Button>
                        </div>
                    )}
                </Toolbar>
                <ListTable
                    items={plazos}
                    tableDef={tableDef}
                    emptyMessage="No hay plazos"
                    cellProps={{ style: { whiteSpace: 'nowrap' } }}
                />
                <FormAgregaPlazo
                    abogados={abogados}
                    listaPlazos={listaPlazos}
                    open={openFormAddPlazo}
                    onClose={this.handleCloseFormPlazo}
                    onAddPlazo={onAddPlazo}
                    onUpdatePlazo={onUpdatePlazo}
                    model={modelPlazo}
                />
            </div>
        );
    }
}

ListaPlazos.defaultProps = {
    readonly: false,
    loading: false
};

ListaPlazos.propTypes = {
    classes: PropTypes.object.isRequired,
    plazos: PropTypes.array.isRequired,
    onAddPlazo: PropTypes.func.isRequired,
    onRemovePlazo: PropTypes.func.isRequired,
    onUpdatePlazo: PropTypes.func.isRequired,
    readonly: PropTypes.bool,
    loading: PropTypes.bool
};

export default withStyles(styles)(ListaPlazos);
