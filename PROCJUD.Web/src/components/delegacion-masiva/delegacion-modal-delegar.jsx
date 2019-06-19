import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import axios from 'axios';
import { GetPage, DelegacionMasivaLegajos } from '../../api/proceso';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CardContent from '@material-ui/core/CardContent';
import DelegacionModalFilters from './delegacion-modal-filters';
import { FetchAbogados } from '../../api/enumerables';
import Confirm from '../_common/confirm';
import { DEFAULT_FILTERS, DEFAULT_PAGINATION } from './_variables';

class DelegacionModalDelegar extends React.Component {

    constructor(props) {
        super(props);
        this.id_abogado_Consultado=null;
        this.state = {
            messageValida:null,
            //_estadosProceso: [{ id: '0', label: 'EN TRÁMITE' }, { id: '1', label: 'FINALIZADO' }],
            id_abogado: null,
            _abogados: [],
            //loading: false,
            loadingFilters: false,
            filters: { ...DEFAULT_FILTERS },
            //tableDef: this.createTableDef(),
            pagination: { ...DEFAULT_PAGINATION }
        };
    }

    searchOnChangeCombo = name => {
        const names = ['id_abogado'];
        if (names.indexOf(name) >= 0) this.loadData(1, this.state.pagination.pageSize);
    };

    componentDidMount() {
        const { pagination } = this.state;
        this.loadCombos();
        this.loadData(pagination.page, pagination.pageSize);
    }

    loadData = (page, pageSize) => {
        const { filters } = this.state;
        this.setState({ loading: true });
        GetPage(page, pageSize, filters)
            .then(resp => {
                this.setState({ loading: false, pagination: resp.data.pagination });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
            });
    };

    loadCombos = () => {
        this.setState({ loadingFilters: true });
        axios
            .all([FetchAbogados()])
            .then(
                axios.spread((abogados) => {
                    this.setState({
                        loadingFilters: false,
                        _abogados: abogados
                    });
                })
            )
            .catch(err => {
                this.setState({ loadingFilters: false });
                console.log(err);
            });
    };
    handleChangeFilterInput = e => {
        const { filters } = this.state;
        const target = e.target;
        this.state.id_abogado = this.setState({ filters: { ...filters, [target.name]: target.value } });
    };

    handleChangePage = page => {
        const { pagination } = this.state;
        this.loadData(page, pagination.pageSize);
    };
    handleChangePageSize = pageSize => {
        this.loadData(1, pageSize);
    };
    //-----------------------------------
    handleSubmit = e => {
        e.preventDefault();
         if (this.validate()) {
            Confirm('Se procederá a delegar todos los legajos seleccionados. ¿Desea continuar?').then(ok => {
                        if (ok) {
                            this.DelegarLegajos(this.state.filters.id_abogado,this.props.legajosSeleccionados);                    
                        }
                    });
         }else{
            this.props.toast.open(this.state.message,"info");
         }
    };

    validate = () => {
        var valid = true;

        if (this.state.filters.id_abogado == null || this.state.filters.id_abogado == "") {
            this.state.message = "Debe selecionar a un Abogado.";
            valid = false
        }else{
            if (this.state.filters.id_abogado == this.props.id_abogado_Consultado) {
                this.state.message = "Actualmente los legajos seleccionados están delegados a este abogado.";
                valid = false
            }
        }
       return valid;
    }

    DelegarLegajos = (id_abogado, legajosSeleccionados) => {
        // this.setState({ loading: true });
        DelegacionMasivaLegajos(id_abogado, legajosSeleccionados)
            .then(resp => {
                // this.props.toast.open(resp.msg);
                // this.setState({ loading: false });
                //this.loadData(this.state.pagination.page, this.state.pagination.pageSize);
                this.props.onDelegar();
                this.props.close();
                this.props.toast.open(resp.msg);
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
                this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
            });
    };
    //-----------------------------------

    DelegacionMasiva = (id_abogado, legajosSeleccionados) => {
        // this.setState({ loading: true });
        DelegacionMasivaLegajos(id_abogado, legajosSeleccionados)
            .then(resp => {
                this.props.toast.open(resp.msg);
                // this.setState({ loading: false });
                // this.loadData(this.state.pagination.page, this.state.pagination.pageSize);
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        const { nroLejajos, legajosSeleccionados } = this.props;
        const {
            id_abogado_Consultado,
            _abogados,
            loading,
            tableDef,
            loadingFilters,
            dataTableError,
            filters,
            menuAnchorEl,
            pagination
        } = this.state;
        return (

            // <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
            <div >
                <DialogContent>
                    Legajos seleccionados : {nroLejajos}
                    <DelegacionModalFilters
                        loading={loadingFilters}
                        filters={filters}
                        onSearch={this.handleSearch}
                        loading={loadingFilters}
                        onInputChange={this.handleChangeFilterInput}
                        onDateChange={this.handleChangeFilterDate}
                        abogados={_abogados}
                    // anio={_anio}
                    //onClear={this.handleClearFilters}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.props.dismiss}
                    >
                        Cancelar
                </Button>
                    <Button
                        //onClick={this.props.close}
                        //onConfirm={this.DelegacionMasiva}
                        onClick={this.handleSubmit}
                    // onclose={this.props.dismiss}
                    >
                        Delegar
                </Button>
                </DialogActions>
            </div>
            // </form>
        );
    }
}

export default DelegacionModalDelegar;