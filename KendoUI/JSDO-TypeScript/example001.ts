/// <reference path="progress/progress.d.ts" />

class DSCustomer extends progress.data.JSTableRef {
    CustNum: number;
    Name: string;           
}    

class DSCustomerJSDO extends progress.data.JSDO {
    eCustomer: DSCustomer;    
}   

var session: progress.data.Session, 
    jsdo: progress.data.JSDO, 
    serviceURI = "http://oemobiledemo.progress.com/MobilityDemoService", 
    catalogURI = serviceURI + "/static/mobile/MobilityDemoService.json";
     
session = new progress.data.Session();
session.login(serviceURI, "", "");
session.addCatalog(catalogURI);

jsdo = new progress.data.JSDO({ name: "dsCustomer" });
jsdo.subscribe("AfterFill", onAfterFillCustomers, this);
jsdo.fill();

function onAfterFillCustomers(jsdo: DSCustomerJSDO, success, request) {
    jsdo.eCustomer.foreach(function (customer) {
        document.write(jsdo.eCustomer.CustNum + " " + jsdo.eCustomer.Name + "<br>");
    });
}
