import {openDB} from 'idb'
import { Property } from './model';
const DB_NAME= "PropertyDB"

initDB().then(()=>{
    console.log("Database inititilized!")
})

export async function insertProperty(property:Property) {
    const db = await openDB(DB_NAME,1)
    await db.put("property",property)
    console.log("1 property inserted!", property)
}

export async function getAllProperty() {
    const db = await openDB(DB_NAME,1)
    return await db.getAll("property")
}

export async function updateProperty(updateProperty:Property) {
    const db = await openDB(DB_NAME, 1)
    const property= await db.transaction("property").
          objectStore("property").get(updateProperty.id!) as Property
    property.type = updateProperty.type
    property.bedroom = updateProperty.bedroom
    property.ListingDate = updateProperty.ListingDate
    property.rent = updateProperty.rent
    property.furniture = updateProperty.furniture
    property.notes = updateProperty.notes
    property.reporter =  updateProperty.reporter
    await db.put("property",property);
  }
  
  export async function deleteProperty(id:number) {
    const db = await openDB(DB_NAME, 1)
    await db.delete("property",id)
  }
  
  export async function getPropertyById(id:number) {
    const db = await openDB(DB_NAME, 1);
    const cus= await db.transaction("property").objectStore("property").get(id);
    return cus;
  }

async function initDB(){
    const db = await openDB(DB_NAME,1,{
        upgrade(db){
            const store = db.createObjectStore('property', {
                keyPath: 'id',
                autoIncrement: true,
              });
        
        }
    })
}