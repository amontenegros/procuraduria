import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
    chip: {
        margin: theme.spacing.unit / 2,
        fontSize: theme.typography.fontSize - 3,
        maxWidth: '100%'
    },
    textEmpty: {
        color: '#999'
    },
    textEmptyContainer: {
        //textAlign: 'center'
    },
    root: {
        marginTop: 25
    },
    label: {
        overflow: 'hidden'
    }
});

const ContainerResoluciones = ({ classes, resoluciones, onDeleteResolucion, disabled }) => (
    <div className={classes.root}>
        {resoluciones.length == 0 && (
            <div className={classes.textEmptyContainer}>
                <span className={classes.textEmpty}>No hay resoluciones ingresadas</span>
            </div>
        )}
        {resoluciones.map((item, i) => (
            <Chip
                key={i}
                label={`${item.numero}`}
                onDelete={disabled ? null : onDeleteResolucion(item)}
                className={classes.chip}
                classes={{
                    label: classes.label
                }}
            />
        ))}
    </div>
);

const ContainerEmbarcaciones = ({ classes, embarcaciones, onDeleteEmbarcacion, disabled }) => (
    <div className={classes.root}>
        {embarcaciones.length == 0 && (
            <div className={classes.textEmptyContainer}>
                <span className={classes.textEmpty}>No hay embarcaciones ingresadas</span>
            </div>
        )}
        {embarcaciones.map((item, i) => (
            <Chip
                key={i}
                label={`${item.nombre} - ${item.matricula}`}
                onDelete={disabled ? null : onDeleteEmbarcacion(item)}
                className={classes.chip}
                classes={{
                    label: classes.label
                }}
            />
        ))}
    </div>
);

const ContainerPlantas = ({ classes, plantas, onDeletePlanta, disabled }) => (
    <div className={classes.root}>
        {plantas.length == 0 && (
            <div className={classes.textEmptyContainer}>
                <span className={classes.textEmpty}>No hay plantas ingresadas</span>
            </div>
        )}
        {plantas.map((item, i) => (
            <Chip
                key={i}
                label={`${item.nombre}`}
                onDelete={disabled ? null : onDeletePlanta(item)}
                className={classes.chip}
                classes={{
                    label: classes.label
                }}
            />
        ))}
    </div>
);

export const ChipsResoluciones = withStyles(styles)(ContainerResoluciones);
export const ChipsEmbarcaciones = withStyles(styles)(ContainerEmbarcaciones);
export const ChipsPlantas = withStyles(styles)(ContainerPlantas);
