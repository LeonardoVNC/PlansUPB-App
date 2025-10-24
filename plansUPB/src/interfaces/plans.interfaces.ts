export interface Plan {
    id: string,
    ownerCode: string,
    title: string,
    category: string,
    place?: {
        name: string,
        lat: number,
        lng: number,
    },
    date: Date,
    description: string,
    cover?: number,
    status: string,
    pollId?: string,
}

export interface PlanConfirmation {
    planId: string,
    userCode: string,
    confirmed?: boolean,
    status?: 'pending' | 'accepted' | 'declined', 
    comment?: string,
    respondedAt?: Date,
}

export interface PlanSave {
    planId: string,
    userCode: string,
}