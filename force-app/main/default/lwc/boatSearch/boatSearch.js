import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'
export default class BoatSearch extends NavigationMixin(LightningElement) {
    @api isLoading = false;
    boatTypeId = '';
    error;
    stack;
    errorCallback(error, stack) {
        this.error = error;
        console.log(this.error);
    }
    createNewBoat(){      //uses NavigationMixin 
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            }

        });

    }

    handleLoading(){
        this.isLoading =true;
    }

    handleDoneLoading(){
        this.isLoading =false;
    }

    searchBoats(event) { 
        this.boatTypeId = event.detail;
        this.template.querySelector('c-boat-search-results').searchBoats(this.boatTypeId);
        
    }




}