import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import grey from '@material-ui/core/colors/grey';
import Moment from '../_common/moment';
import LinearProgress from '@material-ui/core/LinearProgress';

const heightRow = 35;

const stylesDefaultColumn = {
    cellNoRecords: {
        textAlign: 'center',
        borderBottom: 0
    }
};

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
    floatLeft: {
        float: 'left'
    },
    loaderContainer: {
        height: 5
    }
});

const stylesHeaderColumn = theme => ({
    head: {
        //fontSize: theme.typography.fontSize + 2,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
});

const ListTableHeaderColumn = withStyles(stylesHeaderColumn)(TableCell);

const ListTableHeader = ({ columns, cellProps }) => (
    <TableHead>
        <TableRow>
            {columns.map(
                (column, index) => (
                    <ListTableHeaderColumn
                        component="th"
                        scope="row"
                        key={index}
                        style={column.thStyle}
                        {...cellProps}
                    >
                        {column.label}
                    </ListTableHeaderColumn>
                ),
                this
            )}
        </TableRow>
    </TableHead>
);

const ListTableColumn = ({ colDef, item, loading, cellProps }) => {
    let value = colDef.propertyName ? eval('item.' + colDef.propertyName) : null;
    return (
        <TableCell scope="row" style={colDef.tdStyle} {...cellProps}>
            {typeof colDef.render === 'function' ? (
                colDef.render(item, loading)
            ) : colDef.isDate === true ? (
                <Moment date={value} />
            ) : (
                        value
                    )}
        </TableCell>
    );
};

const ListTableDefaultColumn = withStyles(stylesDefaultColumn)(
    ({ classes, colspan, emptyMessage }) => (
        <TableCell className={classes.cellNoRecords} colSpan={colspan}>
            {emptyMessage}
        </TableCell>
    )
);

class ListTable extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            tableDef,
            classes,
            loading,
            emptyMessage,
            items,
            fixedTable,
            fixedTableWidth,
            cellProps
        } = this.props;
        const tableStyle = fixedTable ? { tableLayout: 'fixed', width: fixedTableWidth } : null;

        const colgroup = fixedTable && (
            <colgroup>
                {(tableDef.colgroup ? tableDef.colgroup : []).map((colProps, i) => (
                    <col key={'colgroup_' + i} {...colProps} />
                ))}
            </colgroup>
        );
        return (
            <div>
                <div className={classes.loaderContainer}>{loading && <LinearProgress />}</div>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} style={tableStyle}>
                        {colgroup}
                        <ListTableHeader columns={tableDef.columns} cellProps={cellProps} />
                        <TableBody>
                            {items.length === 0 && (
                                <TableRow key={0} className={classes.rowNoRecords}>
                                    <ListTableDefaultColumn
                                        colspan={tableDef.columns.length}
                                        emptyMessage={emptyMessage}
                                    />
                                </TableRow>
                            )}

                            {items.map((item, index) => (
                                <TableRow
                                    key={index}
                                    className={classnames(
                                        index % 2 ? classes.odd : null,
                                        classes.tableRow
                                    )}
                                >
                                    {tableDef.columns.map((col, index) => (
                                        <ListTableColumn
                                            key={index}
                                            colDef={col}
                                            item={item}
                                            loading={loading}
                                            cellProps={cellProps}
                                        />
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
}

ListTable.defaultProps = {
    emptyMessage: 'No se encontraron registros',
    fixedTable: false,
    fixedTableWidth: 1000,
    loading: false,
    cellProps: {}
};

ListTable.propTypes = {
    loading: PropTypes.bool,
    emptyMessage: PropTypes.string,
    items: PropTypes.array.isRequired,
    tableDef: PropTypes.shape({
        //propertyKeyName: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
    cellProps: PropTypes.object
};

export default withStyles(styles)(ListTable);
