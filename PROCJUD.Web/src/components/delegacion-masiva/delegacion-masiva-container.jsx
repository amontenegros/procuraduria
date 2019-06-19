import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TitleBar from '../_common/title-bar';
import { withStyles } from '@material-ui/core/styles';
import DataTable from '../_common/datatable';
import axios from 'axios';
import { GetPageDelegacionMasiva, Finalizar } from '../../api/proceso';
import AppContainer from '../_layout/app-container';
import { globalStyles } from '../../constants/styles';
import { FetchAbogados } from '../../api/enumerables';
import { DEFAULT_FILTERS, DEFAULT_PAGINATION } from './_variables';
import ListTable from '../_common/list-table';
import DelegacionFilters from './delegacion-form-buscar';
import DelegacionFormDelegar from './delegacion-from-delegar';
import { Buscar } from '../../api/delegacion';
import OpenModal from '../_common/modal';
import DelegacionModalDelegar from './delegacion-modal-delegar';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
    textField: {
        width: '100%',
        margin: 0
    },
    datePicker: {
        margin: 2
    },
    card: {
        overflow: 'inherit'
    },
    loaderContainer: {
        height: 5
    },
    footerButtonsContainer: {
        marginTop: 10,
        textAlign: 'center'
    },
    button: {
        marginLeft: 2 * theme.spacing.unit,
        marginRight: 2 * theme.spacing.unit,
    },
    icon: {
        marginRight: theme.spacing.unit,
        fontSize: 20
    },
    buttonsContainer: {
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    ContainerTitle: globalStyles.ContainerTitle,
    cardFiltros: {
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 20
    }
});

const TABLE_DEF = renderActions => ({
    propertyKeyName: 'id',
    columns: [
        {
            label: 'Seleccionar',
            render: renderActions
        },
        {
            label: 'N° Legajo',
            propertyName: 'numero'
        },
        {
            label: 'Naturaleza',
            propertyName: 'materia_descripcion'
        },
        {
            label: 'Tipo Proceso',
            propertyName: 'tipo_proceso_descripcion'
        },
        {
            label: 'Materia',
            propertyName: 'naturaleza_descripcion'
        }
    ]
});


class DelegacionMasivaContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            estado_seleccion: false,
            _anios: [],
            _estadosProceso: [{ id: '0', label: 'EN TRÁMITE' }],
            legajosSeleccionados: [],
            id_legajo: "",
            _abogados: [],
            loading: false,
            loadingFilters: false,
            filters: { ...DEFAULT_FILTERS },
            tableDef: this.createTableDef(),
            pagination: { ...DEFAULT_PAGINATION },
            legajos: [],
            id_abogado_Consultado: null
        };
    }

    createTableDef = () => {
        return TABLE_DEF((item, loading) => (
            <div>
                <Checkbox
                    color="primary"
                    onChange={this.handleChange(String(item.id))}
                    value={String(item.id)}
                    checked={this.state.legajosSeleccionados.filter(x => x == item.id).length > 0}
                />
            </div>
        ));
    };

    handleChange = name => event => {

        this.setState({ [name]: event.target.checked });
        if (event.target.checked == true) {
            this.AcumularLegajo(name)
        } else {
            this.QuitarLegajo(name)
        }
    };

    AcumularLegajo(id_Legajo) {
        this.state.legajosSeleccionados.push(id_Legajo);
    };

    QuitarLegajo(id_Legajo) {
        var indexLegajo = this.state.legajosSeleccionados.indexOf(id_Legajo);
        if (indexLegajo > -1) {
            this.state.legajosSeleccionados.splice(indexLegajo, 1);
        }
    };

    searchOnChangeCombo = name => {
        const names = ['id_abogado', 'anio', 'id_estado'];
        if (names.indexOf(name) >= 0) this.loadData(1, this.state.pagination.pageSize);
    };

    clearFilters = () => {
        this.setState({ filters: { ...DEFAULT_FILTERS }, }, () => {
            const { filters } = this.state;
            this.loadData(filters);
        });
    };

    loadAnios() {
        var fecha = new Date();
        var anioActual = fecha.getFullYear();
        for (var i = anioActual; i >= 1991; i--) {
            this.state._anios.push({ id: String(i), label: String(i) });
        }
    }

    loadCombos = () => {

        this.loadAnios();
        this.setState({ loadingFilters: true });
        axios
            .all([FetchAbogados()])
            .then(
                axios.spread((abogados) => {
                    this.setState({
                        loadingFilters: false,
                        _abogados: abogados,
                    });
                })
            )
            .catch(err => {
                this.setState({ loadingFilters: false });
                console.log(err);
            });
    };

    componentDidMount() {
        const { pagination } = this.state;
        this.loadCombos();
    }

    loadData = (filters) => {
        this.state.legajosSeleccionados = [];
        this.setState({ loading: true });
        GetPageDelegacionMasiva(filters)
            .then(resp => {
                this.setState({ loading: false, legajos: resp.data });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
            });
    }

    handleOpen = () => {
        this.setState({ ...INITIAL_STATE });
    };

    handleChangeFilterInput = e => {
        const { filters } = this.state;
        const target = e.target;
        this.setState({ filters: { ...filters, [target.name]: target.value } });
    };

    handleClearFilters = () => {
        this.clearFilters();
    };

    handleSearch = e => {
        e.preventDefault();
        const { filters } = this.state;
        this.state.id_abogado_Consultado = filters.id_abogado;
        this.loadData(filters);
        //this.state.id_abogado_Consultado = filters.id_abogado;

    };

    handleChangePage = page => {
        const { pagination } = this.state;
        this.loadData(page, pagination.pageSize);
    };

    handleChangePageSize = pageSize => {
        this.loadData(1, pageSize);
    };

    handleDelegar = () => {
        this.setState({ legajosSeleccionados: [] }, () => {
            console.log(this.state.legajosSeleccionados);
            const { filters } = this.state;
            this.loadData(filters);
        });
    };

    validarSelecion = () => {
        if (this.state.legajosSeleccionados.length > 0) {
            this.openModal();
        } else {
            this.props.toast.open("No seleccionó ningún legajo", "info");
        }
    };

    openModal = () => {
        OpenModal({
            component: DelegacionModalDelegar,
            title: "Delegación Masiva de Legajos",
            props: {
                // name: "NAME"
                nroLejajos: this.state.legajosSeleccionados.length,
                legajosSeleccionados: this.state.legajosSeleccionados,
                onDelegar: this.handleDelegar,
                toast: this.props.toast,
                id_abogado_Consultado: this.state.id_abogado_Consultado,
            }
        });
        console.log(this.state.id_abogado_Consultado);
    }

    render() {
        const { data, order, orderBy, selected, rowsPerPage, page, legajos } = this.state;
        const { classes, user } = this.props;
        // console.log(user)
        const {
            _anios,
            _abogados,
            _estadosProceso,
            loading,
            tableDef,
            loadingFilters,
            filters,
            pagination,
        } = this.state;

        return (

            <AppContainer responsiveProps={{ lg: 11, md: 11, sm: 12, xs: 12 }}>
                <TitleBar>
                    PROCESOS JUDICIALES - DELEGACIÓN MASIVA DE LEGAJOS
                    </TitleBar>
                <Card className={classes.cardFiltros}>
                    <DelegacionFilters
                        estados={_estadosProceso}
                        loading={loadingFilters}
                        filters={filters}
                        onSearch={this.handleSearch}
                        loading={loadingFilters}
                        onInputChange={this.handleChangeFilterInput}
                        onDateChange={this.handleChangeFilterDate}
                        abogados={_abogados}
                        anios={_anios}
                        onClear={this.handleClearFilters}
                    />
                </Card>
                <Card>
                    <ListTable
                        emptyMessage="No hay registros"
                        loading={loading}
                        tableDef={tableDef}
                        items={legajos}
                    //pagination={pagination}
                    //itemsPerPageOptions={[50]}
                    //onChangePage={this.handleChangePage}
                    //onChangePageSize={this.handleChangePageSize}
                    />
                    <DelegacionFormDelegar
                        abrirModal={this.validarSelecion}
                    />
                </Card>
            </AppContainer>
        );
    }
}

export default withStyles(styles)(DelegacionMasivaContainer);
