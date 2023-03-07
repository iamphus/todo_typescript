import { toDo } from './class/toDo.js';

class todoList {
  private listToDo: toDo[] = [];

  public constructor() {
    this.dataInit();
  }

  private dataInit(): void {
    this.renderForm();
    this.renderData();
  }

  private renderData(): void {
    const data = JSON.parse(localStorage.getItem('toDos'));
    if (data != null) {
      data.forEach((element) => {
        this.createNewTodo(element.item, element.isComplete);
        this.listToDo.push(new toDo(element.item, element.isComplete))
      });
      this.setCount();
      this.checkItemLeft();
    }
  }

  private renderForm(): void {  
    const input: HTMLElement = document.getElementById('input');
    input.addEventListener('keypress', (event: KeyboardEvent): void => {
      var valueInput: string = (<HTMLInputElement>input).value;
      var letterNumber: RegExp = /^[ ]+$/;
      if (event.keyCode == 13 && valueInput.match(letterNumber) == null && valueInput.length != 0) {
        this.createNewTodo(valueInput, false);
        document.querySelector('input').value = '';
        this.addNewToDo(valueInput, false);
        this.setCount();
      }
    });

    this.findCompleteToDo();
    this.findAllToDo();
    this.findActiveToDo();
    this.clearAllComplete();
    this.checkAllToDo();
  }

  public createNewTodo(item: string, isComplete: boolean): void {
    let listView: HTMLElement = document.querySelector('ul');
    let card: HTMLElement = document.createElement('li');
    let dView: HTMLElement = document.createElement('div');
    let checkedInput: HTMLElement = document.createElement('input');
    let lbText: HTMLElement = document.createElement('label');
    let btnRemove: HTMLElement = document.createElement('button');

    dView.classList.add('view');
    checkedInput.classList.add('check');
    btnRemove.classList.add('remove');
    btnRemove.addEventListener('click', (event: MouseEvent): void => {
      this.removeToDo((event.target as HTMLTextAreaElement).closest('li'));
      (event.target as HTMLTextAreaElement).closest('li').remove();
      this.setCount();
    });

    checkedInput.setAttribute('type', 'checkbox');
    checkedInput.setAttribute('id', 'btnCheck');
    checkedInput.addEventListener('click', (): void => {
      this.changeStateToDo((event.target as HTMLTextAreaElement).closest('li'));
      this.setCount();
    });
    lbText.setAttribute('id', 'text-label');
    lbText.setAttribute('contenteditable', 'true');
    lbText.textContent = item;
    if (isComplete) {
      checkedInput.setAttribute('checked', 'checked');
    }

    lbText.addEventListener('keypress', (event: KeyboardEvent): void => {
      if (event.keyCode === 13) {
        lbText.contentEditable = 'false';
        this.changeItemToDo((event.target as HTMLTextAreaElement).closest('li'));
        lbText.contentEditable = 'true';
      }
    });

    dView.appendChild(checkedInput);
    dView.appendChild(lbText);
    dView.appendChild(btnRemove);
    card.appendChild(dView);

    listView.appendChild(card);
  }

  public getIndexOfToDo(element: HTMLElement): number {
    var nodes: Element[] = Array.from(element.closest('ul').children);
    var index: number = nodes.indexOf(element);
    return index;
  }

  public getStateOfToDo(element: HTMLElement): boolean {
    return (<HTMLInputElement>element.querySelector("input[type='checkbox']")).checked;
  }

  public removeToDo(element: HTMLElement): void {
    for (let i: number = 0; i < this.listToDo.length; i++) {
      this.listToDo.splice(this.getIndexOfToDo(element), 1);
      break;
    }
    this.saveToDo();
  }

  public addNewToDo(item: string, state: boolean): void {
    this.listToDo.push(new toDo(item, state));
    this.saveToDo();
  }

  public changeStateToDo(element: HTMLElement): void {
    var state: boolean = this.getStateOfToDo(element);
    var index: number = this.getIndexOfToDo(element);
    this.listToDo[index].setState(state) ;
    this.saveToDo();
  }

  public changeAllStateToDo(state: boolean): void {
    this.listToDo.forEach((element) => {
      element.setState(state);
    });
    this.saveToDo();
  }

  public changeItemToDo(element: HTMLElement): void {
    var valueChange: string = element.querySelector('label').innerHTML;
    var index: number = this.getIndexOfToDo(element);
    this.listToDo[index].setItem(valueChange);
    this.saveToDo();
  }

  public saveToDo(): void {
    localStorage.setItem('toDos', JSON.stringify(this.listToDo));
  }

  public checkItemLeft(): void {
    var checkAll: HTMLElement = document.getElementById('label-check-all');
    var element: HTMLElement = document.getElementById('footer');
    var checkNumber: number = document.querySelectorAll('ul[id="todo-list"] li').length;
    var itemLeftText: String = document.getElementById('item-left').innerHTML;
    if (itemLeftText !== '0' || checkNumber !== 0) {
      element.classList.remove('hidden');
      checkAll.classList.remove('hidden');
    }
    if (itemLeftText === '0' && checkNumber === 0) {
      element.classList.add('hidden');
      checkAll.classList.add('hidden');
    }
  }

  public setCount(): void {
    var itemLeft: HTMLElement = document.getElementById('item-left');
    var clearAll: HTMLElement = document.getElementById('clear-completed');
    var allItemView: NodeListOf<Element> = document.querySelectorAll("div[class='view']");
    var listLabel: string[]= [];
    allItemView.forEach((element) => {
      listLabel.push(element.textContent);
    });
    var checkNumber: number = document.querySelectorAll(
      'div input[type="checkbox"]:checked'
    ).length;
    var allCheckBox: number = document.getElementsByClassName('check').length;
    itemLeft.innerHTML = (allCheckBox - checkNumber).toString();
    if (checkNumber != 0) {
      clearAll.classList.remove('hidden');
    } else {
      clearAll.classList.add('hidden');
    }
    this.checkItemLeft();
  }
  
  public changeSelectFilter(choose: String): void {
    var active: HTMLElement = document.getElementById('find-active');
    var complete: HTMLElement = document.getElementById('find-complete');
    var all: HTMLElement = document.getElementById('find-all');
    if (choose == 'find-active') {
      active.classList.add('selected');
      complete.classList.remove('selected');
      all.classList.remove('selected');
    }
    if (choose == 'find-all') {
      active.classList.remove('selected');
      complete.classList.remove('selected');
      all.classList.add('selected');
    }
    if (choose == 'find-complete') {
      active.classList.remove('selected');
      complete.classList.add('selected');
      all.classList.remove('selected');
    }
  }

  public findAllToDo(): void {
    const findAll: HTMLElement = document.getElementById('find-all');
    findAll.addEventListener('click', () => {
      var allItems: NodeListOf<HTMLLIElement> = document.querySelectorAll('ul[id="todo-list"] li');
      allItems.forEach((item) => {
        item.classList.remove('hidden');
      });
      this.changeSelectFilter('find-all');
    });
  }

  public findActiveToDo(): void {
    const findActive: HTMLElement = document.getElementById('find-active');
    findActive.addEventListener('click', (): void => {
      var allItems: NodeListOf<HTMLLIElement> = document.querySelectorAll('ul[id="todo-list"] li');
      allItems.forEach((item) => {
        item.querySelector(':checked')
          ? item.classList.add('hidden')
          : item.classList.remove('hidden');
      });
      this.changeSelectFilter('find-active');
    });
  }

  public findCompleteToDo(): void {
    var allComplete: HTMLElement = document.getElementById('find-complete');
    allComplete.addEventListener('click', (): void => {
      var allItems: NodeListOf<HTMLLIElement> = document.querySelectorAll('ul[id="todo-list"] li');
      allItems.forEach((item) => {
        item.querySelector(':checked')
          ? item.classList.remove('hidden')
          : item.classList.add('hidden');
      });
      this.changeSelectFilter('find-complete');
    });
  }

  public checkAllToDo(): void {
    var checkAllItem: HTMLElement = document.getElementById('label-check-all');
    checkAllItem.addEventListener('click', (): void => {
      var allCheckbox: NodeListOf<Element> = document.querySelectorAll('input[type=checkbox]');
      if (this.checkIfToDoIsComplete()) {
        allCheckbox.forEach((element) => {
          (element as HTMLInputElement).checked = false;
          this.changeAllStateToDo(false);
        });
      } else {
        allCheckbox.forEach((element) => {
          (element as HTMLInputElement).checked = true;
          this.changeAllStateToDo(true);
        });
      }
      this.setCount();
    });
  }

  public checkIfToDoIsComplete(): boolean {
    var allCheckbox: NodeListOf<Element> = document.querySelectorAll('div input[type=checkbox]');
    for (let element of allCheckbox) {
      if ((element as HTMLInputElement).checked == false) {
        return false;
      }
    }
    return true;
  }

  public clearAllComplete(): void {
    var clearAllComplete: HTMLElement = document.getElementById('clear-completed');
    clearAllComplete.addEventListener('click', (): void => {
      document.querySelectorAll('div input[type="checkbox"]:checked').forEach((item) => {
        this.removeToDo(item.closest('li'));
        item.closest('li').remove();
      });
      this.setCount();
      this.checkItemLeft();
    });
  }
}

const toDos = new todoList();