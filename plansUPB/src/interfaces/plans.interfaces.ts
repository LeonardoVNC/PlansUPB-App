export interface Plan {
    id: string,
    owner: string;
    title: string,
    description: string,
    date: Date,
    done?: boolean
}

export interface PlanConfirmation {
    planId: string,
    userId: string,
    confirmed?: boolean,
    comment?: string,
}