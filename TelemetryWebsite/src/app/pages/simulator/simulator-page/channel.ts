export class Channel {
    public name: string;
    public errorInput: string;
    public delayInput: string;
    public id: number;
    constructor(name: string, errorInput: string, delayInput: string, id: number) {
        this.name = name;
        this.errorInput = errorInput;
        this.delayInput = delayInput;
        this.id = id;
    }
}