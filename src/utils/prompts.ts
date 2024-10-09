import { getFullCurrentDate } from "../utils/currentDate"

const PROMPT_FILTER_SEARCH = `**HABLAR**: Selecciona esta acción si el cliente parece querer hacer una pregunta o necesita más información en general.
**BUSCAR**: Selecciona esta acción si el cliente muestra intención de buscar o consultar su cuenta de pagos, deudas, etc.
**CAMBIAR**: Selecciona esta opción si el cliente muestra intención de reagendar una cita existente o cancelarla.

### Instrucciones ###

Por favor, clasifica la siguiente conversación según la intención del usuario.`

const PROMPT_FILTER_DATE = `
### Contexto
Eres un asistente de inteligencia artificial. Tu propósito es determinar la fecha y hora que el cliente quiere, en el formato yyyy/MM/dd HH:mm:ss.

### Fecha y Hora Actual:
{CURRENT_DAY}

Asistente: "{respuesta en formato (yyyy/MM/dd HH:mm:ss)}"`;

const PROMPT_GET_NAME = `
### Contexto
Eres un asistente de inteligencia artificial. Tu propósito es determinar el nombre del cliente y devolverlo con un formato todo en mayusculas y sin aceentos.

Asistente: "{respuesta en formato (nombre del cliente en mayusculas y sin acentos)}"`;

const PROMPT_FILTER_TYPE = `
**VALORACIÓN**: Selecciona esta acción si el cliente parece o dice querer hacer una cita de valoración, revaloracion, test epigenético o infiltración.
**TERAPIA**: Selecciona esta acción si el cliente parece querer hacer una cita de terapia, sesión de fisioterpia o similares.
**EPIGENETICO**: Selecciona esta acción si el cliente parece querer hacer una cita de test epigenético.
**MASAJE**: Selecciona esta acción si el cliente parece querer hacer una cita de masaje o similares.
**OTRO**: Selecciona esta acción si no queda claro el tipo de cita que el cliente quiere.

### Instrucciones ###

Por favor, clasifica la siguiente conversación según la intención del usuario.`;

const PROMPT_FILTER_ACTION = `
**REAGENDAR**: Selecciona esta acción si el cliente parece o dice querer reagendar o cambiar la fecha de su cita.
**CANCELAR**: Selecciona esta acción si el cliente parece o dice querer cancelar o posponer indefinidamente su cita.
**OTRO**: Selecciona esta acción si no queda claro el tipo de acción que el cliente quiere.

### Instrucciones ###

Por favor, clasifica la siguiente conversación según la intención del usuario.`;

const PROMPT_FILTER_PERSON = `
**MISMO**: Selecciona esta acción si el cliente parece o dice que se refiere a el mismo, por ejemplo: "Para mi".
**DIFERENTE**: Selecciona esta acción si el cliente parece o dice que se refiere a alguien más, por ejemplo: "Para mi papá".
**OTRO**: Selecciona esta acción si no queda claro a quién se refiere el cliente.

### Instrucciones ###

Por favor, clasifica la siguiente conversación según la intención del usuario.`;

const generatePromptFiltersearch = () => {
    return PROMPT_FILTER_SEARCH;
}

const generatePromptFilter = () => {
    const nowDate = getFullCurrentDate();
    const mainPrompt = PROMPT_FILTER_DATE.replace('{CURRENT_DAY}', nowDate);
       
    return mainPrompt;
}

const generatePromptName = () => {
    return PROMPT_GET_NAME;
}

const generatePromptType = () => {
    return PROMPT_FILTER_TYPE;
}

const generatePromptAction = () => {
    return PROMPT_FILTER_ACTION;
}

const generatePromptPerson = () => {
    return PROMPT_FILTER_PERSON;
}

export { generatePromptFiltersearch, generatePromptFilter, generatePromptType, generatePromptAction, generatePromptPerson, generatePromptName }