import { useIonToast, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, IonSearchbar, IonTextarea, IonDatetime } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import {insertProperty, getAllProperty, updateProperty } from '../databaseHandler';
import { Property } from '../model';


const Create: React.FC = () => {

  const [address, setAddress] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [bedroom, setBedroom] = useState<string>('')
  const [ListingDate, setListingDate] = useState<string>('')
  const [rent, setRent] = useState<string>('')
  const [furniture, setFurniture] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [reporter, setReporter] = useState<string>('')

  const [refresh,setRefresh] = useState(false)

  const [checkValid,setCheckValid] = useState(false)

  const [present, dismiss] = useIonToast();

  const [properties, setProperties] = useState<Property[]>([])

  function checkNotSet()
  {
    var errorArray = new Array
    if (type.length==0 && checkValid) {
      errorArray.push('type')
    }
    if (address.length==0 && checkValid) {
      errorArray.push('address')
    }
    if (bedroom.length==0 && checkValid) {
      errorArray.push('bedroom')
    }
    if (rent.length==0 && checkValid) {
      errorArray.push('rent')
    }
    if (reporter.length==0 && checkValid) {
      errorArray.push('reporter')
    }
    return errorArray
  }
  // check for repeated address, there shouldn't be 2 offering from the same address, right?
  function isDupplicate()
  {
    var yesOrNo = 'no'
    properties.forEach((p) => 
    {
      if(p.address == address) 
      {
        yesOrNo = 'yes'
      }
    })
    return yesOrNo
  }

  // handle for creating new rows
  async function handleSave(){
      // set checkvalid to true --> we are checking for the invalid input here
      setCheckValid(true)


      var property = { address: address, type: type, bedroom: bedroom, ListingDate: ListingDate, rent: Number.parseInt(rent), furniture: furniture, notes: notes, reporter: reporter }
      if(address.trim().length==0 
      ||type.trim().length==0 
      ||bedroom.trim().length==0 
      ||rent.trim().length==0 
      ||reporter.trim().length==0) 
      {
        present('Form is not valid, please try again', 2500)
      }
      else if(isDupplicate() == 'yes') 
      {
        present('Another property with that address has been registered', 2500)
      }
      else if(isDupplicate() == 'no') 
      {
          await insertProperty(property)
          setRefresh(!refresh)

      }
  }

  async function fetchData()
  {
    var result = await getAllProperty() as Property[]
    setProperties(result)
  }

  // after all validation are done, the data is inserted through these functions
  useEffect(()=>{
    fetchData()

  },[refresh])

  return(
    <IonPage>
      <IonList>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Please enter your property overhere</IonTitle>
        </IonToolbar>
      </IonHeader>

        <IonItem>
          <IonLabel position="floating">Address</IonLabel>
          <IonInput onIonChange={e=>setAddress(e.detail.value!)}></IonInput>
          {(checkNotSet().includes('address')) && <p className="form-error">*Address is required</p>}
        </IonItem>

        <IonItem>  
          <IonLabel position="floating">Type</IonLabel>
          <IonSelect onIonChange={(e)=>setType(e.detail.value)}>
              <IonSelectOption value="Flat">Flat</IonSelectOption>
              <IonSelectOption value="Bungalow">Bungalow</IonSelectOption>
              <IonSelectOption value="House">House</IonSelectOption>
          </IonSelect>
          {(checkNotSet().includes('rent')) && <p className="form-error">*Type is required</p>}
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Number of Bedrooms</IonLabel>
          <IonSelect onIonChange={(e)=>setBedroom(e.detail.value)}>
              <IonSelectOption value="Studio">Studio</IonSelectOption>
              <IonSelectOption value="One">One</IonSelectOption>
              <IonSelectOption value="Two">Two</IonSelectOption>
              <IonSelectOption value="More">More than two</IonSelectOption>
          </IonSelect>
          {(checkNotSet().includes('rent')) && <p className="form-error">*Bedroom is required</p>}
        </IonItem>

        <IonItem>  
          <IonLabel position="floating">Furniture status</IonLabel>
          <IonSelect onIonChange={(e)=>setFurniture(e.detail.value)}>
              <IonSelectOption value="Furnished">Furnished</IonSelectOption>
              <IonSelectOption value="Unfurnished">Unfurnished</IonSelectOption>
              <IonSelectOption value="Partially furnished">Partially furnished</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Rent/month (In Euro)</IonLabel>
          <IonInput onIonChange={e=>setRent(e.detail.value!)}></IonInput>
          {(checkNotSet().includes('rent')) && <p className="form-error">*Rent is required</p>}
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Reporter</IonLabel>
          <IonInput onIonChange={e=>setReporter(e.detail.value!)}></IonInput>
          {(checkNotSet().includes('rent')) && <p className="form-error">*Reporter is required</p>}
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Notes</IonLabel>
          <IonTextarea onIonChange={e=>setNotes(e.detail.value!)}></IonTextarea>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Date/time</IonLabel>
          <IonInput type="datetime-local" onIonChange={e => setListingDate(e.detail.value!)}></IonInput>
        </IonItem>

        <IonButton onClick={handleSave} expand="full" color="secondary" >Save</IonButton> 
      
      </IonList>

    </IonPage>
  )
}

export default Create;