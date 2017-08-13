export class ttOrder {

    constructor(
        public BillToID: number,
        public Carrier: string,
        public Creditcard: string,
        public CustNum: number,
        public Instructions: string,
        public OrderDate: string,// Date
        public OrderStatus: string,
        public Ordernum: number,
        public PO: string,
        public PromiseDate: string, // Date
        public SalesRep: string,
        public ShipDate: string, // Date
        public ShipToID: number,
        public Terms: string,
        public WarehouseNum: number
    ) {  }
}
