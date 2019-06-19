import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';

const styles = theme => ({
    container: {
        textAlign: 'center',
        margin: 100
    },
    homeIcon: {
        marginTop: -4,
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    }
});

const InternalError = ({ classes, history }) => {
    return (
        <div className={classes.container}>
            <h3>Ocurrió un error interno. Intente nuevamente.</h3>

            <div>
                <Button
                    color="primary"
                    onClick={() => {
                        history.push('/');
                    }}
                >
                    <HomeIcon className={classes.homeIcon} /> Ir a la página principal
                </Button>
            </div>
        </div>
    );
};

export default withStyles(styles)(InternalError);
