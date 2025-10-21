export interface Plan {
    id: string,
    ownerCode: string,
    title: string,
    categoryId: string,
    placeId?: string, 
    date: Date,
    description: string,
    cover?: number,
    statusId: string,
    pollId?: string,
}

export interface PlanConfirmation {
    planId: string,
    userCode: string,
    confirmed?: boolean,
    comment?: string,
}

export interface PlanStatus {
    id: string,
    description: string,
}