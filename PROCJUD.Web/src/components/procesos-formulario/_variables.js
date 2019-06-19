import {
    ENUM_FORM_TYPE
} from "../../constants/enums";

export const INITIAL_STATE = {
    _type: ENUM_FORM_TYPE.CREATE,
    _showNotFoundComponent: false,
    _showErrorComponent: false,
    _modelLoaded: false,
    _readonly: false,

    openPromptOnExit: true,

    openBoxPersona: false,
    loading: false,
    loadingTipoProceso: false,
    loadingNaturaleza: false,
    loadingInstancia: false,
    loadingPlazo: false,
    openInformacionHistorica: false,

    errors: {
        materia: null
    },

    enumerables: {
        naturalezas: [],
        tiposProceso: [],
        materias: [],
        tiposReponsabilidad: [],
        opd: [],
        situacionPersona: [],
        abogados: [],
        etapasProcesales: [],
        instancias: [],
        plazos: [],
        condiciones: [],
        tiposMonto: []
    },
    form: {
        id_naturaleza: '',
        id_tipo_proceso: '',
        materia: '',
        sector: 'PESCA',
        id_opd: '',
        id_tipo_responsabilidad: '',
        personas: [],
        id_abogado: '',
        id_etapa_procesal: '',
        fecvenc: null,
        fechaVencimiento: null,
        resoluciones: [],
        embarcaciones: [],
        plantas: [],
        proceso_instancia: [
            /*{
                        id_tipo_instancia: '',
                        nombre_instancia: '',
                        numero_instancia: '',
                        fecha_inicio: null,
                        proceso_plazo: [{
                            id_plazo: '',
                            fecha_inicio: null
                        }],
                        proceso_instancia_documento: []*/
        ],
        _instancia: {
            id_tipo_instancia: '',
            nombre_instancia: '',
            numero_instancia: '',
            fecha_inicio: null,
            id_plazo: '',
            documentos: []
        }
    }
};