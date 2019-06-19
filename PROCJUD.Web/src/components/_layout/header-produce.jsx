import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import PersonIcon from '@material-ui/icons/Person';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import withWidth from '@material-ui/core/withWidth';
import Breakpoints from '../../constants/breakpoints';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import Divider from '@material-ui/core/Divider';

const appBarHeight = 56;

const styles = theme => ({
    root: {
        flexGrow: 1,
        //marginBottom: theme.spacing.unit * 5,
        background: '#fff'
        /*[theme.breakpoints.between('xs', 'sm')]: {
            marginBottom: theme.spacing.unit * 10
        }*/
    },
    flex: {
        flex: 1,
        minHeight: appBarHeight,
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    logosContainer: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    logoLeft: {
        minHeight: 50,
        padding: 20
    },
    logoRight: {
        textAlign: 'right',
        minHeight: 50,
        padding: 20
    },
    brand: {
        flex: 1,
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    fab: {
        position: 'relative',
        bottom: theme.spacing.unit * -4,
        right: theme.spacing.unit * 5,
        [theme.breakpoints.down('sm')]: {
            position: 'absolute',
            right: theme.spacing.unit * 0
        },
        zIndex: 1
    },
    navActive: {
        background: theme.palette.primary.dark,
        '&:hover': {
            background: theme.palette.primary.dark
        }
    },
    navButton: {
        height: appBarHeight
    },
    toolbar: {
        minHeight: appBarHeight
    },
    navDrawerActive: {
        background: theme.palette.action.selected
    },
    appNameText: {
        [theme.breakpoints.up('lg')]: {
            marginTop: 10
        }
    }
});

class HeaderProduce extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            menuOptions: [],
            menuDrawer: [],
            showDrawer: false
        };
    }

    handleUserMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    logout = () => {
        this.setState({ anchorEl: null }, () => {
            location.href = '/api/home/logout';
        });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    componentDidMount() {
        const { classes } = this.props;
        let menuOptions = this.props.menuOptions.map((route, index) => (
            <Button
                className={classes.navButton}
                key={index}
                color="inherit"
                exact
                component={NavLink}
                {...{ to: route.to, activeClassName: classes.navActive }}
            >
                {route.label}
            </Button>
        ));
        let menuDrawer = this.props.menuOptions.map((route, index) => (
            <ListItem
                button
                key={index}
                exact
                component={NavLink}
                {...{ to: route.to, activeClassName: classes.navDrawerActive }}
            >
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={route.label} />
            </ListItem>
        ));

        this.setState({ menuOptions: menuOptions, menuDrawer: menuDrawer });
    }

    toggleDrawer = status => event => {
        this.setState({ showDrawer: status });
    };

    calculatePosition = width => {
        let position = 'static';
        if (width == Breakpoints.xs || width === Breakpoints.sm) position = 'fixed';
        return position;
    };

    render() {
        const { classes, width, user } = this.props;
        const { anchorEl, menuDrawer, menuOptions } = this.state;
        const openUserMenu = Boolean(anchorEl);
        const appBarPosition = this.calculatePosition(width);
        return (
            <div className={classes.root}>
                <Grid container className={classes.logosContainer}>
                    <Grid item xs={12} sm={12} md={6}>
                        <div className={classes.logoLeft}>
                            <img src="/Content/img/logo-produce.png" alt="" />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <div className={classes.logoRight}>
                            <img
                                style={{ height: 62 }}
                                src="/Content/img/logo-procuraduria.png"
                                alt=""
                            />
                        </div>
                    </Grid>
                </Grid>
                <AppBar position={appBarPosition}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                            onClick={this.toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.brand}>
                            PROCESOS JUDICIALES
                        </Typography>
                        <div className={classes.flex}>{menuOptions}</div>
                        <div>
                            <Button
                                variant="fab"
                                className={classes.fab}
                                color="secondary"
                                onClick={this.handleUserMenu}
                            >
                                <PersonIcon />
                            </Button>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                open={openUserMenu}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.handleClose}>
                                    {user.NombreParaMostrar}
                                </MenuItem>
                                <MenuItem onClick={this.logout}>Cerrar Sesión</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer open={this.state.showDrawer} onClose={this.toggleDrawer(false)}>
                    <div
                        style={{ width: 250 }}
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer(false)}
                        onKeyDown={this.toggleDrawer(false)}
                    >
                        <div className={classes.logoLeft}>
                            <Typography
                                color="primary"
                                variant="headline"
                                className={classes.appNameText}
                            >
                                <img src="/Content/img/logo-procuraduria.png" alt="" />
                            </Typography>
                        </div>
                        <Divider />

                        <List component="nav">{menuDrawer}</List>
                    </div>
                </Drawer>
            </div>
        );
    }
}

HeaderProduce.propTypes = {
    classes: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
    menuOptions: PropTypes.array.isRequired
};

export default withStyles(styles)(withWidth()(HeaderProduce));
