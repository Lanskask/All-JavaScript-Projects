(function() {

    var app = angular.module("mainApp");

    app.controller('getData', function() {

    	var vm = this;

        var resultData = {
            "dsOrder": {
                "ttOrder": [{
                    "BillToID": 0,
                    "Carrier": "FlyByNight Courier",
                    "Creditcard": "Master Card",
                    "CustNum": 53,
                    "Instructions": "",
                    "OrderDate": "1998-01-26",
                    "OrderStatus": "Shipped",
                    "Ordernum": 1,
                    "PO": "",
                    "PromiseDate": "1998-01-31",
                    "SalesRep": "RDR",
                    "ShipDate": "1998-01-31",
                    "ShipToID": 0,
                    "Terms": "Net30",
                    "WarehouseNum": 0
                }, {
                    "BillToID": 0,
                    "Carrier": "Walkers Delivery",
                    "Creditcard": "Visa",
                    "CustNum": 81,
                    "Instructions": "",
                    "OrderDate": "1997-10-05",
                    "OrderStatus": "Shipped",
                    "Ordernum": 2,
                    "PO": "",
                    "PromiseDate": "1997-10-10",
                    "SalesRep": "HXM",
                    "ShipDate": "1997-10-10",
                    "ShipToID": 0,
                    "Terms": "Net30",
                    "WarehouseNum": 0
                }, {
                    "BillToID": 0,
                    "Carrier": "Standard Mail",
                    "Creditcard": "American Express",
                    "CustNum": 66,
                    "Instructions": "",
                    "OrderDate": "1997-09-23",
                    "OrderStatus": "Shipped",
                    "Ordernum": 3,
                    "PO": "",
                    "PromiseDate": "1997-09-28",
                    "SalesRep": "HXM",
                    "ShipDate": "1997-09-28",
                    "ShipToID": 0,
                    "Terms": "Net30",
                    "WarehouseNum": 0
                }, {
                    "BillToID": 0,
                    "Carrier": "Standard Mail",
                    "Creditcard": "Visa",
                    "CustNum": 83,
                    "Instructions": "",
                    "OrderDate": "1998-01-17",
                    "OrderStatus": "Shipped",
                    "Ordernum": 4,
                    "PO": "",
                    "PromiseDate": "1998-01-22",
                    "SalesRep": "HXM",
                    "ShipDate": "1998-01-22",
                    "ShipToID": 0,
                    "Terms": "Net30",
                    "WarehouseNum": 0
                }, {
                    "BillToID": 0,
                    "Carrier": "Standard Mail",
                    "Creditcard": "Visa",
                    "CustNum": 72,
                    "Instructions": "",
                    "OrderDate": "1998-02-12",
                    "OrderStatus": "Shipped",
                    "Ordernum": 5,
                    "PO": "",
                    "PromiseDate": "1998-02-17",
                    "SalesRep": "JAL",
                    "ShipDate": "1998-02-17",
                    "ShipToID": 0,
                    "Terms": "Net30",
                    "WarehouseNum": 0
                }, {
                    "BillToID": 0,
                    "Carrier": "Standard Mail",
                    "Creditcard": "American Express",
                    "CustNum": 1,
                    "Instructions": "",
                    "OrderDate": "1998-02-11",
                    "OrderStatus": "Shipped",
                    "Ordernum": 6,
                    "PO": "",
                    "PromiseDate": "1998-02-16",
                    "SalesRep": "HXM",
                    "ShipDate": "1998-02-16",
                    "ShipToID": 0,
                    "Terms": "Net30",
                    "WarehouseNum": 0
                }, {
                    "BillToID": 0,
                    "Carrier": "Standard Mail",
                    "Creditcard": "Master Card",
                    "CustNum": 51,
                    "Instructions": "",
                    "OrderDate": "1998-03-06",
                    "OrderStatus": "Shipped",
                    "Ordernum": 7,
                    "PO": "",
                    "PromiseDate": "1998-03-11",
                    "SalesRep": "KIK",
                    "ShipDate": "1998-03-11",
                    "ShipToID": 0,
                    "Terms": "Net30",
                    "WarehouseNum": 0
                }, {
                    "BillToID": 0,
                    "Carrier": "Standard Mail",
                    "Creditcard": "American Express",
                    "CustNum": 38,
                    "Instructions": "",
                    "OrderDate": "1997-09-18",
                    "OrderStatus": "Shipped",
                    "Ordernum": 8,
                    "PO": "",
                    "PromiseDate": "1997-09-23",
                    "SalesRep": "DKP",
                    "ShipDate": "1997-09-23",
                    "ShipToID": 0,
                    "Terms": "Net30",

                    "WarehouseNum": 0
                }, {
                    "Carrier": "            Standard",
                    "CustNum": 51,
                    "OrderDate": "1998-02-22",
                    "Ordernum": 9,
                    "PromiseDate": "1998-02-27",
                    "ShipDate": "1998-02-27"
                }]
            }
        };

        vm.beOrders = resultData.dsOrder.ttOrder;


    });


})();
