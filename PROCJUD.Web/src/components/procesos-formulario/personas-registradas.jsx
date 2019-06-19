import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    chip: {
        margin: theme.spacing.unit / 2,
        fontSize: theme.typography.fontSize - 3
    },
    textEmpty: {
        color: '#999'
    },
    buttonBuscaPersona: {
        margin: theme.spacing.unit,
        marginLeft: 10 * theme.spacing.unit,
        fontSize: theme.typography.fontSize - 1
    },
    typography: {
        flex: '1'
    },
    toolbar: {
        paddingLeft: 0,
        paddingRight: 0
    },
    errorText: {
        fontSize: theme.typography.fontSize - 2
    },
    divider: {
        marginTop: 10
    }
});

const PersonasRegistradas = ({
    classes,
    personas,
    onDeletePersona,
    onClickBuscarPersona,
    errors,
    disabled
}) => (
    <div>
        <Toolbar className={classes.toolbar}>
            <Typography
                color={errors.personas == null ? 'inherit' : 'error'}
                variant="subheading"
                className={classes.typography}
            >
                Personas *
                {errors.personas != null && (
                    <div className={classes.errorText}>{errors.personas}</div>
                )}
            </Typography>
            {!disabled && (
                <div>
                    <Button
                        aria-label="Add"
                        color="primary"
                        className={classes.buttonBuscaPersona}
                        onClick={onClickBuscarPersona}
                    >
                        <AddIcon /> Agregar Persona
                    </Button>
                </div>
            )}
        </Toolbar>

        <div>
            {personas.length == 0 && (
                <span className={classes.textEmpty}>No hay personas ingresadas</span>
            )}
            {personas.map((item, i) => (
                <Chip
                    key={i}
                    label={`${item.razonsocial} - ${item.descripcion_condicion}`}
                    onDelete={disabled ? null : onDeletePersona(item)}
                    className={classes.chip}
                />
            ))}
        </div>
        <Divider className={classes.divider} />
    </div>
);

PersonasRegistradas.defaultProps = {
    disabled: false
};

PersonasRegistradas.propTypes = {
    disabled: PropTypes.bool
};

export default withStyles(styles)(PersonasRegistradas);
