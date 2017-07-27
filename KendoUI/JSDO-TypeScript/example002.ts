/// <reference path="progress/progress.d.ts" />
    
class DSCustomer extends progress.data.JSTableRef {
    CustNum: number;
    Name: string;           
}    

class DSCustomerJSDO extends progress.data.JSDO {
    eCustomer: DSCustomer;    
}   

(function () {    
    // this function is called after data is returned from the server
    function onAfterFillCustomers(jsdo: DSCustomerJSDO, success, request) {
        // for each customer record returned
        jsdo.eCustomer.foreach(function (customer: progress.data.JSRecord) {
            // write out some of the customer data to the page
            document.write(customer.data.CustNum + ' ' + customer.data.Name + '<br>');
        });
    }
    
    try {
        var session: progress.data.JSDOSession, 
            jsdo: progress.data.JSDO, 
            serviceURI = "http://oemobiledemo.progress.com/MobilityDemoService", 
            catalogURI = serviceURI + "/static/mobile/MobilityDemoService.json";
            
        // create a new session object
        session = new progress.data.JSDOSession({
            serviceURI: serviceURI,
            catalogURIs: catalogURI
        });
        
        session.login("", "").done(function (jsdosession, result, info) {
            // load the catalog for the session
            jsdosession.addCatalog(catalogURI)
                .done(function (jsdosession, result, details) {
                // create a JSDO
                jsdo = new progress.data.JSDO({ name: 'dsCustomer' });
                // calling fill reads from the remote OE server
                jsdo.fill().done(onAfterFillCustomers);
            });
        });
    }
    catch (e) {
        alert("Error instantiating objects: " + e);
    }
}());
