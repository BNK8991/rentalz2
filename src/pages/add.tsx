import { useIonToast, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, IonSearchbar, IonTextarea, IonDatetime } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import {insertProperty, getAllProperty, updateProperty } from '../databaseHandler';
import { Property } from '../model';

    // this is how u pass props between components, must also add the props to the Route element of Create component in App.tsx
    // for this to work
  //const Create: React.FC<{properties:Property[]}> = () => {


const Create: React.FC = () => {

  const [address,setAddress] = useState('')
  const [type,setType] = useState('')
  const [bedroom,setBedroom] = useState('')
  const [ListingDate,setListingDate] = useState(new Date())//.toISOString())
  const [rent,setRent] = useState('')
  const [furniture,setFurniture] = useState('')
  const [notes,setNotes] = useState('')
  const [reporter,setReporter] = useState('')

  const [refresh,setRefresh] = useState(false)

  const [checkValid,setCheckValid] = useState(false)

  const [present, dismiss] = useIonToast();

  //const history = goBack();

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
  // check for dupplicates of address, logically address shouldn't be shared between items in database
  //Start test
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
      // set checkvalid to true to indicate that we are in the process of checking for invalids
      setCheckValid(true)
      // get the current time
      setListingDate(new Date())


      var property = {address:address, type:type, bedroom:bedroom, ListingDate:ListingDate, rent:Number.parseInt(rent), furniture:furniture, notes:notes, reporter:reporter}

      if(address.trim().length==0 
      ||type.trim().length==0 
      ||bedroom.trim().length==0 
      ||rent.trim().length==0 
      ||reporter.trim().length==0) {
        present('Form is not valid, please try again', 2000)
      }
      else if(isDupplicate() == 'yes') {
        present('Another property with that address has been registered', 1000)
      }
      else if(isDupplicate() == 'no') {
          await insertProperty(property)
          //false->true->false->true
          setRefresh(!refresh)
          //history.goBack();

      }
  }

  async function fetchData()
  {
    var result = await getAllProperty() as Property[]
    setProperties(result)
  }

//End of test

  useEffect(()=>{
    fetchData()

  },[refresh])

  return(
    <IonPage>
      <IonList>

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
          <IonLabel position="floating">Bedroom</IonLabel>
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
          <IonLabel position="floating">Rent (Please input number)</IonLabel>
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

        <IonButton onClick={handleSave} expand="full" color="secondary" >Save</IonButton> 
      
      </IonList>

    </IonPage>
  )
}

export default Create;