import { ttOrder } from './ttOrder';

export class dsOrder {
    public ttOrder: ttOrder[];

    constructor(outTtOrder: ttOrder[])  {
        this.ttOrder = outTtOrder;
    }
}