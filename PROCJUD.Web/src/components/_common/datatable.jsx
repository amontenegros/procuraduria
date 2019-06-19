import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import grey from '@material-ui/core/colors/grey';
import Moment from '../_common/moment';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import LinearProgress from '@material-ui/core/LinearProgress';

const heightRow = 35;

const stylesDefaultColumn = {
    cellNoRecords: {
        textAlign: 'center',
        borderBottom: 0
    }
};

const stylesActionButtons = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5
    }
});

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3
    },
    table: {
        minWidth: 500
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    rowNoRecords: {
        height: heightRow
    },
    tableRow: {
        height: heightRow
    },
    odd: {
        backgroundColor: grey[200]
    },
    loaderContainer: {
        height: 5
    },
    floatLeft: {
        float: 'left'
    }
});

const cellStyles = {
    noWrap: { whiteSpace: 'nowrap' },
    padding: {
        paddingRight: 4
    }
};

const stylesHeaderColumn = theme => ({
    head: {
        fontSize: theme.typography.fontSize + 2,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: grey[800]
    }
});

const DataTableHeaderColumn = withStyles(stylesHeaderColumn)(TableCell);

const DataTableHeader = ({ columns }) => (
    <TableHead>
        <TableRow>
            {columns.map(
                (column, index) => (
                    <DataTableHeaderColumn
                        component="th"
                        scope="row"
                        key={index}
                        style={column.thStyle}
                    >
                        {column.label}
                    </DataTableHeaderColumn>
                ),
                this
            )}
        </TableRow>
    </TableHead>
);

const DataTableColumn = withStyles(cellStyles)(({ colDef, item, loading, classes, noWrap }) => {
    let value = colDef.propertyName ? eval('item.' + colDef.propertyName) : null;
    return (
        <TableCell
            scope="row"
            style={colDef.tdStyle}
            className={classnames(classes.padding, noWrap ? classes.noWrap : null)}
        >
            {typeof colDef.render === 'function' ? (
                colDef.render(item, loading)
            ) : colDef.isDate === true ? (
                <Moment date={value} />
            ) : (
                value
            )}
        </TableCell>
    );
});

const DataTableDefaultColumn = withStyles(stylesDefaultColumn)(
    ({ classes, colspan, loading, error, emptyMessage }) => (
        <TableCell className={classes.cellNoRecords} colSpan={colspan}>
            {loading
                ? 'Cargando resultados...'
                : error
                    ? 'Ocurrió un error al cargar los datos'
                    : emptyMessage}
        </TableCell>
    )
);

const DataTablePaginator = ({
    page,
    pageSize,
    total,
    colspan,
    itemsPerPageOptions,
    loading,
    onChangePage,
    onChangePageSize
}) => (
    <TablePagination
        component="div"
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
            `Filas del ${from} al ${to} de un total de ${count}`
        }
        colSpan={colspan}
        count={total}
        rowsPerPage={pageSize}
        page={page - 1}
        onChangePage={page => {
            onChangePage(page + 1);
        }}
        onChangeRowsPerPage={onChangePageSize}
        ActionsComponent={DataTablePaginatorActions}
        nextIconButtonProps={{ disabled: loading }}
        rowsPerPageOptions={itemsPerPageOptions}
    />
);

const DataTablePaginatorActions = withStyles(stylesActionButtons, {
    withTheme: true
})(({ classes, count, page, rowsPerPage, theme, disabled, nextIconButtonProps, onChangePage }) => {
    const handleFirstPageButtonClick = event => {
        onChangePage(0);
    };

    const handleBackButtonClick = event => {
        onChangePage(page - 1);
    };

    const handleNextButtonClick = event => {
        onChangePage(page + 1);
    };

    const handleLastPageButtonClick = event => {
        onChangePage(Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0 || nextIconButtonProps.disabled}
                aria-label="First Page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0 || nextIconButtonProps.disabled}
                aria-label="Previous Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={
                    page >= Math.ceil(count / rowsPerPage) - 1 || nextIconButtonProps.disabled
                }
                aria-label="Next Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={
                    page >= Math.ceil(count / rowsPerPage) - 1 || nextIconButtonProps.disabled
                }
                aria-label="Last Page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
});

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    calcEmptyRows(pagination) {
        return (
            pagination.pageSize -
            Math.min(
                pagination.pageSize,
                pagination.total - (pagination.page - 1) * pagination.pageSize
            )
        );
    }

    render() {
        const {
            pagination,
            tableDef,
            classes,
            loading,
            emptyMessage,
            error,
            itemsPerPageOptions,
            onChangePage,
            onChangePageSize,
            paginationFloatLeft,
            fixedTable,
            fixedTableWidth,
            noWrap
        } = this.props;

        const tableStyle = fixedTable ? { tableLayout: 'fixed', width: fixedTableWidth } : null;

        let rows = [];

        let emptyRows = this.calcEmptyRows(pagination);

        const colgroup = fixedTable && (
            <colgroup>
                {(tableDef.colgroup ? tableDef.colgroup : []).map((colProps, i) => (
                    <col key={'colgroup_' + i} {...colProps} />
                ))}
            </colgroup>
        );

        if (pagination.total === 0) {
            emptyRows = pagination.pageSize - 1;
            rows.push(
                <TableRow key={0} className={classes.rowNoRecords}>
                    <DataTableDefaultColumn
                        colspan={tableDef.columns.length}
                        loading={loading}
                        error={error}
                        emptyMessage={emptyMessage}
                    />
                </TableRow>
            );
        } else {
            rows = pagination.items.map((item, index) => (
                <TableRow
                    key={item[tableDef.propertyKeyName]}
                    className={classnames(index % 2 ? classes.odd : null, classes.tableRow)}
                >
                    {tableDef.columns.map((col, index) => (
                        <DataTableColumn
                            key={index}
                            colDef={col}
                            item={item}
                            loading={loading}
                            noWrap={noWrap}
                        />
                    ))}
                </TableRow>
            ));
        }

        return (
            <div>
                <div className={classes.loaderContainer}>{loading && <LinearProgress />}</div>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} style={tableStyle}>
                        {colgroup}
                        <DataTableHeader columns={tableDef.columns} />
                        <TableBody>
                            {rows}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: heightRow * emptyRows }}>
                                    <TableCell colSpan={tableDef.columns.length} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {pagination.total > 0 && (
                    <DataTablePaginator
                        colspan={tableDef.columns.length}
                        page={pagination.page}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        itemsPerPageOptions={itemsPerPageOptions}
                        loading={loading}
                        onChangePage={onChangePage}
                        onChangePageSize={e => {
                            onChangePageSize(e.target.value);
                        }}
                    />
                )}
            </div>
        );
    }
}

DataTable.defaultProps = {
    loading: false,
    error: false,
    emptyMessage: 'No se encontraron registros',
    itemsPerPageOptions: [5, 10, 15, 20, 25],
    paginationFloatLeft: false,
    fixedTable: false,
    fixedTableWidth: 1000,
    noWrap: false
};

DataTable.propTypes = {
    paginationFloatLeft: PropTypes.bool,
    itemsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    emptyMessage: PropTypes.string,
    error: PropTypes.bool,
    loading: PropTypes.bool,
    tableDef: PropTypes.shape({
        propertyKeyName: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        columns: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                propertyName: PropTypes.string,
                render: PropTypes.func,
                thStyle: PropTypes.object,
                tdStyle: PropTypes.object
            }).isRequired
        ).isRequired
    }),
    fixedTable: PropTypes.bool,
    fixedTableWidth: PropTypes.number,
    noWrap: PropTypes.bool
};

export default withStyles(styles)(DataTable);
