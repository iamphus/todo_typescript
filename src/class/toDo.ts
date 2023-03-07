export class toDo {
     private item: string;
     private isComplete: boolean;

     public constructor(item:string , isComplete: boolean) {
          this.item = item;
          this.isComplete = isComplete;
     }

     public getState(): boolean {
          return this.isComplete;
     }

     public setState(state: boolean): void {
          this.isComplete = state
     }

     public getItem(): string {
          return this.item;
     }

     public setItem(value: string): void {
          this.item = value;
     }
}