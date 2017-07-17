export class ttOrder {
    public BillToID: number;
    public Carrier: string;
    public Creditcard: string;
    public CustNum: number;
    public Instructions: string;
    public OrderDate: Date; // Date
    public OrderStatus: string;
    public Ordernum: number;
    public PO: string;
    public PromiseDate: Date; // Date
    public SalesRep: string;
    public ShipDate: Date; // Date
    public ShipToID: number;
    public Terms: string;
    public WarehouseNum: number;

    constructor(
        BillToID: number,
        Carrier: string,
        Creditcard: string,
        CustNum: number,
        Instructions: string,
        OrderDate: Date,// Date
        OrderStatus: string,
        Ordernum: number,
        PO: string,
        PromiseDate: Date, // Date
        SalesRep: string,
        ShipDate: Date, // Date
        ShipToID: number,
        Terms: string,
        WarehouseNum: number
    ) {
        this.BillToID = BillToID; 
        this.Carrier = Carrier; 
        this.Creditcard = Creditcard; 
        this.CustNum = CustNum; 
        this.Instructions = Instructions; 
        this.OrderDate = OrderDate; // Date
        this.OrderStatus = OrderStatus; 
        this.Ordernum = Ordernum; 
        this.PO = PO; 
        this.PromiseDate = PromiseDate; // Date
        this.SalesRep = SalesRep; 
        this.ShipDate = ShipDate; // Date
        this.ShipToID = ShipToID; 
        this.Terms = Terms; 
        this.WarehouseNum = WarehouseNum; 
    }
}
