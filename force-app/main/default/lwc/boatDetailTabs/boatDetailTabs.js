import { LightningElement,wire,api,track} from 'lwc';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import {APPLICATION_SCOPE,MessageContext,subscribe } from 'lightning/messageService';
import { getRecord,getFieldValue  } from 'lightning/uiRecordApi';
import {NavigationMixin} from 'lightning/navigation'

// Custom Labels Imports
import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';

import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  @api boatId; 
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };
  // Private
  subscription = null;
  
  error;
  stack;
  errorCallback(error, stack) {
      this.error = error;
      console.log(this.error);
  }

  @wire(MessageContext)
  messageContext
  
  @wire(getRecord,{recordId:'$boatId', fields: BOAT_FIELDS})
  wiredRecord // wire property for getrecord


  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() { 
    if(this.wiredRecord.data!= null)
    {
      console.log('wiredRecord',this.wiredRecord.data);
      return 'utility:anchor';
    }
    else{
      return null;
    }
  }
  
  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() { 
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
  }
  

  // Subscribe to the message channel
  subscribeMC() {
    if(this.subscription) { return; }
    this.subscription=subscribe(this.messageContext,BOATMC,(message)=>{ this.boatId = message.recordId },{scope:APPLICATION_SCOPE});
  }
  
  // Calls subscribeMC()
  connectedCallback() { 
    this.subscribeMC();
  }
  
  // Navigates to record page
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
      type:'standard__recordPage',
      attributes :{
          recordId:this.boatId,
          objectApiName:'Boat__c',
          actionName:'view'
      }
  });
  }
  
  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() { 
    console.log('inside handle review created')
    this.template.querySelector('lightning-tabset').activeTabValue = 'reviews';
    this.template.querySelector('c-boat-reviews').refresh();
  }
}
