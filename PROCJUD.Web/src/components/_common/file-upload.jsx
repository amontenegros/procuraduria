import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
    root: {
        margin: theme.spacing.unit
    },
    fileInput: {
        display: 'none'
    },
    menu: {
        width: 200
    },
    loaderContainer: {
        height: 5
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    },
    uploadButton: {
        minWidth: 250
    }
});
class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: false
        };
    }

    setError(bool) {
        this.setState({ error: bool });
    }

    setLoading(bool) {
        this.setState({ loading: bool });
    }

    handleChange = event => {
        let file = event.target.files[0];
        event.target.value = null;
        if (file) {
            this.uploadFile(file);
        }
    };

    uploadFile(file) {
        const { route, onSuccess } = this.props;
        this.setError(false);
        this.setLoading(true);
        const data = new FormData();
        data.append('file', file);
        axios
            .post(route, data)
            .then(response => {
                onSuccess(response.data);
            })
            .catch(err => {
                console.log(err.response);
                this.setState({ error: true, errorMessage: err.response.data.msg });
            })
            .finally(() => {
                this.setLoading(false);
            });
    }

    render() {
        const { classes, styles, lite } = this.props;
        const { loading, error, errorMessage } = this.state;

        return (
            <div className={classes.root} style={styles}>
                <FormControl error={error}>
                    <label>
                        <Input
                            accept="application/pdf"
                            id="input-upload-file"
                            type="file"
                            className={classes.fileInput}
                            onChange={this.handleChange}
                            disabled={loading}
                        />
                        {lite ? (
                            <IconButton
                                component="span"
                                color="primary"
                                disabled={loading}
                                color="default"
                            >
                                <CloudUploadIcon />
                            </IconButton>
                        ) : (
                            <div>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    component="span"
                                    color="default"
                                    className={classes.uploadButton}
                                    disabled={loading}
                                >
                                    Subir Archivo <CloudUploadIcon className={classes.rightIcon} />
                                </Button>
                                <div className={classes.loaderContainer}>
                                    {loading && <LinearProgress />}
                                </div>
                            </div>
                        )}
                    </label>
                    {!lite && (
                        <div>
                            {error && (
                                <FormHelperText>
                                    {errorMessage ||
                                        'Ocurrió un error al subir el archivo. Intente nuevamente'}
                                </FormHelperText>
                            )}
                        </div>
                    )}
                </FormControl>
            </div>
        );
    }
}

FileUpload.defaultProps = {
    styles: {},
    lite: false
};

FileUpload.propTypes = {
    classes: PropTypes.object.isRequired,
    route: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    styles: PropTypes.object,
    lite: PropTypes.bool
};

export default withStyles(styles)(FileUpload);
