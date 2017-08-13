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
var session, jsdo, serviceURI = "http://oemobiledemo.progress.com/MobilityDemoService", catalogURI = serviceURI + "/static/mobile/MobilityDemoService.json";
session = new progress.data.Session();
session.login(serviceURI, "", "");
session.addCatalog(catalogURI);
jsdo = new progress.data.JSDO({ name: "dsCustomer" });
jsdo.subscribe("AfterFill", onAfterFillCustomers, this);
jsdo.fill();
function onAfterFillCustomers(jsdo, success, request) {
    jsdo.eCustomer.foreach(function (customer) {
        document.write(jsdo.eCustomer.CustNum + " " + jsdo.eCustomer.Name + "<br>");
    });
}
