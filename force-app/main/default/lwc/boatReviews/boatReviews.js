// imports
import { LightningElement,api} from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { NavigationMixin } from 'lightning/navigation'
import { refreshApex } from '@salesforce/apex'
export default class BoatReviews extends NavigationMixin(LightningElement) {
    // Private
    boatId;
    error;
   boatReviews=[];
    isLoading=false;
    stack;

  errorCallback(error, stack) {
      this.error = error;
      console.log(this.error);
  }
    // Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() { 
      return this.boatId;
    }
    set recordId(value) {
      console.log('boat reviews ', value)
      this.setAttribute('boatId', value);
      this.boatId = value;
      this.getReviews();
    }
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() { 
      return this.boatReviews && this.boatReviews.length > 0 ? true : false;
    }
    
    // Public method to force a refresh of the reviews invoking getReviews
    @api
    refresh() { 
      refreshApex(this.getReviews());
    }
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() { 

      if(this.boatId == null  || this.boatId == '') {
        return;
      }
      this.isLoading = true;

      getAllReviews({boatId: this.boatId})
      .then(result => {
        this.boatReviews = result;
        console.log('boatReviews',boatReviews);
        this.error = undefined;
    })
      .catch(error =>{
        this.error= error;
      })
      .finally(()=>{ this.isLoading = false;});
    }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {
      let recordId = event.target.dataset.recordId;  
      this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: recordId,
            objectApiName: 'User',
            actionName: 'view'
        }
    });

    }
  }
  