import React from 'react';
import PropTypes from 'prop-types';
import ListTable from '../_common/list-table';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Ico from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import FormFiltroModal from './delegacion-modal-filters';
import Confirm from '../_common/confirm';
import Icon from '@material-ui/core/Icon';
import { VARIABLES } from './_variables';

const styles = theme => ({
    toolbar: {
        paddingLeft: 0,
        paddingRight: 0
    },
    ypography: {
        flex: '1'
    },
    actionButtons: {
        width: 35,
        height: 35
    },
    actionIcons: {
        width: 25,
        height: 25
    },
    button: {
        marginLeft: 2 * theme.spacing.unit,
        marginRight: 2 * theme.spacing.unit
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
    cardFiltros: {
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 20
    },
    textField: {
        width: '100%',
        margin: 0
    },
    datePicker: {
        margin: 2
    }
});

const DelegacionFormDelegar = ({ classes, disabled, abrirModal }) => (
    <div className={classes.buttonsContainer}>
        <Button
            type="submit"
            variant="contained"
            size="small"
            color="primary"
            className={classes.button}
            disabled={disabled}
            onClick={abrirModal}
        >
            
            <Icon className={classes.icon}>low_priority</Icon>
             Delegar
        </Button>

    </div>);

export default withStyles(styles)(DelegacionFormDelegar);