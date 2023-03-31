"use strict";
class ListItem {
    constructor(_id = '', _item = '', _cheked = false) {
        this._id = _id;
        this._item = _item;
        this._cheked = _cheked;
    }
    get id() {
        return this._id;
    }
    get item() {
        return this._item;
    }
    get cheked() {
        return this._cheked;
    }
    set id(value) {
        this._id = value;
    }
    set item(value) {
        this._item = value;
    }
    set cheked(value) {
        this._cheked = value;
    }
}
class FullList {
    constructor(_list = []) {
        this._list = _list;
    }
    get list() {
        return this._list;
    }
    set list(value) {
        this._list = value;
    }
    load() {
        const storedList = localStorage.getItem('MyList');
        if (typeof storedList !== 'string')
            return;
        const parstList = JSON.parse(storedList);
        parstList.forEach((itemObj) => {
            const newListItem = new ListItem(itemObj._id, itemObj._item, itemObj._cheked);
            FullList.instance.addItem(newListItem);
        });
    }
    save() {
        localStorage.setItem('MyList', JSON.stringify(this._list));
    }
    clearList() {
        this._list = [];
        this.save();
    }
    addItem(itemObj) {
        this._list.push(itemObj);
        this.save();
    }
    removeItem(itemObj) {
        this._list = this._list.filter((item) => item.id !== itemObj.id);
        this.save();
    }
}
FullList.instance = new FullList();
class ListTemplate {
    constructor() {
        this.ul = document.querySelector('#listItems');
    }
    clear() {
        this.ul.innerHTML = '';
    }
    runder(fullList) {
        this.clear();
        fullList.list.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'item';
            const check = document.createElement('input');
            check.type = 'checkbox';
            check.id = item.id;
            check.checked = item.cheked;
            li.append(check);
            check.addEventListener('change', () => {
                item.cheked = !item.cheked;
                fullList.save();
            });
            const label = document.createElement('label');
            label.htmlFor = item.id;
            label.textContent = item.item;
            li.append(label);
            const button = document.createElement('button');
            button.className = 'button';
            button.textContent = 'X';
            li.append(button);
            button.addEventListener('click', () => {
                fullList.removeItem(item);
                this.runder(fullList);
            });
            this.ul.append(li);
        });
    }
}
ListTemplate.intance = new ListTemplate();
const initApp = () => {
    const fullListIstance = FullList.instance;
    const listTemplateInstance = ListTemplate.intance;
    const itemEntryForm = document.querySelector('.newItemEntry__form');
    itemEntryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.querySelector('#newItem');
        const newEntryText = input.value.trim();
        if (!newEntryText.length)
            return;
        const Itemid = fullListIstance.list.length + 1;
        const newItem = new ListItem(Itemid.toString(), newEntryText);
        fullListIstance.addItem(newItem);
        listTemplateInstance.runder(fullListIstance);
    });
    const clearItems = document.querySelector('#clearItemsButton');
    clearItems.addEventListener('click', () => {
        fullListIstance.clearList();
        listTemplateInstance.clear();
    });
    fullListIstance.load();
    listTemplateInstance.runder(fullListIstance);
};
document.addEventListener('DOMContentLoaded', initApp);
