export interface SavePurchases {
    save: (purchases: Array<SavePurchases.Params>) => Promise<void>
}

// type PurchaseModel = {
//     id: string
//     date: Date
//     value: number
// }

export namespace SavePurchases {
    export type Params = {
        id: string
        date: Date
        value: number
    }
}