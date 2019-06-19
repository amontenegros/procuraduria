import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DataTable from '../_common/datatable';
import Icon from '@material-ui/core/Icon';
import axios from 'axios';
import ConsultaActionButtons from './consulta-action-buttons';
import { DEFAULT_FILTERS, DEFAULT_PAGINATION } from './_variables';
import ConsultaFilters from './consulta-filters';
import AppContainer from '../_layout/app-container';
import { GetPage, Finalizar } from '../../api/proceso';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import { Link } from 'react-router-dom';
import {
    FetchNaturalezas,
    FetchMaterias,
    FetchTiposProcesos,
    FetchAbogados,
    FetchTiposMontos
} from '../../api/enumerables';
import update from 'immutability-helper';
import FormFinalizaProceso from './form-finaliza-proceso';
import { globalStyles } from '../../constants/styles';
import TitleBar from '../_common/title-bar';

const styles = theme => ({
    actionButtons: {
        width: 35,
        height: 35
    },
    actionIcons: {
        width: 25,
        height: 25
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
            label: 'Número',
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
        },
        {
            label: 'N° Exp. Jud',
            render: i => (i.instancias ? i.instancias.map(x => x.numero_instancia).join(', ') : '-')
        },
        {
            label: 'Razón Social/ Persona',
            render: i => (i.personas ? i.personas.map(x => x.razonsocial).join(', ') : '-')
        },
        {
            label: 'Abogado',
            propertyName: 'abogado || "-"'
        },
        {
            label: 'Resolución',
            render: i => (i.resoluciones ? i.resoluciones.map(x => x.numero).join(', ') : '-')
        },
        {
            label: 'Fecha',
            propertyName: 'auditmod',
            isDate: true
        },
        {
            label: 'Estado',
            propertyName: 'estado_descripcion'
        },
        {
            label: 'Acciones',
            render: renderActions
        }
    ]
});

class ConsultaContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _naturalezas: [],
            _tiposProceso: [],
            _estadosProceso: [{ id: '0', label: 'EN TRÁMITE' }, { id: '1', label: 'FINALIZADO' }],
            _materias: [],
            _abogados: [],
            _tiposMonto: [],
            loading: false,
            loadingFilters: false,
            loadingNaturalezas: false,
            loadingTipoProceso: false,
            filters: { ...DEFAULT_FILTERS },
            pagination: { ...DEFAULT_PAGINATION },
            tableDef: this.createTableDef(),
            idProcesoToFinalizar: 0,
            openFormFinalizar: false,
            menuAnchorEl: null
        };
    }

    handleOpenMenuReporte = bool => e => {
        this.setState({ menuAnchorEl: bool ? e.currentTarget : null });
    };

    createTableDef = () => {
        return TABLE_DEF((item, loading) => (
            <div>
                {!item.estado_proceso &&
                    item._showFinalizarButton && (
                        <IconButton
                            title="Finalizar"
                            className={this.props.classes.actionButtons}
                            onClick={this.handleOpenFormFinalizar(item.id)}
                            disabled={loading}
                        >
                            <LockIcon />
                        </IconButton>
                    )}
                        <IconButton
                            title={item._readonly ? 'Ver proceso' : 'Editar'}
                            className={this.props.classes.actionButtons}
                            disabled={loading}
                            component={Link}
                            {...{ to: `/proceso/${item.id}` }}
                        >
                    {item._readonly ? (
                        <Icon className={this.props.classes.actionIcons}>description</Icon>
                    ) : (
                        <EditIcon className={this.props.classes.actionIcons} />
                    )}
                </IconButton>
            </div>
        ));
    };

    clearFilters = () => {
        this.setState({ filters: { ...DEFAULT_FILTERS }, _tiposProceso: [], _naturalezas: [] }, () => {
            const { pagination } = this.state;
            this.loadData(pagination.page, pagination.pageSize);
        });
    };

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

    handleChangePage = page => {
        const { pagination } = this.state;
        this.loadData(page, pagination.pageSize);
    };

    handleChangePageSize = pageSize => {
        this.loadData(1, pageSize);
    };

    handleChangeFilterInput = e => {
        const { filters } = this.state;
        const target = e.target;

        const new_filters = update(filters, {
            id_naturaleza: { $apply: x => (target.name == 'id_materia' ? '' : x) },
            id_tipo_proceso: { $apply: x => (target.name == 'id_materia' ? '' : x) },
            [target.name]: { $set: target.value }
        });

        this.setState({ filters: new_filters }, () => {
            this.searchOnChangeCombo(target.name);
        });

        if (target.name == 'id_materia') {
            this.loadNaturalezas(target.value);
            this.loadTipoProceso(target.value);
        }
    };

    searchOnChangeCombo = name => {
        const names = ['id_materia', 'id_naturaleza', 'id_tipo_proceso', 'id_abogado', 'id_estado'];
        if (names.indexOf(name) >= 0) this.loadData(1, this.state.pagination.pageSize);
    };

    handleChangeFilterDate = name => date => {
        const { filters } = this.state;
        this.setState({ filters: { ...filters, [name]: date ? date.toDate() : null } }, () => {
            this.loadData(1, this.state.pagination.pageSize);
        });
    };

    handleClearFilters = e => {
        this.clearFilters();
    };

    handleSearch = e => {
        e.preventDefault();
        this.loadData(1, this.state.pagination.pageSize);
    };

    handleClickReporte = tipo_reporte => e => {
        switch (tipo_reporte) {
            case 1:
                const params = queryString.stringify(this.state.filters);
                window.open('/api/reporte/procesos?' + params);
                break;
            case 2:
                console.log('reporte 2');
                break;
            case 3:
                console.log('reporte 3');
                break;
        }
        this.handleOpenMenuReporte(false)();
        //window.open('/api/reporte/procesos');
    };

    handleOpenFormFinalizar = id_proceso => () => {
        this.setState({ openFormFinalizar: true, idProcesoToFinalizar: id_proceso });
    };

    handleCloseFormFinalizar = () => {
        this.setState({ openFormFinalizar: false, idProcesoToFinalizar: 0 });
    };

    finalizaProceso = (id_proceso, form) => {
        this.setState({ loading: true });
        Finalizar(id_proceso, form)
            .then(resp => {
                this.props.toast.open(resp.msg);
                this.setState({ loading: false });
                this.loadData(this.state.pagination.page, this.state.pagination.pageSize);
            })
            .catch(err => {
                console.log(err);
                this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
                this.setState({ loading: false });
            });
    };

    loadNaturalezas = id_materia => {
        this.setState({ loadingNaturalezas: true });
        FetchNaturalezas(id_materia, true)
            .then(naturalezas => {
                this.setState({ loadingNaturalezas: false, _naturalezas: naturalezas });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loadingNaturalezas: false });
            });
    };

    loadTipoProceso = id_materia => {
        this.setState({ loadingTipoProceso: true });
        FetchTiposProcesos(id_materia, true)
            .then(tiposProceso => {
                this.setState({ loadingTipoProceso: false, _tiposProceso: tiposProceso });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loadingTipoProceso: false });
            });
    };

    loadCombos = () => {
        this.setState({ loadingFilters: true });
        axios
            .all([FetchMaterias(), FetchAbogados(), FetchTiposMontos()])
            .then(
                axios.spread((materias, abogados, montos) => {
                    this.setState({
                        loadingFilters: false,
                        _materias: materias,
                        _abogados: abogados,
                        _tiposMonto: montos
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
        this.loadData(pagination.page, pagination.pageSize);
    }

    render() {
        const { classes, user } = this.props;
        const {
            _naturalezas,
            _materias,
            _tiposProceso,
            _abogados,
            _estadosProceso,
            loading,
            tableDef,
            loadingFilters,
            loadingTipoProceso,
            loadingNaturalezas,
            dataTableError,
            filters,
            form,
            pagination,
            idProcesoToFinalizar,
            openFormFinalizar,
            menuAnchorEl,
            _tiposMonto
        } = this.state;

        const showBtnNuevoProceso = user.containsRol('Administrativo');

        return (
            <AppContainer responsiveProps={{ lg: 11, md: 11, sm: 12, xs: 12 }}>
                <TitleBar
                    actions={
                        <ConsultaActionButtons
                            anchorEl={menuAnchorEl}
                            onOpenCloseMenuReporte={this.handleOpenMenuReporte}
                            onClickReporte={this.handleClickReporte}
                            showBtnNuevoProceso={showBtnNuevoProceso}
                        />
                    }
                >
                    LISTA DE PROCESOS JUDICIALES
                </TitleBar>

                <Card className={classes.cardFiltros}>
                    {/* <CardHeader
                        title="LISTA DE PROCESOS JUDICIALES"
                        titleTypographyProps={{
                            className: classes.ContainerTitle
                        }}
                        action={
                            <ConsultaActionButtons
                                onClickReporte={this.handleClickReporte}
                                showBtnNuevoProceso={showBtnNuevoProceso}
                            />
                        }
                    /> */}

                    <ConsultaFilters
                        loading={loadingFilters}
                        loadingTipoProceso={loadingTipoProceso}
                        loadingNaturalezas={loadingNaturalezas}
                        filters={filters}
                        naturalezas={_naturalezas}
                        materias={_materias}
                        tiposProceso={_tiposProceso}
                        abogados={_abogados}
                        estados={_estadosProceso}
                        onInputChange={this.handleChangeFilterInput}
                        onDateChange={this.handleChangeFilterDate}
                        onSearch={this.handleSearch}
                        onClear={this.handleClearFilters}
                    />
                </Card>
                <Card>
                    <DataTable
                        emptyMessage="No hay registros"
                        loading={loading}
                        tableDef={tableDef}
                        pagination={pagination}
                        itemsPerPageOptions={[5, 10, 15, 20, 25, 50]}
                        onChangePage={this.handleChangePage}
                        onChangePageSize={this.handleChangePageSize}
                    />
                </Card>
                
                <FormFinalizaProceso
                    open={openFormFinalizar}
                    idProceso={idProcesoToFinalizar}
                    onClose={this.handleCloseFormFinalizar}
                    onConfirm={this.finalizaProceso}
                    tiposMonto={_tiposMonto}
                />
            </AppContainer>
        );
    }
}

export default withStyles(styles)(ConsultaContainer);
