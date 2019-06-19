import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import CustomSnackBarContent from './custom-snackbar-content';

const Toast = ({ open, variant, message, onClose }) => (
    <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        ContentProps={{
            'aria-describedby': 'message-id',
        }}
        autoHideDuration={2500}
        onClose={onClose}
    >
        <CustomSnackBarContent
            onClose={onClose}
            variant={variant}
            message={<span id="message-id">{message}</span>} />
    </Snackbar>
)

Toast.propTypes = {
    open: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Toast;