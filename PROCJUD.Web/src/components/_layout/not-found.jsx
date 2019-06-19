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

const NotFound = ({ classes, history }) => {
    return (
        <div className={classes.container}>
            <h3>No se encontró la página solicitada o no cuenta con los permisos necesarios</h3>

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

export default withStyles(styles)(NotFound);
