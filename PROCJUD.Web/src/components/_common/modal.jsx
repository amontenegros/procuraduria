import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "../../constants/config";


/*
El componente que se renderice recibe las siguientes propiedades adicionales:
close: cierra el modal enviando el valor true
dismiss:  cierra el modal enviando el valor false
*/

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
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

    handleClose = () => {
        this.props.resolve(true);
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.enableButtons();
    };

    setLoading = bool => () => {
        this.setState({ loading: bool });
    };

    render() {
        const { disabledButtons, open, loading } = this.state;
        const { classes, title, props, size, modalProps } = this.props;

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
                    <DialogTitle>{title}</DialogTitle>
                    <this.props.component
                        close={this.handleClose}
                        dismiss={this.handleDismiss}
                        //showLoading={this.setLoading(true)}
                        //hideLoading={this.setLoading(false)}
                        //loading={loading}
                        {...props}
                    />
                </Dialog>
            </div>
        );
    }
}

Modal.propTypes = {
    resolve: PropTypes.func.isRequired,
    reject: PropTypes.func.isRequired,
    title: PropTypes.any,
    props: PropTypes.object
};

/*options: {
    title: titulo del modal,
    component: componente a renderizar,
    props: propiedades que se pasan al componente
}
*/
export default function (options = {}) {
    const wrapper = document.body.appendChild(document.createElement("div"));

    const promise = new Promise((resolve, reject) => {
        try {
            ReactDOM.render(
                <MuiThemeProvider theme={theme}>
                    <Modal dispose={dispose} resolve={resolve} reject={reject} {...options}></Modal>
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

