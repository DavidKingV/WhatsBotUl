import { getFullCurrentDate } from "../utils/currentDate"

const PROMPT_FILTER_SEARCH = `**HABLAR**: Selecciona esta acción si el cliente parece querer hacer una pregunta o necesita más información en general.
**BUSCAR**: Selecciona esta acción si el cliente muestra intención de buscar o consultar su cuenta de pagos, deudas, etc.
**AGENTE**: Selecciona esta accion si el cliente muestra intencion de contactarse o ser atendido por un agente humano. Lo debe expresar, no trates de intuirlo.

### Instrucciones ###

Por favor, clasifica la siguiente conversación según la intención del usuario.`

const PROMPT_FILTER_RFC = `**SUCCESS**: Selecciona esta opción si el formato del RFC es correcto.
**ERROR**: Selecciona esta opción si el formato del RFC es incorrecto.

### Instrucciones ###
Tu propósito es determinar la si el formato del RFC proporcionado por el cliente es correcto. Recuerda que el formato del RFC en México consta de 13 caracteres.`;

const PROMPT_FILTER_AFIRMATION = `**SI**: Selecciona esta opción si el cliente parece dar una respuesta afirmativa, ya sea con una frase, oración o palabra. Como por ejemplo "Si", "De acuerdo", "Esta bien", "Perfecto", etc.
**NO**: Selecciona esta opción si el cliente parece dar una respuesta negativa, ya sea con uan frase, oración o palabra. Como por ejemplo: "No", "No gracias", "No quiero", "Preferiria que no", etc.
**OTRO**: Selecciona esta opcion si no te es posible determinar si la respuesta del cliente es negativa o positiva y/o es algo ambigua. 

### Instrucciones ###
Tu propósito es determinar la respuesa es afirmativa, negativa o de otra indole. Solo debes responder con las intrucciones dadas.`;

const generatePromptFilterSearch = () => {
    return PROMPT_FILTER_SEARCH;
}

const generatePromptFilterRFC = () => {
    return PROMPT_FILTER_RFC;
}

const generatePromptFilterAfirmation = () => {
    return PROMPT_FILTER_AFIRMATION;
}


export { generatePromptFilterSearch, generatePromptFilterRFC, generatePromptFilterAfirmation}