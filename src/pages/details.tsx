import { useIonToast, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, IonSearchbar, IonTextarea, IonDatetime } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { getAllProperty, updateProperty, deleteProperty, getPropertyById } from '../databaseHandler';
import { Property } from '../model';

// to get id from routing
interface Parameters {
  id: string
}
const PropertyDetails: React.FC = () => 
{
  // need to initialize the id taken here
  const { id } = useParams<Parameters>()
  // useHistory is to access browser history and do goBack or goForward
  const history = useHistory();

  const [address, setAddress] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [bedroom, setBedroom] = useState<string>('')
  const [ListingDate, setListingDate] = useState<string>('')
  const [rent, setRent] = useState<string>('')
  const [furniture, setFurniture] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [reporter, setReporter] = useState<string>('')

  const [properties, setProperties] = useState<Property[]>([])

  const [refresh, setRefresh] = useState(false)

  const [checkValid, setCheckValid] = useState(false)

  const [present, dismiss] = useIonToast();

  // half of the data handling here are copied from the teacher's codes and then fixed to match the coursework 
  async function handleUpdateProperty() 
  {
    setCheckValid(true)
    if (address.trim().length == 0
      || type.trim().length == 0
      || bedroom.trim().length == 0
      || rent.trim().length == 0
      || reporter.trim().length == 0) {
      alert("Form is not valid, please try again")
    }
    else if (isDupplicate() == 'yes') 
    {
      present('Another property with that address has been registered', 2000)
    }
    else if (isDupplicate() == 'no') 
    {
      var updatedProperty = {
        id: Number.parseInt(id),
        address: address, type: type,
        bedroom: bedroom, ListingDate: ListingDate, rent: Number.parseInt(rent),
        furniture: furniture, notes: notes, reporter: reporter
      }
      await updateProperty(updatedProperty);
      present("Update successful!", 2000)
    }
  }

  async function handleDeleteProperty() 
  {
    const isConfirmed = window.confirm("Are you sure to delete?");
    if (isConfirmed) {
      await deleteProperty(Number.parseInt(id))
      alert('Property deleted from database!')
      setRefresh(!refresh)
      history.goBack();
    }
  }

  async function fetchData() // retrive the data after deleting
  {
    var property = await getPropertyById(Number.parseInt(id)) as Property
    var result = await getAllProperty() as Property[]
    setProperties(result)
    setListingDate(property.ListingDate)
    setAddress(property.address) 
    setType(property.type)
    setBedroom(property.bedroom.toString())
    setRent(property.rent.toString())
    setFurniture(property.furniture)
    setNotes(property.notes)
    setReporter(property.reporter)
  }

  function checkNotSet() // In case you want to update but forgot
  {
    var errorArray = new Array
    if (type.length == 0 && checkValid) {
      errorArray.push('type')
    }
    if (address.length == 0 && checkValid) {
      errorArray.push('address')
    }
    if (bedroom.length == 0 && checkValid) {
      errorArray.push('bedroom')
    }
    if (rent.length == 0 && checkValid) {
      errorArray.push('rent')
    }
    if (reporter.length == 0 && checkValid) {
      errorArray.push('reporter')
    }
    return errorArray
  }

  function isDupplicate() // check dup
  {
    var yesOrNo
    properties.forEach((p) => {
      if (p.address == address) {
        yesOrNo = 'yes'
      }
      else {
        yesOrNo = 'no'
      }
    })
    return yesOrNo
  }

  useEffect(() => 
  {
    fetchData();
  }, [])

  return (
    <IonPage>
      <IonList>
      <IonItem>
        <IonToolbar>
          <IonTitle>Property detail</IonTitle>
        </IonToolbar>
      </IonItem>

        <IonItem>
          <IonLabel position="floating">Address</IonLabel>
          <IonInput value={address} onIonChange={e => setAddress(e.detail.value!)}></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Type</IonLabel>
          <IonSelect value={type} onIonChange={(e) => setType(e.detail.value)}>
            <IonSelectOption value="Flat">Flat</IonSelectOption>
            <IonSelectOption value="Bungalow">Bungalow</IonSelectOption>
            <IonSelectOption value="House">House</IonSelectOption>
          </IonSelect>
          {(checkNotSet().includes('rent')) && <p className="form-error">*Type is required</p>}
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Number of Bedrooms</IonLabel>
          <IonSelect value={bedroom} onIonChange={(e) => setBedroom(e.detail.value)}>
            <IonSelectOption value="Studio">Studio</IonSelectOption>
            <IonSelectOption value="One">One</IonSelectOption>
            <IonSelectOption value="Two">Two</IonSelectOption>
            <IonSelectOption value="More">More than two</IonSelectOption>
          </IonSelect>
          {(checkNotSet().includes('rent')) && <p className="form-error">*Bedroom is required</p>}
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Furniture status</IonLabel>
          <IonSelect value={furniture} onIonChange={(e) => setFurniture(e.detail.value)}>
            <IonSelectOption value="Furnished">Furnished</IonSelectOption>
            <IonSelectOption value="Unfurnished">Unfurnished</IonSelectOption>
            <IonSelectOption value="Partially furnished">Partiallly furnished</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Rent/month (In Euro)</IonLabel>
          <IonInput value={rent} onIonChange={e => setRent(e.detail.value!)}></IonInput>
          {(checkNotSet().includes('rent')) && <p className="form-error">*Rent is required</p>}
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Reporter</IonLabel>
          <IonInput value={reporter} onIonChange={e => setReporter(e.detail.value!)}></IonInput>
          {(checkNotSet().includes('rent')) && <p className="form-error">*Reporter is required</p>}
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Notes</IonLabel>
          <IonTextarea value={notes} onIonChange={e => setNotes(e.detail.value!)}></IonTextarea>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Date/time</IonLabel>
          <IonInput value={ListingDate} type="datetime-local" onIonChange={e => setListingDate(e.detail.value!)}></IonInput>
        </IonItem>

        <IonButton onClick={handleUpdateProperty} expand="full" color="secondary" >Save</IonButton>

        <IonButton onClick={handleDeleteProperty} expand="full" color="secondary" >Delete</IonButton>

      </IonList>
    </IonPage>
  )
}

export default PropertyDetails;