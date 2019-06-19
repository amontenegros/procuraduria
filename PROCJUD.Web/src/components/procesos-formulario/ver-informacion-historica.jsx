import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    textField: {
        width: '100%'
    }
});

class VerInformacionHistorica extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { classes, proceso, open, onClose } = this.props;
        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={open}
                onClose={onClose}
                aria-labelledby="form-dialog-title"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Información Anterior</DialogTitle>
                <DialogContent>
                    <Grid container spacing={8}>
                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Distrito Judicial"
                                className={classes.textField}
                                value={proceso.sede.distrito_judicial || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Sede"
                                className={classes.textField}
                                value={proceso.sede.descripcion || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} />

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Juzgado Paz"
                                className={classes.textField}
                                value={proceso.juzgado_paz || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Expediente"
                                className={classes.textField}
                                value={proceso.expediente_juzgado_paz || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Especialista"
                                className={classes.textField}
                                value={proceso.especialista_juzgado_paz || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Juzgado/Fiscalía"
                                className={classes.textField}
                                value={proceso.juzgado || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Expediente"
                                className={classes.textField}
                                value={proceso.exp1 || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Especialista"
                                className={classes.textField}
                                value={proceso.especialista_juzgado_fiscalia || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Sala Superior"
                                className={classes.textField}
                                value={proceso.sala || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Expediente"
                                className={classes.textField}
                                value={proceso.exp2 || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Especialista"
                                className={classes.textField}
                                value={proceso.especialista_sala_superior || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Corte Suprema"
                                className={classes.textField}
                                value={proceso.corte || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Expediente"
                                className={classes.textField}
                                value={proceso.exp3 || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Especialista"
                                className={classes.textField}
                                value={proceso.especialista_corte_suprema || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Tribunal"
                                className={classes.textField}
                                value={proceso.tribunal || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Expediente"
                                className={classes.textField}
                                value={proceso.expediente_tribunal || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                label="Especialista"
                                className={classes.textField}
                                value={proceso.especialista_tribunal || '-'}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                multiline
                                label="Etapas del proceso"
                                className={classes.textField}
                                value={
                                    proceso.etapas.length == 0
                                        ? '-'
                                        : proceso.etapas
                                              .map(
                                                  x =>
                                                      x.descripcion + ' - Anotación: ' + x.anotacion
                                              )
                                              .join('\n')
                                }
                                disabled={true}
                                rows={4}
                            />
                        </Grid>

                        {/* 

                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                multiline
                                label="Anotación"
                                className={classes.textField}
                                value={proceso.anotacion}
                                disabled={true}
                                rows={4}
                            />
                        </Grid> */}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type="button" color="primary" onClick={onClose}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(VerInformacionHistorica);
