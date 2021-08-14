import { LightningElement,wire,track } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes' 
export default class BoatSearchForm extends LightningElement {
    
    selectedBoatTypeId='';

    @track searchOptions = [];
    @track choosenValue = '';
    boatTypeId;
    error = undefined;
    stack;
    errorCallback(error, stack) {
        this.error = error;
        console.log(this.error);
    }
    
    @wire(getBoatTypes) 
    wireHandler({data, error}){
        if(data){
            //this.searchOptions = data.value;
            console.log(data)  
            for(let i=0; i<data.length; i++)  {
                this.searchOptions = [...this.searchOptions ,{value: data[i].Id , label: data[i].Name}];                                  
            } 

            this.searchOptions = [...this.searchOptions,{value:'',label:'All Types'}];
            this.choosenValue = this.searchOptions[data.length].label;
            console.log(this.choosenValue)
           
        }
        if(error){
            console.error(error);
            this.searchOptions = undefined;
        }
    }

    handleSearchOptionChange(event) {
        
        this.selectedBoatTypeId = event.detail.value.trim();
        //console.log(this.selectedBoatTypeId);
        const searchEvent = new CustomEvent('search',  {detail:{boatTypeId: this.selectedBoatTypeId} });
        this.dispatchEvent(searchEvent);
        //console.log(searchEvent);
    }

    get options(){
        return this.searchOptions;
    }

}