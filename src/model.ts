export interface Property{
    id?: number,
    address: string,
    type: string,
    bedroom: string, //turned out using number here is not wise since the database is not supported
    ListingDate: string,
    rent: number,
    furniture: string,
    notes: string,
    reporter: string
}