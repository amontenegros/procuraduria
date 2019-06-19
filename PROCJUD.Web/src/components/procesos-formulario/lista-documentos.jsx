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
 import FormAgregaDocumento from './form-agrega-documento';
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

const renderLinkArchivo = item => {
    if (!item.archivo) return '-';

    if (item.id_proceso_instancia_documento)
        return (
            <a
                href={`/api/file/documento_instancia/${item.id_proceso_instancia_documento}`}
                target="_blank"
            >
                Ver archivo
            </a>
        );

    return item.archivo;
};
class ListaDocumentos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openFormDocumento: false,
            tableDef: {
                columns: [
                    {
                        label: 'Tipo de Documento',
                        render: item => (item.id_documento ? 'SITRADOC' : 'EXTERNO')
                    },
                    { label: 'N° Registro SITRADOC', propertyName: 'numero_documento_sitradoc' },
                    { label: 'N° Documento', propertyName: 'numero_documento' },
                    { label: 'Fecha', propertyName: 'fecha_documento', isDate: true },
                    {
                        label: 'Archivo',
                        render: item => renderLinkArchivo(item)
                    },
                    {
                        label: 'ACCIÓN',
                        render: item =>
                            !this.props.readonly && (
                                <IconButton onClick={this.handleRemoveDocumentoClick(item)}>
                                    <DeleteIcon />
                                </IconButton>
                            )
                    }
                ]
            }
        };
    }

    handleRemoveDocumentoClick = item => () => {
        Confirm('Se va eliminar el documento. ¿Desea continuar?').then(ok => {
            if (ok) {
                this.props.onRemoveDocumento(item);
            }
        });
    };

    handleAddDocumentoClick = () => {
        this.setState({ openFormDocumento: true });
    };

    handleCloseFormDocumento = () => {
        this.setState({ openFormDocumento: false });
    };

    render() {
        const { classes, documentos, loading, onAddDocumento, toast, readonly } = this.props;
        const { tableDef, openFormDocumento } = this.state;

        return (
            <div className={classes.root}>
                <Toolbar className={classes.toolbar}>
                    <Typography color="inherit" variant="subheading" className={classes.typography}>
                        Documentos
                    </Typography>
                    {!readonly && (
                        <div>
                            <Button
                                aria-label="Add"
                                color="primary"
                                onClick={this.handleAddDocumentoClick}
                                disabled={loading}
                            >
                                <AddIcon /> Agregar Documento
                            </Button>
                        </div>
                    )}
                </Toolbar>
                <ListTable
                    items={documentos}
                    loading={loading}
                    tableDef={tableDef}
                    emptyMessage="No hay documentos"
                    cellProps={{ style: { whiteSpace: 'nowrap', padding: '0px 0px 0px 24px' } }}
                />
                <FormAgregaDocumento
                    toast={toast}
                    open={openFormDocumento}
                    onClose={this.handleCloseFormDocumento}
                    onAddDocumento={onAddDocumento}
                />
            </div>
        );
    }
}

ListaDocumentos.defaultProps = {
    readonly: false,
    loading: false
};

ListaDocumentos.propTypes = {
    classes: PropTypes.object.isRequired,
    documentos: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onAddDocumento: PropTypes.func.isRequired,
    onRemoveDocumento: PropTypes.func.isRequired,
    toast: PropTypes.object,
    readonly: PropTypes.bool,
    loading: PropTypes.bool
};

export default withStyles(styles)(ListaDocumentos);
