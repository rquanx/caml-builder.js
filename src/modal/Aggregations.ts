export class AggregationsModal {
    private Name: string;
    private Type: string;
    constructor(field: string, type: string) {
        this.Name = field;
        this.Type = type;
    }
}

export default AggregationsModal;