import { IonGrid, IonRow, IonCol, IonIcon, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, IonSearchbar, IonTextarea } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { getAllProperty, insertProperty } from '../databaseHandler';
import './Home.css';
import { Property } from '../model';


const Home: React.FC = () => {
  // create a variable to save the search results
  const [searchString, setSearchString] = useState<String>('')
  // SearchpProperties: this is to save the value that were found 
  const [SearchpProperties, setSearchpProperties] = useState<Property[]>([])
  // properties saves the list of values from the database
  const [properties, setProperties] = useState<Property[]>([])

  // Search Function
  const btnSearch = () => {
    //Create variable for the values that were passed
    var newProperties = [];
    // filter the values
    for (let x in properties) {
      if (properties[Number(x)].type == searchString) {
        // if found --> newProperties
        newProperties.push(properties[Number(x)])
      }
    }
    // update the values to SearchpProperties
    setSearchpProperties(newProperties);
  }

  // This function is called when the page renders
  async function fetchData() {
    const allProperties = await getAllProperty();
    setProperties(allProperties);
  }

  // [] makes fetchData() only run once when the page is rendering
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Rental-Z: The renting site</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ionic-padding">
        <IonItem>
          <IonButton onClick={btnSearch}>Search</IonButton>
          <IonSelect onIonChange={(e) => setSearchString(e.detail.value)}>
            <IonSelectOption>Flat</IonSelectOption>
            <IonSelectOption>Bungalow</IonSelectOption>
            <IonSelectOption>House</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>Result for search: {searchString}</IonItem>
        {SearchpProperties &&
          // IonGrid here is treated as a table
          <IonGrid>
            {/*  IonRow = row, IonCol = columm in IonRow
            Do not change it since the format might break, took me a while to find a good porportion */}
            <IonRow>
              <IonCol className='list-header-font' size="1">ID</IonCol>
              <IonCol className='list-header-font' size="4">Address</IonCol>
              <IonCol className='list-header-font' size="2">Type</IonCol>
              <IonCol className='list-header-font' size="2">Bedroom</IonCol>
              <IonCol className='list-header-font' size="2">Reporter</IonCol>
            </IonRow>
             
            {SearchpProperties.map(p => ( //Maping the data to the correct cell in the table
              <IonRow>
                <IonCol size="1">
                  <IonText className='list-data-font' key={p.id}>{p.id}</IonText>
                </IonCol>
                <IonCol size="4">
                  <IonText className='list-data-font' key={p.id}>{p.address}</IonText>
                </IonCol>
                <IonCol size="2">
                  <IonText className='list-data-font' key={p.id}>{p.type}</IonText>
                </IonCol>
                <IonCol size="2">
                  <IonText className='list-data-font' key={p.id}>{p.bedroom}</IonText>
                </IonCol>
                <IonCol size="2">
                  <IonText className='list-data-font' key={p.id}>{p.reporter}</IonText>
                </IonCol>
                <IonButton routerLink={'propertyDetails/' + p.id}></IonButton>
              </IonRow>
            ))}
          </IonGrid>
        }


        <IonItem>List</IonItem>
        {properties &&
          // IonGrid here is treated as a table
          <IonGrid>
          {/*  IonRow = row, IonCol = columm in IonRow
            Do not change it since the format might break, took me a while to find a good porportion */}
            <IonRow>
              <IonCol className='list-header-font' size="1">ID</IonCol>
              <IonCol className='list-header-font' size="4">Address</IonCol>
              <IonCol className='list-header-font' size="2">Type</IonCol>
              <IonCol className='list-header-font' size="2">Number of Bedrooms</IonCol>
              <IonCol className='list-header-font' size="2">Reporter</IonCol>
            </IonRow>

            {properties.map(p => ( //Maping the data to the correct cell in the table
              <IonRow>
                <IonCol size="1">
                  <IonText className='list-data-font' key={p.id}>{p.id}</IonText>
                </IonCol>
                <IonCol size="4">
                  <IonText className='list-data-font' key={p.id}>{p.address}</IonText>
                </IonCol>
                <IonCol size="2">
                  <IonText className='list-data-font' key={p.id}>{p.type}</IonText>
                </IonCol>
                <IonCol size="2">
                  <IonText className='list-data-font' key={p.id}>{p.bedroom}</IonText>
                </IonCol>
                <IonCol size="2">
                  <IonText className='list-data-font' key={p.id}>{p.reporter}</IonText>
                </IonCol>
                <IonButton routerLink={'propertyDetails/' + p.id}></IonButton>
              </IonRow>
            ))}
          </IonGrid>
        }

      </IonContent>
    </IonPage>
  );
};
export default Home;
