import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import { withStyles } from '@material-ui/core/styles';

const styles = {};

const ActionsAdministraInstancia = ({ instancia, onClickDetalle, onClickFinalizar, readonly }) => (
    <div>
        {!readonly &&
            instancia.estaPendiente && (
                <IconButton title="Finalizar" onClick={onClickFinalizar}>
                    <LockIcon />
                </IconButton>
            )}

        <IconButton
            title={!readonly && instancia.estaPendiente ? 'Editar' : 'Ver detalle'}
            onClick={onClickDetalle}
        >
            {!readonly && instancia.estaPendiente ? <EditIcon /> : <Icon>description</Icon>}
        </IconButton>
    </div>
);

export default withStyles(styles)(ActionsAdministraInstancia);
