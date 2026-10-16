export const theaterRegistration = [
    {name: 'Theater Name', placeholder:'Theater Name', type: 'text', required:true, jsonName:'theaterName', maxLen:50},
    {name: 'GST Number', placeholder:'GST Number', type: 'text', required:true, jsonName:'gstNumber', maxLen:15},
    {name: 'PAN Number', placeholder:'PAN Number', type: 'text', required:true, jsonName:'panNumber', maxLen:10},
    {name: 'Business License Number', placeholder:'Business License Number', type: 'text', required:true, jsonName:'businessLicenseNumber', maxLen:21}
   
]
export const location = [
    {name: 'Country', placeholder:'Country', type: 'text', required:true, jsonName:'country', maxLen:25},
    {name: 'State', placeholder:'State', type: 'text', required:true, jsonName:'state', maxLen:25},
    {name: 'City', placeholder:'City', type: 'text', required:true, jsonName:'city', maxLen:25},
    {name: 'Area', placeholder:'Area', type: 'text', required:false, jsonName:'area', maxLen:50},
    {name: 'Street', placeholder:'Street', type: 'text', required:false, jsonName:'street', maxLen:50},
    {name: 'Landmark', placeholder:'Landmark', type: 'text', required:false, jsonName:'landmark', maxLen:50},
    {name: 'Zipcode', placeholder:'Zipcode', type: 'number', required:true, jsonName:'zipcode', maxLen:5}
]