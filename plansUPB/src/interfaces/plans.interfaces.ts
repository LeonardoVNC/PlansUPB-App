export interface Plan {
    id: string,
    ownerCode: string,
    title: string,
    category: string,
    placeName: string,
    placeLat: number,
    placeLng: number,
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
    comment?: string,
}

export interface PlanSave {
    planId: string,
    userCode: string,
}