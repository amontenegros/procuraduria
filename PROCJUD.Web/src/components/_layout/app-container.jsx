import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FooterProduce from './footer-produce';

const styles = theme => ({
    container: {
        marginTop: theme.spacing.unit * 5,
        [theme.breakpoints.between('xs', 'sm')]: {
            marginTop: theme.spacing.unit * 10
        }
    }
});
const AppContainer = ({ children, classes, responsiveProps }) => (
    <Grid container justify="center" className={classes.container}>
        <Grid item {...responsiveProps}>
            {children}
            <FooterProduce />
        </Grid>
    </Grid>
);

AppContainer.defaultProps = {
    responsiveProps: { lg: 7, md: 11, sm: 12, xs: 12 }
};

AppContainer.propTypes = {
    responsiveProps: PropTypes.object
};

export default withStyles(styles)(AppContainer);
