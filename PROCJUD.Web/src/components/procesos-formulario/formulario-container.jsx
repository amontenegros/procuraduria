import React, { Component } from 'react';
import AppContainer from '../_layout/app-container';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TitleActionButtons from './title-action-buttons';
import FormularioProceso from './formulario-proceso';
import BoxBuscaPersona from './box-busca-persona';
import LinearProgress from '@material-ui/core/LinearProgress';
import update from 'immutability-helper';
import { INITIAL_STATE } from './_variables';
import {
    FetchCondiciones,
    FetchOpd,
    FetchMaterias,
    FetchNaturalezas,
    FetchTiposProcesos,
    FetchEtapasProcesales,
    FetchTiposResponsabilidades,
    FetchAbogados,
    FetchInstancias,
    FetchPlazos,
    FetchTiposMontos
} from '../../api/enumerables';
import Axios from 'axios';
import { ENUM_FORM_TYPE } from '../../constants/enums';
import {
    Save as SaveProceso,
    Get as GetProceso,
    Update as UpdateProceso,
    SavePersona,
    DeletePersona,
    SaveResolucion,
    DeleteResolucion,
    SaveEmbarcacion,
    DeleteEmbarcacion,
    SavePlanta,
    DeletePlanta,
    SaveInstancia,
    UpdateInstancia,
    FinalizaInstancia
} from '../../api/proceso';
import { Prompt } from 'react-router';
import { dateFormat, ConvertStringToMoment } from '../../constants/date';
import NotFound from '../_layout/not-found';
import InternalError from '../_layout/internal-error';
import { CheckInArray } from '../../constants/functions';
import { globalStyles } from '../../constants/styles';
import TitleBar from '../_common/title-bar';

const styles = theme => ({
    textField: {
        width: '100%',
        margin: 0
    },
    datePicker: {
        margin: 2
    },
    card: {
        overflow: 'inherit'
    },
    loaderContainer: {
        height: 5
    },
    footerButtonsContainer: {
        marginTop: 10,
        textAlign: 'right'
    },
    ContainerTitle: globalStyles.ContainerTitle
});

const ProccessResponse = form => {
    form.fechaVencimiento = form.fecvenc ? ConvertStringToMoment(form.fecvenc, dateFormat) : null;
    let formString = JSON.stringify(form).replace(/null/g, '""');
    return JSON.parse(formString);
};

class FormularioContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    buildTitle = () => {
        const numero = this.state.form.correlativo ? ` ${this.state.form.correlativo}` : '';
        return (this.props.match.params.id ? '' : 'NUEVO ') + 'PROCESO JUDICIAL' + numero;
    };

    onSubmit = e => {
        e.preventDefault();
    };

    save = () => {
        this.setState({ loading: true });
        switch (this.state._type) {
            case ENUM_FORM_TYPE.CREATE:
                this.SaveForm();
                break;
            case ENUM_FORM_TYPE.UPDATE:
                this.UpdateForm();
                break;
        }
    };

    SaveForm() {
        SaveProceso(this.state.form)
            .then(resp => {
                this.props.toast.open(resp.msg);
                this.setState({ loading: false, openPromptOnExit: false }, () => {
                    this.props.history.push('/');
                });
            })
            .catch(err => {
                this.setState({ loading: false });
                if (err.data.errors) this.setState({ errors: err.data.errors });
                this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
            });
    }

    UpdateForm() {
        UpdateProceso(this.props.match.params.id, this.state.form)
            .then(resp => {
                this.props.toast.open(resp.msg);
                this.setState({ loading: false });
            })
            .catch(err => {
                this.setState({ loading: false });
                if (err.data.errors) this.setState({ errors: err.data.errors });
                this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
            });
    }

    handleOpenInformacionHistorica = bool => e => {
        this.setState({ openInformacionHistorica: bool });
    };

    handleInputChange = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const { form } = this.state;
        this.setState({ form: { ...form, [name]: value } });
    };

    handleSelectChange = e => {
        switch (e.target.name) {
            case 'materia':
                this.changeMateria(e.target.value);
                break;
            case 'id_tipo_proceso':
                this.changeTipoProceso(e.target.value);
                break;
        }
    };

    handleDateChange = name => date => {
        const { form } = this.state;

        const new_form = update(form, {
            [name]: { $set: date },
            fecvenc: {
                $apply: x =>
                    name === 'fechaVencimiento' ? (!date ? null : date.format(dateFormat)) : x
            }
        });

        this.setState({ form: new_form });
    };

    handleBuscarPersona = bool => e => {
        this.setState({ openBoxPersona: bool });
    };

    addPersona = (persona, condicion) => {
        const { form, _type } = this.state;

        if (CheckInArray(form.personas, x => x.id_persona === persona.id_persona)) {
            this.props.toast.open('La persona ya ha sido ingresada', 'warning');
            return false;
        }

        const new_persona = {
            razonsocial: persona.nombre,
            id_persona: persona.id_persona,
            condicion: condicion.id_condicion,
            descripcion_condicion: condicion.descripcion
        };

        if (_type == ENUM_FORM_TYPE.UPDATE) {
            this.setState({ loading: true });
            SavePersona(this.props.match.params.id, new_persona)
                .then(resp => {
                    this.props.toast.open(resp.msg);
                    this.setState({ form: { ...form, personas: resp.data.personas } });
                })
                .catch(err => {
                    this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        } else {
            const new_form = {
                ...form,
                personas: [...form.personas, new_persona]
            };

            this.setState({
                form: new_form
            });
        }
    };

    removePersona = persona => e => {
        const { form, _type } = this.state;
        const personas = [...form.personas];

        if (persona.id && _type == ENUM_FORM_TYPE.UPDATE) {
            this.setState({ loading: true });
            DeletePersona(this.props.match.params.id, persona.id)
                .then(resp => {
                    this.props.toast.open(resp.msg);
                    this.setState({ form: { ...form, personas: resp.data.personas } });
                })
                .catch(err => {
                    this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        } else {
            personas.splice(personas.indexOf(persona), 1);
            this.setState({ form: { ...form, personas: personas } });
        }
    };

    addResolucion = resolucion => {
        const { form, _type } = this.state;

        if (CheckInArray(form.resoluciones, x => x.id_resolucion === resolucion.id)) {
            this.props.toast.open('La resolución ya ha sido ingresada', 'warning');
            return false;
        }

        const new_resolucion = {
            id_resolucion: resolucion.id,
            numero: resolucion.nro_resol
        };

        if (_type == ENUM_FORM_TYPE.UPDATE) {
            this.setState({ loading: true });
            SaveResolucion(this.props.match.params.id, new_resolucion)
                .then(resp => {
                    this.props.toast.open(resp.msg);
                    this.setState({ form: { ...form, resoluciones: resp.data.resoluciones } });
                })
                .catch(err => {
                    this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        } else {
            const new_form = {
                ...form,
                resoluciones: [...form.resoluciones, new_resolucion]
            };

            this.setState({ form: new_form });
        }
    };

    removeResolucion = resolucion => e => {
        const { form, _type } = this.state;
        const resoluciones = [...form.resoluciones];

        if (resolucion.id && _type == ENUM_FORM_TYPE.UPDATE) {
            this.setState({ loading: true });
            DeleteResolucion(this.props.match.params.id, resolucion.id)
                .then(resp => {
                    this.props.toast.open(resp.msg);
                    this.setState({ form: { ...form, resoluciones: resp.data.resoluciones } });
                })
                .catch(err => {
                    this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        } else {
            resoluciones.splice(resoluciones.indexOf(resolucion), 1);
            this.setState({ form: { ...form, resoluciones: resoluciones } });
        }
    };

    addEmbarcacion = embarcacion => {
        const { form, _type } = this.state;

        if (CheckInArray(form.embarcaciones, x => x.id_emb === embarcacion.id_emb)) {
            this.props.toast.open('La embarcación ya ha sido ingresada', 'warning');
            return false;
        }

        const new_embarcacion = {
            id_emb: embarcacion.id_emb,
            matricula: embarcacion.matricula_emb,
            nombre: embarcacion.nombre_emb
        };

        if (_type == ENUM_FORM_TYPE.UPDATE) {
            this.setState({ loading: true });
            SaveEmbarcacion(this.props.match.params.id, new_embarcacion)
                .then(resp => {
                    this.props.toast.open(resp.msg);
                    this.setState({ form: { ...form, embarcaciones: resp.data.embarcaciones } });
                })
                .catch(err => {
                    this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        } else {
            const new_form = {
                ...form,
                embarcaciones: [...form.embarcaciones, new_embarcacion]
            };

            this.setState({ form: new_form });
        }
    };

    removeEmbarcacion = embarcacion => e => {
        const { form, _type } = this.state;
        const embarcaciones = [...form.embarcaciones];
        if (embarcacion.id && _type == ENUM_FORM_TYPE.UPDATE) {
            this.setState({ loading: true });
            DeleteEmbarcacion(this.props.match.params.id, embarcacion.id)
                .then(resp => {
                    this.props.toast.open(resp.msg);
                    this.setState({ form: { ...form, embarcaciones: resp.data.embarcaciones } });
                })
                .catch(err => {
                    this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        } else {
            embarcaciones.splice(embarcaciones.indexOf(embarcacion), 1);
            this.setState({ form: { ...form, embarcaciones: embarcaciones } });
        }
    };

    addPlanta = planta => {
        const { form, _type } = this.state;

        if (CheckInArray(form.plantas, x => x.id_persona === planta.id)) {
            this.props.toast.open('La planta ya ha sido ingresada', 'warning');
            return false;
        }

        const new_planta = {
            id_persona: planta.id,
            nombre: planta.nombre
        };

        if (_type == ENUM_FORM_TYPE.UPDATE) {
            this.setState({ loading: true });
            SavePlanta(this.props.match.params.id, new_planta)
                .then(resp => {
                    this.props.toast.open(resp.msg);
                    this.setState({ form: { ...form, plantas: resp.data.plantas } });
                })
                .catch(err => {
                    this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        } else {
            const new_form = {
                ...form,
                plantas: [...form.plantas, new_planta]
            };

            this.setState({ form: new_form });
        }
    };

    removePlanta = planta => e => {
        const { form, _type } = this.state;
        const plantas = [...form.plantas];
        if (planta.id && _type == ENUM_FORM_TYPE.UPDATE) {
            this.setState({ loading: true });
            DeletePlanta(this.props.match.params.id, planta.id)
                .then(resp => {
                    this.props.toast.open(resp.msg);
                    this.setState({ form: { ...form, plantas: resp.data.plantas } });
                })
                .catch(err => {
                    this.props.toast.open(err.data.msg || 'Ocurrió un error interno', 'error');
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        } else {
            plantas.splice(plantas.indexOf(planta), 1);
            this.setState({ form: { ...form, plantas: plantas } });
        }
    };

    handleInputInstanciaChange = e => {
        const target = e.target;
        const { form } = this.state;
        const new_instancia = update(form._instancia, {
            id_plazo: {
                $apply: v => (target.name === 'id_tipo_instancia' ? '' : v)
            },
            [target.name]: { $set: target.value }
        });

        if (target.name === 'id_tipo_instancia') this.loadPlazos(target.value);

        this.setState({ form: { ...form, _instancia: new_instancia } });
    };

    handleDateInstanciaChange = name => date => {
        const { form } = this.state;

        const new_instancia = update(form._instancia, { [name]: { $set: date } });

        this.setState({ form: { ...form, _instancia: new_instancia } });
    };

    handleAddDocumentoSimpleInstancia = documento => {
        const { form } = this.state;

        const new_instancia = update(form._instancia, {
            documentos: { $push: [documento] }
        });

        this.setState({ form: { ...form, _instancia: new_instancia } });
    };

    handleRemoveDocumentoSimpleInstancia = documento => {
        const { form } = this.state;

        const pos = form._instancia.documentos.indexOf(documento);

        const new_instancia = update(form._instancia, {
            documentos: { $splice: [[pos, 1]] }
        });

        this.setState({ form: { ...form, _instancia: new_instancia } });
    };

    addInstancia = instancia => {
        this.setState({ loading: true });
        return SaveInstancia(this.props.match.params.id, instancia)
            .then(resp => {
                const { form } = this.state;
                this.setState({
                    form: { ...form, proceso_instancia: resp.data.instancias },
                    loading: false
                });
                this.props.toast.open(resp.msg);
            })
            .catch(err => {
                this.setState({ loading: false });
                this.props.toast.open(err.data.msg, 'error');
                throw err;
            });
    };

    updateInstancia = (id_proceso_instancia, instancia) => {
        this.setState({ loading: true });
        return UpdateInstancia(this.props.match.params.id, id_proceso_instancia, instancia)
            .then(resp => {
                const { form } = this.state;
                this.setState({
                    form: { ...form, proceso_instancia: resp.data.instancias },
                    loading: false
                });
                this.props.toast.open(resp.msg);
            })
            .catch(err => {
                this.setState({ loading: false });
                this.props.toast.open(err.data.msg, 'error');
                throw err;
            });
    };

    finalizaInstancia = (id_proceso_instancia, form) => {
        this.setState({ loading: true });
        FinalizaInstancia(this.props.match.params.id, id_proceso_instancia, form)
            .then(resp => {
                const { form } = this.state;
                this.setState({
                    form: { ...form, proceso_instancia: resp.data.instancias },
                    loading: false
                });
                this.props.toast.open(resp.msg);
            })
            .catch(err => {
                this.setState({ loading: false });
                this.props.toast.open(err.data.msg, 'error');
                throw err;
            });
    };

    addPlazo = (id_proceso_instancia, plazo) => {};

    removePlazo = (id_proceso_instancia, id_proceso_plazo) => {};

    addDocumentoInstancia = (id_proceso_instancia, documento) => {};

    removeDocumentoInstancia = id_proceso_instancia_documento => {};

    loadEnumerables = () => {
        this.setState({ loading: true });
        const _all = [
            FetchCondiciones(),
            FetchOpd(),
            FetchMaterias(),
            FetchEtapasProcesales(),
            FetchTiposResponsabilidades(),
            FetchAbogados(),
            FetchTiposMontos()
        ];
        const _spread = Axios.spread(
            (
                condiciones,
                opd,
                materias,
                etapasProcesales,
                tiposResponsabilidades,
                abogados,
                tiposMonto
            ) => {
                const { enumerables } = this.state;
                this.setState({
                    enumerables: {
                        ...enumerables,
                        condiciones: condiciones,
                        opd: opd,
                        materias: materias,
                        tiposReponsabilidad: tiposResponsabilidades,
                        etapasProcesales: etapasProcesales,
                        abogados: abogados,
                        tiposMonto: tiposMonto
                    }
                });
            }
        );

        Axios.all(_all)
            .then(_spread)
            .catch(e => console.log(e))
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    loadTiposProceso(id_materia) {
        this.setState({ loadingTipoProceso: true });
        FetchTiposProcesos(id_materia)
            .then(tiposProceso => {
                const { enumerables } = this.state;
                this.setState({
                    enumerables: { ...enumerables, tiposProceso: tiposProceso },
                    loadingTipoProceso: false
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loadingTipoProceso: false });
            });
    }

    loadNaturalezas(id_materia) {
        this.setState({ loadingNaturaleza: true });
        FetchNaturalezas(id_materia)
            .then(naturalezas => {
                const { enumerables } = this.state;
                this.setState({
                    enumerables: { ...enumerables, naturalezas: naturalezas },
                    loadingNaturaleza: false
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loadingNaturaleza: false });
            });
    }

    loadInstancias(id_tipo_proceso) {
        this.setState({ loadingInstancia: true });
        FetchInstancias(id_tipo_proceso)
            .then(instancias => {
                const { enumerables } = this.state;
                this.setState({
                    enumerables: { ...enumerables, instancias: instancias },
                    loadingInstancia: false
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loadingInstancia: false });
            });
    }

    loadPlazos(id_tipo_instancia) {
        this.setState({ loadingPlazo: true });
        FetchPlazos(id_tipo_instancia)
            .then(plazos => {
                const { enumerables } = this.state;
                this.setState({
                    enumerables: { ...enumerables, plazos: plazos },
                    loadingPlazo: false
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loadingPlazo: false });
            });
    }

    changeMateria = value => {
        const { form, enumerables } = this.state;

        const new_instancia = update(form._instancia, {
            id_tipo_instancia: { $set: '' },
            id_plazo: { $set: '' }
        });

        this.setState(
            {
                enumerables: {
                    ...enumerables,
                    naturalezas: [],
                    tiposProceso: [],
                    instancias: [],
                    plazos: []
                },
                form: {
                    ...form,
                    materia: value,
                    id_tipo_proceso: '',
                    id_naturaleza: '',
                    _instancia: new_instancia
                }
            },
            () => {
                this.loadNaturalezas(value);
                this.loadTiposProceso(value);
            }
        );
    };

    changeTipoProceso = value => {
        const { form, enumerables } = this.state;

        const new_instancia = update(form._instancia, {
            id_tipo_instancia: { $set: '' },
            id_plazo: { $set: '' }
        });

        this.setState(
            {
                enumerables: {
                    ...enumerables,
                    instancias: [],
                    plazos: []
                },
                form: {
                    ...form,
                    id_tipo_proceso: value,
                    _instancia: new_instancia
                }
            },
            () => {
                this.loadInstancias(value);
            }
        );
    };

    loadProceso(id) {
        const success = resp => {
            this.setState({
                form: ProccessResponse(resp.data.proceso),
                _modelLoaded: true,
                _readonly: resp.data.proceso._readonly
            });
            this.loadNaturalezas(resp.data.proceso.materia);
            this.loadTiposProceso(resp.data.proceso.materia);
        };

        const error = err => {
            if (err.status === 404 || err.status === 403 || err.status === 401) {
                this.setState({ _showNotFoundComponent: true });
            } else {
                this.setState({ _showErrorComponent: true });
            }
        };

        GetProceso(id)
            .then(success)
            .catch(error);
    }

    handleCloseFormInstancia = () => {
        if (this.state._type === ENUM_FORM_TYPE.UPDATE)
            this.loadProceso(this.props.match.params.id);
    };

    componentDidMount() {
        this.loadEnumerables();
        if (this.props.match.params.id) {
            this.setState({ _type: ENUM_FORM_TYPE.UPDATE, openPromptOnExit: false });
            this.loadProceso(this.props.match.params.id);
        }
    }

    render() {
        const { classes, toast, history } = this.props;
        const {
            _type,
            _modelLoaded,
            _showErrorComponent,
            _showNotFoundComponent,
            _readonly,
            form,
            enumerables,
            loading,
            loadingNaturaleza,
            loadingTipoProceso,
            loadingInstancia,
            loadingPlazo,
            openBoxPersona,
            openPromptOnExit,
            errors,
            openInformacionHistorica
        } = this.state;
        const title = this.buildTitle();

        if (_showNotFoundComponent) return <NotFound history={history} />;
        if (_showErrorComponent) return <InternalError history={history} />;
        if (_type === ENUM_FORM_TYPE.UPDATE && !_modelLoaded)
            return <LinearProgress style={{ height: 8 }} />;

        return (
            <AppContainer responsiveProps={{ lg: 7, md: 11, sm: 12, xs: 12 }}>
                <TitleBar
                    actions={
                        <TitleActionButtons
                            onClickGrabar={this.save}
                            loading={loading}
                            readonly={_readonly}
                        />
                    }
                >
                    {title}
                </TitleBar>

                <Card className={classes.card}>
                    <div className={classes.loaderContainer}>{loading && <LinearProgress />}</div>
                    <CardContent>
                        <form onSubmit={this.onSubmit}>
                            <FormularioProceso
                                type={_type}
                                toast={toast}
                                readonly={_readonly}
                                enumerables={enumerables}
                                errors={errors}
                                form={form}
                                loading={loading}
                                loadingTipoProceso={loadingTipoProceso}
                                loadingNaturaleza={loadingNaturaleza}
                                loadingInstancia={loadingInstancia}
                                loadingPlazo={loadingPlazo}
                                onInputChange={this.handleInputChange}
                                onSelectChange={this.handleSelectChange}
                                onDateChange={this.handleDateChange}
                                onDeletePersona={this.removePersona}
                                onClickBuscarPersona={this.handleBuscarPersona(true)}
                                onSelectResolucion={this.addResolucion}
                                onDeleteResolucion={this.removeResolucion}
                                onSelectEmbarcacion={this.addEmbarcacion}
                                onDeleteEmbarcacion={this.removeEmbarcacion}
                                onSelectPlanta={this.addPlanta}
                                onDeletePlanta={this.removePlanta}
                                onInputInstanciaChange={this.handleInputInstanciaChange}
                                onDateInstanciaChange={this.handleDateInstanciaChange}
                                onAddDocumentoSimpleInstancia={
                                    this.handleAddDocumentoSimpleInstancia
                                }
                                onRemoveDocumentoSimpleInstancia={
                                    this.handleRemoveDocumentoSimpleInstancia
                                }
                                onInputPlazoChange={this.handleInputPlazoChange}
                                onAddInstancia={this.addInstancia}
                                onUpdateInstancia={this.updateInstancia}
                                onAddPlazo={this.addPlazo}
                                onRemovePlazo={this.removePlazo}
                                onAddDocumentoInstancia={this.addDocumentoInstancia}
                                onRemoveDocumentoInstancia={this.removeDocumentoInstancia}
                                onCloseFormInstancia={this.handleCloseFormInstancia}
                                onFinalizaInstancia={this.finalizaInstancia}
                                openInformacionHistorica={openInformacionHistorica}
                                onOpenInformacionHistorica={this.handleOpenInformacionHistorica(
                                    true
                                )}
                                onCloseInformacionHistorica={this.handleOpenInformacionHistorica(
                                    false
                                )}
                            />
                        </form>
                    </CardContent>
                    <div className={classes.footerButtonsContainer}>
                        <TitleActionButtons
                            onClickGrabar={this.save}
                            loading={loading}
                            readonly={_readonly}
                        />
                    </div>
                </Card>
                <BoxBuscaPersona
                    open={openBoxPersona}
                    onClose={this.handleBuscarPersona(false)}
                    onSelectPersona={this.addPersona}
                    listaCondiciones={enumerables.condiciones}
                />
                <Prompt
                    when={openPromptOnExit}
                    message="¿Está seguro de que desea salir? Se descartarán los datos ingresados"
                />
            </AppContainer>
        );
    }
}

export default withStyles(styles)(FormularioContainer);
