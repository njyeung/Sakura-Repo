import { MenuItem } from "../menu/MenuItem"

export interface Order {
    email : string
    phone : string
    name : string
    notes : string
    items : number[]
    individualNotes: string[]
    tip: number
}