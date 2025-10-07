export const formatFullDateHour = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export const formatWeekDay = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long'
    });
};

export const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

export const formatHour = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
};