import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from '../../constants/config';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class Confirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabledButtons: false,
            open: true
        };
    }

    enableButtons() {
        const { disabledButtons } = this.state;
        if (disabledButtons) {
            this.setState({ disabledButtons: false });
        }
    }

    disableButtons() {
        this.setState({ disabledButtons: true });
    }

    handleDismiss = () => {
        this.setState({ open: false });
        this.props.reject(false);
    };

    handleConfirm = () => {
        this.disableButtons();
        this.props.resolve(true);
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.enableButtons();
    };

    render() {
        const { disabledButtons, open } = this.state;
        const { okText, cancelText, children } = this.props;

        return (
            <div>
                <Dialog
                    open={open}
                    onEnter={this.handleOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleDismiss}
                    aria-labelledby="confirm"
                    aria-describedby="confirm dialog"
                >
                    <DialogTitle id="alert-dialog-slide-title">{'Confirmar'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {children}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDismiss} disabled={disabledButtons}>
                            {cancelText || 'Cancelar'}
                        </Button>
                        <Button
                            onClick={this.handleConfirm}
                            disabled={disabledButtons}
                            color="primary"
                        >
                            {okText || 'Ok'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Confirm.propTypes = {
    children: PropTypes.string.isRequired,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    resolve: PropTypes.func.isRequired,
    reject: PropTypes.func.isRequired
};

export default function(confirmation, options = {}) {
    const wrapper = document.body.appendChild(document.createElement('div'));

    const promise = new Promise((resolve, reject) => {
        try {
            ReactDOM.render(
                <MuiThemeProvider theme={theme}>
                    <Confirm dispose={dispose} resolve={resolve} reject={reject} {...options}>
                        {confirmation}
                    </Confirm>
                </MuiThemeProvider>,
                wrapper
            );
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

    function dispose() {
        setTimeout(() => {
            ReactDOM.unmountComponentAtNode(wrapper);
            setTimeout(() => document.body.removeChild(wrapper));
        }, 0);
    }
    // You can pass whatever you want to the component. These arguments will be your Component's props

    return promise.then(
        result => {
            dispose();
            return result;
        },
        result => {
            dispose();
            //return Promise.reject(result);
            return result;
        }
    );
}
