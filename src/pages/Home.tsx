import { IonGrid, IonRow, IonCol, IonIcon, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, IonSearchbar, IonTextarea } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { getAllProperty, insertProperty } from '../databaseHandler';
import './Home.css';
import { Property } from '../model';


const Home: React.FC = () => {
  const [address,setAddress] = useState('')
  const [type,setType] = useState('')
  const [bedroom,setBedroom] = useState('')
  const [timeAdded,setTimeAdded] = useState(new Date())
  const [rent,setRent] = useState('')
  const [furniture,setFurniture] = useState('')
  const [notes,setNotes] = useState('')
  const [reporter,setReporter] = useState('')

  const [searchString,setSearchString] = useState('')

  const [tags,setTags] = useState<string[]>([])
  const [properties, setProperties]= useState<Property[]>([])
// only furniture and notes are optional
  const [refresh,setRefresh] = useState(false)
  const [checkValid,setCheckValid] = useState(false)
  

  async function prioritizedMatches (searchResult:Property[])
  {

    var first = new Array<Property>()
    var second = new Array<Property>()
    var third = new Array<Property>()
    var forth = new Array<Property>()
    var prioritizedResult = new Array<Property>()

    searchResult.forEach((r) => 
    {
      var matchScore = 0

      tags.forEach((t) => 
      {
        if(r.type.toLowerCase().includes(t.toLowerCase())) {
          matchScore += 1
        }
        if(r.type.toLowerCase().includes(t.toLowerCase())) {
          matchScore += 1
        }
        if(r.type.toLowerCase().includes(t.toLowerCase())) {
          matchScore += 1
        }
        if(r.type.toLowerCase().includes(t.toLowerCase())) {
          matchScore += 1
        }
      })

      if(matchScore==4) {
        first.push(r)
      }
      else if(matchScore==3) {
        second.push(r)
      }
      else if(matchScore==2) {
        third.push(r)
      }
      else
      {
        forth.push(r)
      }

    })

    //prioritizedResult = [...first, ...second, ...third, ...forth]
    prioritizedResult.push(...first)
    prioritizedResult.push(...second)
    prioritizedResult.push(...third)
    prioritizedResult.push(...forth)
    return prioritizedResult
  }

  // get data
  async function fetchData()
  {
    setProperties([])
    // result is to contain data taken from database
    var result = new Array<Property>()
    // get all properties
    result = await getAllProperty() as Property[]

    var searchResult = new Array<Property>()

    // fetch process
    // searchString.lenth==0 means not searching, so display all
    if(searchString.length==0)
    {
      setProperties(result)
    }

    // else we do search process
    else 
    {
      result.forEach(r => 
      {
        tags.forEach(t => 
        {
          // for every item that matches, push it into searchResult
          if(r.address.toLowerCase().includes(t.toLowerCase()) || r.type.toLowerCase().includes(t.toLowerCase()) ||r.bedroom.toString().includes(t.toLowerCase()) || r.furniture.toLowerCase().includes(t.toLowerCase()) || r.reporter.toLowerCase().includes(t.toLowerCase())) 
          {
            searchResult.push(r)
          }
        })
      })
      // get rid of unwanted dupplicates in searchResult
      searchResult = Array.from(new Set(searchResult));
      //var searchResult = await prioritizedMatches(searchResult) as Property[]
      setProperties(searchResult)
    }
  }

  //fetchData will run when page is rendered or everytime the variable refresh or searchString changes
  useEffect(()=>
  {
    // run this when in a new re-render cycle
    setTags(searchString.split(' '))
    fetchData()

  },
  // or when these are changed, executed
  [refresh, searchString])

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Rental-Z: The renting site</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ionic-padding">

        <IonSearchbar inputmode='text' placeholder='Type here to search' onIonChange={(e)=>setSearchString(e.detail.value!)}></IonSearchbar>

       
       {tags}
       {properties &&
       // IonGrid here is treated as a table
        <IonGrid>
          {/*  each IonRow is a row, each IonCol is a columm in IonRow
          This structure should not be changed */}
          <IonRow>
            <IonCol className='list-header-font'  size="1">ID</IonCol>
            <IonCol className='list-header-font' size="4">Address</IonCol>
            <IonCol className='list-header-font' size="2">Type</IonCol>
            <IonCol className='list-header-font' size="2">Bedroom</IonCol>
            <IonCol className='list-header-font' size="3">Reporter</IonCol>
          </IonRow>
          
          {properties.map(p=> (
          <IonRow>
            <IonCol size="1">
              <IonText className='list-data-font' key={p.id}>{p.id}</IonText>
            </IonCol>
            <IonCol size="4">
              <IonText className='list-data-font'  key={p.id}>{p.address}</IonText>
            </IonCol>
            <IonCol size="2">
              <IonText className='list-data-font'  key={p.id}>{p.type}</IonText>
            </IonCol>
            <IonCol size="2">
              <IonText className='list-data-font'  key={p.id}>{p.bedroom}</IonText>
            </IonCol>
            <IonCol size="3">
              <IonText className='list-data-font'  key={p.id}>{p.reporter}</IonText>
            </IonCol>
            <IonButton routerLink={'propertyDetails/'+p.id}></IonButton>
          </IonRow>
          ))}
        </IonGrid>
       }

      </IonContent>
    </IonPage>
  );
};
export default Home;
