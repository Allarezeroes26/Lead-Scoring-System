export interface Lead {
    age: number
    job?: string
    marital?: string
    education?: string
    default?: boolean
    balance: number
    housing?: boolean
    loan: boolean
    contact?: string
    day: number
    month: string
    duration: number
    campaign: number
    pdays: number
    previous: number
    poutcome?: string
}

export interface LeadPrediction {
    score: number
    status: "Hot" | "Warm" | "Cold"
}