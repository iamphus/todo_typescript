import { toDo } from './class/toDo.js';
class todoList {
    constructor() {
        this.listToDo = [];
        this.dataInit();
    }
    dataInit() {
        this.renderForm();
        this.renderData();
    }
    renderData() {
        const data = JSON.parse(localStorage.getItem('toDos'));
        if (data != null) {
            data.forEach((element) => {
                this.createNewTodo(element.item, element.isComplete);
                this.listToDo.push(new toDo(element.item, element.isComplete));
            });
            this.setCount();
            this.checkItemLeft();
        }
    }
    renderForm() {
        const input = document.getElementById('input');
        input.addEventListener('keypress', (event) => {
            var valueInput = input.value;
            var letterNumber = /^[ ]+$/;
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
    createNewTodo(item, isComplete) {
        let listView = document.querySelector('ul');
        let card = document.createElement('li');
        let dView = document.createElement('div');
        let checkedInput = document.createElement('input');
        let lbText = document.createElement('label');
        let btnRemove = document.createElement('button');
        dView.classList.add('view');
        checkedInput.classList.add('check');
        btnRemove.classList.add('remove');
        btnRemove.addEventListener('click', (event) => {
            this.removeToDo(event.target.closest('li'));
            event.target.closest('li').remove();
            this.setCount();
        });
        checkedInput.setAttribute('type', 'checkbox');
        checkedInput.setAttribute('id', 'btnCheck');
        checkedInput.addEventListener('click', () => {
            this.changeStateToDo(event.target.closest('li'));
            this.setCount();
        });
        lbText.setAttribute('id', 'text-label');
        lbText.setAttribute('contenteditable', 'true');
        lbText.textContent = item;
        if (isComplete) {
            checkedInput.setAttribute('checked', 'checked');
        }
        lbText.addEventListener('keypress', (event) => {
            if (event.keyCode === 13) {
                lbText.contentEditable = 'false';
                this.changeItemToDo(event.target.closest('li'));
                lbText.contentEditable = 'true';
            }
        });
        dView.appendChild(checkedInput);
        dView.appendChild(lbText);
        dView.appendChild(btnRemove);
        card.appendChild(dView);
        listView.appendChild(card);
    }
    getIndexOfToDo(element) {
        var nodes = Array.from(element.closest('ul').children);
        var index = nodes.indexOf(element);
        return index;
    }
    getStateOfToDo(element) {
        return element.querySelector("input[type='checkbox']").checked;
    }
    removeToDo(element) {
        for (let i = 0; i < this.listToDo.length; i++) {
            this.listToDo.splice(this.getIndexOfToDo(element), 1);
            break;
        }
        this.saveToDo();
    }
    addNewToDo(item, state) {
        this.listToDo.push(new toDo(item, state));
        this.saveToDo();
    }
    changeStateToDo(element) {
        var state = this.getStateOfToDo(element);
        var index = this.getIndexOfToDo(element);
        this.listToDo[index].setState(state);
        this.saveToDo();
    }
    changeAllStateToDo(state) {
        this.listToDo.forEach((element) => {
            element.setState(state);
        });
        this.saveToDo();
    }
    changeItemToDo(element) {
        var valueChange = element.querySelector('label').innerHTML;
        var index = this.getIndexOfToDo(element);
        this.listToDo[index].setItem(valueChange);
        this.saveToDo();
    }
    saveToDo() {
        localStorage.setItem('toDos', JSON.stringify(this.listToDo));
    }
    checkItemLeft() {
        var checkAll = document.getElementById('label-check-all');
        var element = document.getElementById('footer');
        var checkNumber = document.querySelectorAll('ul[id="todo-list"] li').length;
        var itemLeftText = document.getElementById('item-left').innerHTML;
        if (itemLeftText !== '0' || checkNumber !== 0) {
            element.classList.remove('hidden');
            checkAll.classList.remove('hidden');
        }
        if (itemLeftText === '0' && checkNumber === 0) {
            element.classList.add('hidden');
            checkAll.classList.add('hidden');
        }
    }
    setCount() {
        var itemLeft = document.getElementById('item-left');
        var clearAll = document.getElementById('clear-completed');
        var allItemView = document.querySelectorAll("div[class='view']");
        var listLabel = [];
        allItemView.forEach((element) => {
            listLabel.push(element.textContent);
        });
        var checkNumber = document.querySelectorAll('div input[type="checkbox"]:checked').length;
        var allCheckBox = document.getElementsByClassName('check').length;
        itemLeft.innerHTML = (allCheckBox - checkNumber).toString();
        if (checkNumber != 0) {
            clearAll.classList.remove('hidden');
        }
        else {
            clearAll.classList.add('hidden');
        }
        this.checkItemLeft();
    }
    changeSelectFilter(choose) {
        var active = document.getElementById('find-active');
        var complete = document.getElementById('find-complete');
        var all = document.getElementById('find-all');
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
    findAllToDo() {
        const findAll = document.getElementById('find-all');
        findAll.addEventListener('click', () => {
            var allItems = document.querySelectorAll('ul[id="todo-list"] li');
            allItems.forEach((item) => {
                item.classList.remove('hidden');
            });
            this.changeSelectFilter('find-all');
        });
    }
    findActiveToDo() {
        const findActive = document.getElementById('find-active');
        findActive.addEventListener('click', () => {
            var allItems = document.querySelectorAll('ul[id="todo-list"] li');
            allItems.forEach((item) => {
                item.querySelector(':checked')
                    ? item.classList.add('hidden')
                    : item.classList.remove('hidden');
            });
            this.changeSelectFilter('find-active');
        });
    }
    findCompleteToDo() {
        var allComplete = document.getElementById('find-complete');
        allComplete.addEventListener('click', () => {
            var allItems = document.querySelectorAll('ul[id="todo-list"] li');
            allItems.forEach((item) => {
                item.querySelector(':checked')
                    ? item.classList.remove('hidden')
                    : item.classList.add('hidden');
            });
            this.changeSelectFilter('find-complete');
        });
    }
    checkAllToDo() {
        var checkAllItem = document.getElementById('label-check-all');
        checkAllItem.addEventListener('click', () => {
            var allCheckbox = document.querySelectorAll('input[type=checkbox]');
            if (this.checkIfToDoIsComplete()) {
                allCheckbox.forEach((element) => {
                    element.checked = false;
                    this.changeAllStateToDo(false);
                });
            }
            else {
                allCheckbox.forEach((element) => {
                    element.checked = true;
                    this.changeAllStateToDo(true);
                });
            }
            this.setCount();
        });
    }
    checkIfToDoIsComplete() {
        var allCheckbox = document.querySelectorAll('div input[type=checkbox]');
        for (let element of allCheckbox) {
            if (element.checked == false) {
                return false;
            }
        }
        return true;
    }
    clearAllComplete() {
        var clearAllComplete = document.getElementById('clear-completed');
        clearAllComplete.addEventListener('click', () => {
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
