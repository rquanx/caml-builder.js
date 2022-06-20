export class Aggregations {
    private name: string;
    private type: string;
    constructor(field: string, type: string) {
        this.name = field;
        this.type = type;
    }
}

export default Aggregations;