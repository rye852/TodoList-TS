interface Item {
  id: string;
  item: string;
  cheked: boolean;
}

class ListItem implements Item {
  constructor(
    private _id: string = '',
    private _item: string = '',
    private _cheked: boolean = false
  ) {}
  get id(): string {
    return this._id;
  }
  get item(): string {
    return this._item;
  }
  get cheked(): boolean {
    return this._cheked;
  }
  set id(value: string) {
    this._id = value;
  }
  set item(value: string) {
    this._item = value;
  }
  set cheked(value: boolean) {
    this._cheked = value;
  }
}

interface List {
  list: ListItem[];
  load(): void;
  save(): void;
  clearList(): void;
  addItem(itemObj: ListItem): void;
  removeItem(itemObj: ListItem): void;
}

class FullList implements List {
  static instance: FullList = new FullList();

  private constructor(private _list: ListItem[] = []) {}
  get list(): ListItem[] {
    return this._list;
  }
  set list(value) {
    this._list = value;
  }

  load(): void {
    const storedList: string | null = localStorage.getItem('MyList');
    if (typeof storedList !== 'string') return;

    const parstList: { _id: string; _item: string; _cheked: boolean }[] =
      JSON.parse(storedList);

    parstList.forEach((itemObj) => {
      const newListItem = new ListItem(
        itemObj._id,
        itemObj._item,
        itemObj._cheked
      );
      FullList.instance.addItem(newListItem);
    });
  }

  save(): void {
    localStorage.setItem('MyList', JSON.stringify(this._list));
  }
  clearList(): void {
    this._list = [];
    this.save();
  }
  addItem(itemObj: ListItem): void {
    this._list.push(itemObj);
    this.save();
  }
  removeItem(itemObj: ListItem): void {
    this._list = this._list.filter((item) => item.id !== itemObj.id);
    this.save();
  }
}

interface DOMList {
  ul: HTMLUListElement;
  clear(): void;
  runder(fullList: FullList): void;
}

class ListTemplate implements DOMList {
  ul: HTMLUListElement;
  static intance: ListTemplate = new ListTemplate();
  private constructor() {
    this.ul = document.querySelector('#listItems') as HTMLUListElement;
  }
  clear(): void {
    this.ul.innerHTML = '';
  }
  runder(fullList: FullList): void {
    this.clear();
    fullList.list.forEach((item) => {
      const li = document.createElement('li') as HTMLLIElement;
      li.className = 'item';
      const check = document.createElement('input') as HTMLInputElement;
      check.type = 'checkbox';
      check.id = item.id;
      check.checked = item.cheked;
      li.append(check);

      check.addEventListener('change', () => {
        item.cheked = !item.cheked;
        fullList.save();
      });

      const label = document.createElement('label') as HTMLLabelElement;
      label.htmlFor = item.id;
      label.textContent = item.item;
      li.append(label);

      const button = document.createElement('button') as HTMLButtonElement;
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


const initApp = (): void => {
  const fullListIstance = FullList.instance;
  const listTemplateInstance = ListTemplate.intance;

  const itemEntryForm = document.querySelector(
    '.newItemEntry__form'
  ) as HTMLFormElement;
  itemEntryForm.addEventListener('submit', (event: SubmitEvent): void => {
    event.preventDefault();

    const input = document.querySelector('#newItem') as HTMLInputElement;
    const newEntryText: string = input.value.trim();
    if (!newEntryText.length) return;
    const Itemid: number = fullListIstance.list.length + 1;

    const newItem = new ListItem(Itemid.toString(), newEntryText);
    fullListIstance.addItem(newItem);
    listTemplateInstance.runder(fullListIstance);
  });

  const clearItems = document.querySelector(
    '#clearItemsButton'
  ) as HTMLButtonElement;
  clearItems.addEventListener('click', () => {
    fullListIstance.clearList();
    listTemplateInstance.clear();
  });

  fullListIstance.load();
  listTemplateInstance.runder(fullListIstance);
};
document.addEventListener('DOMContentLoaded', initApp);

