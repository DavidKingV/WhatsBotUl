import { format } from 'date-fns'
import { es } from 'date-fns/locale';

const getFullCurrentDate = (): string => {
    const currentD = new Date();
    const formatDate = format(currentD, 'yyyy/MM/dd HH:mm'); // Formato "dd/MM/yyyy HH:mm:ss"
    const day = format(currentD, 'EEEE', { locale: es }); // Obtener el día de la semana

    return [
        formatDate,
        day,
    ].join(' ')

}

export { getFullCurrentDate }