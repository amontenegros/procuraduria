import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
    flex: {
        flexGrow: 1
    },
    searchButton: {
        color: '#d5d5d5'
    },
    textField: {
        width: 250,
        backgroundColor: '#c20000',
        color: '#d5d5d5',
        padding: 5,
        paddingLeft: 20,
        fontSize: 16,
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
    },
    textFieldFocused: {
        width: 400
    }
});

class WraperSearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numero: ''
        };
    }

    handleChangeFilter = e => {
        this.setState({ numero: e.target.value });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.search();
    };

    search = () => {
        this.props.onSearch(this.state.numero);
    };

    onOpen = () => {
        this.setState({ numero: this.props.defaultNumber || '' }, () => {
            if (this.props.searchOnInit) this.search();
        });
    };

    render() {
        const { numero } = this.state;
        const { classes, anchor, open, children, inputPlaceholder, loading } = this.props;
        return (
            <div>
                <Drawer
                    anchor={anchor}
                    open={open}
                    onClose={this.props.onClose}
                    disableBackdropClick
                    disableEscapeKeyDown
                    onRendered={this.onOpen}
                >
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <form onSubmit={this.handleSubmit} className={classes.flex}>
                                <Input
                                    autoFocus
                                    placeholder={inputPlaceholder}
                                    disableUnderline
                                    className={classes.textField}
                                    classes={{ focused: classes.textFieldFocused }}
                                    onChange={this.handleChangeFilter}
                                    value={numero}
                                    disabled={loading}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                type="submit"
                                                className={classes.searchButton}
                                                aria-label="Search numero"
                                                disabled={loading}
                                            >
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </form>
                            <IconButton variant="fab" color="inherit" onClick={this.props.onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    {children}
                </Drawer>
            </div>
        );
    }
}
WraperSearchBox.defaultProps = {
    anchor: 'top',
    inputPlaceholder: 'Buscar',
    searchOnInit: false
};

WraperSearchBox.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    anchor: PropTypes.string,
    children: PropTypes.object.isRequired,
    inputPlaceholder: PropTypes.string,
    loading: PropTypes.bool,
    defaultNumber: PropTypes.string,
    searchOnInit: PropTypes.bool
};

export default withStyles(styles)(WraperSearchBox);
