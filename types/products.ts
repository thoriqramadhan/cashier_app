export interface getAllProductsReturnValue {
    category: string,
    id?: string,
    name: string ,
    stock: string | number,
    price: string | number
}

export interface CartProduct {
    id?: string,
    name: string ,
    qty: number,
    price: number,
    totalPrice: number
}