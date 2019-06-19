import React from 'react';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

const styles = theme => ({
    root: {
        margin: 0
    },
    typography: {
        padding: 15
    }
});
const FooterProduce = ({ classes }) => (
    <div className={classes.root}>
        <Divider />
        <Typography className={classes.typography} variant="subheading">
            © {moment().format('YYYY')} - Ministerio de la Producción
        </Typography>
    </div>
);

export default withStyles(styles)(FooterProduce);
