export const cardStatusMap: Map<string, string> = new Map([
    ['draft', 'warning'],
    ['open', 'primary'],
    ['closed', 'success'],
    ['cancelled', 'danger']
])

export const iconStatusMap: Map<string, string> = new Map ([
    ['draft', 'clipboard-outline'],
    ['open', 'clock-outline'],
    ['closed', 'checkmark-circle-2-outline'],
    ['cancelled', 'close-outline']
])

export const labelStatusMap: Map<string, string> = new Map ([
    ['draft', 'Borrador'],
    ['open', 'Abierto'],
    ['closed', 'Realizado'],
    ['cancelled', 'Cancelado']
])