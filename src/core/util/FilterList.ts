// A list that will only inlcude things that match the filter
export default class FilterList<T> implements Iterable<T> {
  private predicate: (item: T) => boolean;
  private _items: T[];

  constructor(predicate: (item: T) => boolean) {
    this.predicate = predicate;
    this._items = [];
  }

  addIfValid(item: T) {
    if (this.predicate(item)) {
      this._items.push(item);
    }
  }

  remove(item: T) {
    if (this.predicate(item)) {
      const index = this._items.indexOf(item);
      this._items.splice(index, 1);
    }
  }

  [Symbol.iterator]() {
    return this._items[Symbol.iterator]();
  }
}
