export class toDo {
    constructor(item, isComplete) {
        this.item = item;
        this.isComplete = isComplete;
    }
    getState() {
        return this.isComplete;
    }
    setState(state) {
        this.isComplete = state;
    }
    getItem() {
        return this.item;
    }
    setItem(value) {
        this.item = value;
    }
}
