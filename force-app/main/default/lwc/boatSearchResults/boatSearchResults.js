import { LightningElement,wire,api,track } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { MessageContext, publish } from 'lightning/messageService';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import { getRecordNotifyChange } from 'lightning/uiRecordApi';
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
export default class BoatSearchResults extends LightningElement {
    selectedBoatId;
    @api boatTypeId='';
    @track boats=[];
    isLoading = false;
    rowOffset = 0;
    @track draftValues=[];
    columns=[
        { label: 'Name', fieldName: 'Name',type: 'text', 
        editable: true },
        { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true },
        { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
        { label: 'Description', fieldName: 'Description__c', type: 'text', editable: true },
    ];
    

    @wire(getBoats,{boatTypeId:'$boatTypeId'})
    wiredBoats({data,error}){
            if(data){
                console.log(data);
                this.boats = data;
            }
            if(error){
                console.error(error);
            }

            this.isLoading = false;
            this.notifyLoading(this.isLoading);
    }

    @wire(MessageContext)
    messageContext

    @api searchBoats(boatTypeId){
       this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = boatTypeId;
        //console.log('boatTypeId ',this.boatTypeId)
    }

    @api
    async refresh() { 
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        await refreshApex(this.boats);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);

    }

    updateSelectedTile(event){
        console.log('inside boatsearch results:selectedBoatId',event.detail.boatId)
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
    }

    sendMessageService(boatId) { 
        try{
        publish(this.messageContext, BOATMC, {recordId:boatId});
    }catch(error){
        console.log(error);
    }
      }

  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
//   async handleSave(event) {
      
//     this.notifyLoading(true);
    
//     const updatedFields = event.detail.draftValues;
//     console.log('updatedFields',updatedFields);
//     const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id }});

//     console.log('notifyChangeIds',notifyChangeIds );

//     await updateBoatList({data: updatedFields})
//       .then(()=>{ this.dispatchEvent(
//         new ShowToastEvent({
//             title: SUCCESS_TITLE,
//             message: MESSAGE_SHIP_IT,
//             variant: SUCCESS_VARIANT
//         })
//     );
    
//     this.draftValues = [];
//     getRecordNotifyChange(notifyChangeIds);
//     this.refresh();
// } )
//     .catch(error => {this.dispatchEvent(
//         new ShowToastEvent({
//             title: ERROR_TITLE,
//             message: error.body.message,
//             variant: ERROR_VARIANT
//         })
//   );}).finally(() => {this.isLoading = false;
//     this.notifyLoading(this.isLoading);});
//   } 

handleSave(event) {
        // notify loading
        const updatedFields = event.detail.draftValues;
        // Update the records via Apex
        updateBoatList({data: updatedFields})
        .then(result => {
            const toast = new ShowToastEvent({
                title: SUCCESS_TITLE,
                message: MESSAGE_SHIP_IT,
                variant: SUCCESS_VARIANT,
            });
            this.dispatchEvent(toast);
            this.draftValues = [];
            return this.refresh();
        })
        .catch(error => {
            const toast = new ShowToastEvent({
                title: ERROR_TITLE,
                message: error.message,
                variant: ERROR_VARIANT,
            });
            this.dispatchEvent(toast);
        })
        .finally(() => {
            
        });
    }

  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
      
    if(isLoading){
        const evt = new CustomEvent('loading',{detail: this.isLoading});
        this.dispatchEvent(evt);
    } else {
        this.dispatchEvent(CustomEvent('doneloading'));
    }

  }



  error;
  stack;
  errorCallback(error, stack) {
      this.error = error;
      console.log(this.error);
  }

}