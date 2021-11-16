import { useIonToast, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, IonSearchbar, IonTextarea, IonDatetime } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { getAllProperty, updateProperty, deleteProperty, getPropertyById } from '../databaseHandler';
import { Property } from '../model';

// to get id from routing
interface Parameters {
    id:string
}
const PropertyDetails: React.FC = () => {
  // need to initialize the id taken here
    const { id } = useParams<Parameters>()
    // useHistory is to access browser history and do goBack or goForward
    const history = useHistory();

    const [address,setAddress] = useState('')
    const [type,setType] = useState('')
    const [bedroom,setBedroom] = useState('')
    const [ListingDate,setListingDate] = useState(new Date())
    const [rent,setRent] = useState('')
    const [furniture,setFurniture] = useState('')
    const [notes,setNotes] = useState('')
    const [reporter,setReporter] = useState('')

    const [properties,setProperties] = useState<Property[]>([])

    const [refresh,setRefresh] = useState(false)

    const [checkValid,setCheckValid] = useState(false)

    const [present, dismiss] = useIonToast();
    
    // const handleUpdateProperty = () => 
    async function handleUpdateProperty()
    {
        setCheckValid(true)
        if(address.trim().length==0 
        || type.trim().length==0 
        || bedroom.trim().length==0
        || rent.trim().length==0 
        || reporter.trim().length==0) 
        {
            alert("Form is not valid, please try again")
        }
        else if (isDupplicate() == 'yes') 
        {
            present('Another property with that address has been registered', 2000)
        }
        else if (isDupplicate() == 'no')
        {
            var updatedProperty = { id : Number.parseInt(id), 
            address:address, type:type, 
            bedroom:bedroom, ListingDate:ListingDate, rent:Number.parseInt(rent), 
            furniture:furniture, notes:notes, reporter:reporter}
            await updateProperty(updatedProperty);
            present("Update successful!", 2000)
        }
    }

    async function handleDeleteProperty() //need more work here, crash on delete
    {
        const isConfirmed = window.confirm("Are you sure to delete?");
        if (isConfirmed) 
        {
            await deleteProperty(Number.parseInt(id))
            alert('Property deleted from database!')
            setRefresh(!refresh)
            history.goBack();
        }
    }

    async function fetchData() 
    {
        var property = await getPropertyById(Number.parseInt(id)) as Property
        var result = await getAllProperty() as Property[]
        setProperties(result)

        setAddress(property.address) //error here
        setType(property.type)
        setBedroom(property.bedroom.toString())
        setRent(property.rent.toString())
        setFurniture(property.furniture)
        setNotes(property.notes) 
        setReporter(property.reporter)
        
        //setRefresh(!refresh)
        //history.goBack();
    }

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

    function isDupplicate()
    {
        var yesOrNo
        properties.forEach((p) => 
        {
            if(p.address == address) 
            {
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
    }, [refresh])

    return (
      <IonPage>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Address</IonLabel>
            <IonInput value = {address} onIonChange={e=>setAddress(e.detail.value!)}></IonInput>
            {(checkNotSet().includes('address')) && <p className="form-error">*Address is required</p>}
          </IonItem>

          <IonItem>  
            <IonLabel position="floating">Type</IonLabel>
            <IonSelect value = {type} onIonChange={(e)=>setType(e.detail.value)}>
                <IonSelectOption value="Flat">Flat</IonSelectOption>
                <IonSelectOption value="Bungalow">Bungalow</IonSelectOption>
                <IonSelectOption value="House">House</IonSelectOption>
            </IonSelect>
            {(checkNotSet().includes('rent')) && <p className="form-error">*Type is required</p>}
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Bedroom</IonLabel>
            <IonSelect value = {bedroom}  onIonChange={(e)=>setBedroom(e.detail.value)}>
                <IonSelectOption value="Studio">Studio</IonSelectOption>
                <IonSelectOption value="One">One</IonSelectOption>
                <IonSelectOption value="Two">Two</IonSelectOption>
                <IonSelectOption value="More">More than two</IonSelectOption>
            </IonSelect>
            {(checkNotSet().includes('rent')) && <p className="form-error">*Bedroom is required</p>}
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Furniture status</IonLabel>
            <IonSelect value = {furniture}  onIonChange={(e)=>setFurniture(e.detail.value)}>
              <IonSelectOption value="Furnished">Furnished</IonSelectOption>
              <IonSelectOption value="Unfurnished">Unfurnished</IonSelectOption>
              <IonSelectOption value="Partially furnished">Partiallly furnished</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Rent</IonLabel>
            <IonInput value = {rent}  onIonChange={e=>setRent(e.detail.value!)}></IonInput>
            {(checkNotSet().includes('rent')) && <p className="form-error">*Rent is required</p>}
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Reporter</IonLabel>
            <IonInput value = {reporter}  onIonChange={e=>setReporter(e.detail.value!)}></IonInput>
            {(checkNotSet().includes('rent')) && <p className="form-error">*Reporter is required</p>}
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Notes</IonLabel>
            <IonTextarea value = {notes}  onIonChange={e=>setNotes(e.detail.value!)}></IonTextarea>
          </IonItem>

            <IonButton onClick={handleUpdateProperty} expand="full" color="secondary" >Save</IonButton>

            <IonButton onClick={handleDeleteProperty} expand="full" color="secondary" >Delete</IonButton>

        </IonList>
      </IonPage>
    )
}

export default PropertyDetails;