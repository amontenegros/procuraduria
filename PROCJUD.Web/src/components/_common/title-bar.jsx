import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

const styles = theme => ({
    typography: {
        flex: '1',
        fontWeight: 'bold'
    },
    toolbar: {
        paddingLeft: 0,
        paddingRight: 0
    }
});

class TitleBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { classes, children, actions } = this.props;
        return (
            <Toolbar className={classes.toolbar}>
                <Typography variant="title" className={classes.typography}>
                    {children}
                </Typography>
                <div>{actions}</div>
            </Toolbar>
        );
    }
}

export default withStyles(styles)(TitleBar);
