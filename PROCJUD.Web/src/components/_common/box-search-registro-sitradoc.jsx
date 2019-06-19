import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FecthRegistrosSitradoc } from '../../api/sitradoc';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DataTable from './datatable';
import WraperSearchBox from './wraper-search-box';

class BoxSearchRegistroSitradoc extends Component {
    constructor(props) {
        super(props);
        this.state = { ...this.buildInitialState() };
    }

    buildInitialState() {
        return {
            pagination: { page: 1, pageSize: 5, total: 0, items: [] },
            loading: false,
            filters: {
                numero: ''
            },
            tableDef: {
                propertyKeyName: 'id_documento',
                columns: [
                    {
                        label: 'Número',
                        propertyName: 'num_tram_documentario'
                    },
                    {
                        label: 'Asunto',
                        propertyName: 'asunto'
                    },
                    {
                        label: 'Fecha',
                        propertyName: 'auditmod',
                        isDate: true
                    },
                    {
                        label: 'Acciones',
                        custom: true,
                        thStyle: {
                            textAlign: 'center'
                        },
                        tdStyle: {
                            textAlign: 'center'
                        },
                        render: (item, loading) => (
                            <div>
                                <IconButton
                                    title="Seleccionar"
                                    aria-label="Edit"
                                    onClick={this.onSelectItem(item)}
                                    disabled={loading}
                                >
                                    <ArrowForwardIcon />
                                </IconButton>
                            </div>
                        )
                    }
                ]
            }
        };
    }

    setLoading = bool => {
        this.setState({ loading: bool });
    };

    handleSearch = numero => {
        this.setState({ filters: { numero: numero } }, () => {
            const { pagination } = this.state;
            this.loadData(1, pagination.pageSize);
        });
    };

    onSelectItem = item => e => {
        this.props.onSelect(item);
        this.close();
    };

    close = () => {
        this.setState({ ...this.buildInitialState() });
        this.props.onClose();
    };

    loadData = (page, pageSize) => {
        this.setState({ loading: true });
        FecthRegistrosSitradoc(this.state.filters.numero, page, pageSize)
            .then(response => {
                this.setState({ pagination: response.data.pagination, loading: false });
            })
            .catch(err => {
                this.setState({ loading: false });
            });
    };

    render() {
        const { tableDef, loading, pagination } = this.state;
        const { open, classes } = this.props;
        return (
            <WraperSearchBox
                inputPlaceholder="Ingrese número"
                open={open}
                onClose={this.close}
                onSearch={this.handleSearch}
                loading={loading}
            >
                <DataTable
                    loading={loading}
                    pagination={pagination}
                    tableDef={tableDef}
                    onChangePage={page => {
                        this.loadData(page, pagination.pageSize);
                    }}
                    onChangePageSize={pageSize => {
                        this.loadData(1, pageSize);
                    }}
                />
            </WraperSearchBox>
        );
    }
}

export default BoxSearchRegistroSitradoc;
