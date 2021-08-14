import { api, LightningElement,wire } from "lwc";
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats'
import { NavigationMixin } from 'lightning/navigation'
const BOAT_OBJECT = 'Boat__c';
export default class SimilarBoats extends NavigationMixin(LightningElement) {
    // Private
    currentBoat;
    boatId;
    error;
    relatedBoats;

    
    @api
    get recordId() {
        return this.boatId
      }
      set recordId(value) {
        this.setAttribute('boatId', value);        
        this.boatId = value;
      }
    
    @api 
    similarBy;
    
    @wire(getSimilarBoats, {boatId: '$boatId', similarBy: '$similarBy'})
    similarBoats({ error, data }) {
      if (data) {
        console.log(data);
          this.relatedBoats = data;
          this.error = undefined;
      } else if (error) {
          this.error = error;
      }
  }


    get getTitle() {
      return 'Similar boats by ' + this.similarBy;
      //console.log(this.relatedBoats);
    }

    get noBoats() {
      return !(this.relatedBoats && this.relatedBoats.length > 0);
    }
    
    // Navigate to record page
    openBoatDetailPage(event) {
      this[NavigationMixin.Navigate]({
          type: 'standard__recordPage',
          attributes: {
              recordId: event.detail.boatId,
              objectApiName: BOAT_OBJECT,
              actionName: 'view'
          },
      });
  }
  }
  




  