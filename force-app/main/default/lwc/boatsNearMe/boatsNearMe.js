import { LightningElement,wire,api,track } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class BoatsNearMe extends LightningElement {
  markersTitle="Boat Location"
  @api boatTypeId;
  @track mapMarkers = [];
  @track isLoading=true; 
  @track isRendered=false;
  latitude;
  longitude;
  
  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation,{latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId'})
  wiredBoatsJSON({error, data}) {
    if(data){
        console.log(data);
        this.createMapMarkers(data)
        
    }
    if(error){
      this.dispatchEvent(
        new ShowToastEvent({
            title: ERROR_TITLE,
            message: error.body.message,
            variant: ERROR_VARIANT
        })
    );
    } 
    this.isLoading = false;
  }
  
  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
     if(this.isRendered ==false){
      this.getLocationFromBrowser()
     }
       this.isRendered =true;
  }
  
  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() { 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
      });
  }
  }

  
  
  // Creates the map markers
  createMapMarkers(boatData) {
    const newMarkers = JSON.parse(boatData).map(boat => {
        return {
            title: boat.Name,
            location: {
                Latitude: boat.Geolocation__Latitude__s,
                Longitude: boat.Geolocation__Longitude__s
            }
        };
    });
    newMarkers.unshift({
        title: LABEL_YOU_ARE_HERE,
        icon: ICON_STANDARD_USER,
        location: {
            Latitude: this.latitude,
            Longitude: this.longitude
        }
    });
    this.mapMarkers = newMarkers;
    this.selectedMarker = this.mapMarkers.length && this.mapMarkers[0].value
}
callMarkerHandler(event){
  this.selectedMarker = event.detail.selectedMarkerValue
}

error;
  stack;
  errorCallback(error, stack) {
      this.error = error;
      console.log(this.error);
  }
}
