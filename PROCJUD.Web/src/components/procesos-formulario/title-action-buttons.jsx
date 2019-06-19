import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import { Link } from 'react-router-dom';

const styles = theme => ({
    leftIcon: {
        marginRight: theme.spacing.unit,
        marginTop: -2
    },
    button: {
        margin: theme.spacing.unit
    }
});

const TitleActionButtons = ({ classes, onClickGrabar, loading, readonly }) => (
    <div>
        {!readonly && (
            <Button
                color="primary"
                className={classes.button}
                onClick={onClickGrabar}
                disabled={loading}
            >
                <SaveIcon className={classes.leftIcon} />
                Guardar
            </Button>
        )}

        <Button
            color="primary"
            className={classes.button}
            component={Link}
            {...{ to: '/' }}
            disabled={loading}
        >
            <ArrowBackIcon className={classes.leftIcon} />
            Volver
        </Button>
    </div>
);

export default withStyles(styles)(TitleActionButtons);
