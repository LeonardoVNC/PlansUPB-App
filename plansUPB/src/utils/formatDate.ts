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

export const formatSimpleDateHour = (d: Date) => {
    return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }) + ' - ' +
        d.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
};

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

export const getRelativeDate = (date: Date): string => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Pasado';
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays <= 7) return `En ${diffDays} días`;
    return formatFullDateHour(date);
};
