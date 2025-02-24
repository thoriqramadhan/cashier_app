export interface TransactionData {
    id?: string,
    customer_name: string,
    ordered_date: Date,
    transaction_date: Date,
    transaction_status: boolean,
    total_price: string
}

export interface TransactionProductData {
    id: string,
    transaction_id: string,
    product_id: string,
    price: string,
    name: string,
    quantity: string
}