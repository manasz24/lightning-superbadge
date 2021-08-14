// imports
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c'
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name'
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c'
import { LightningElement, api } from 'lwc';

const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';
export default class BoatAddReviewForm extends LightningElement {
    // Private
    //recordId
    boatId;
    rating;
    error;
    stack;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField        = NAME_FIELD;
    commentField     = COMMENT_FIELD;
    labelSubject = 'Review Subject';
    labelRating  = 'Rating';
    
    // Public Getter and Setter to allow for logic to run on recordId change
    errorCallback(error, stack) {
      this.error = error;
      console.log('error callback',this.error)
  }
    @api
    get recordId() {
      alert('inside get '); 
      return this.boatId;
    }

    /**
   * @param {any} value
   */
    set recordId(value) {
      alert('inside set');
      this.setAttribute('boatId', value);
      this.boatId = value;
    }
    
    // Gets user rating input from stars component
    handleRatingChanged(event) { 
      this.rating = event.detail.rating;
    }
    
    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) { 
      event.preventDefault();
      const fields = event.detail.fields;
      fields.Rating__c = this.rating;
      fields.Boat__c = this.boatId;   
      console.log('fields',fields);
      this.template.querySelector('lightning-record-edit-form').submit(fields);  
    }
    
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    // handleSuccess(event) {
    //   const updatedRecord = event.detail.id;
    //   //console.log('onsuccess: ', updatedRecord);
    //   this.dispatchEvent(
    //     new ShowToastEvent({
    //         title: SUCCESS_TITLE,
    //         variant: SUCCESS_VARIANT,
    //     })
    // );
    // this.dispatchEvent(CustomEvent('createreview'));
    //   this.handleReset();
    // }
    handleSuccess() {
      // TODO: dispatch the custom event and show the success message
      const toast = new ShowToastEvent({
          title: SUCCESS_TITLE,
          variant: SUCCESS_VARIANT,
      });
      this.dispatchEvent(toast);
      this.handleReset();
      const createReviewEvent = new CustomEvent('createreview');
      this.dispatchEvent(createReviewEvent);        
  }
    
    handleReset() {
      const inputFields = this.template.querySelectorAll(
        'lightning-input-field'); 
        if (inputFields) {
          inputFields.forEach(field => {
              field.reset();
          });
      }
      
    }
  }
  