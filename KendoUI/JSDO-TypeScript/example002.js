/// <reference path="progress/progress.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DSCustomer = (function (_super) {
    __extends(DSCustomer, _super);
    function DSCustomer() {
        _super.apply(this, arguments);
    }
    return DSCustomer;
})(progress.data.JSTableRef);
var DSCustomerJSDO = (function (_super) {
    __extends(DSCustomerJSDO, _super);
    function DSCustomerJSDO() {
        _super.apply(this, arguments);
    }
    return DSCustomerJSDO;
})(progress.data.JSDO);
(function () {
    // this function is called after data is returned from the server
    function onAfterFillCustomers(jsdo, success, request) {
        // for each customer record returned
        jsdo.eCustomer.foreach(function (customer) {
            // write out some of the customer data to the page
            document.write(customer.data.CustNum + ' ' + customer.data.Name + '<br>');
        });
    }
    try {
        var session, jsdo, serviceURI = "http://oemobiledemo.progress.com/MobilityDemoService", catalogURI = serviceURI + "/static/mobile/MobilityDemoService.json";
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
