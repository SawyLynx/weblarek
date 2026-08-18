import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Products {
  private items: IProduct[] = [];
  private itemCard: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:updated', { items: this.items }); 
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setItemCard(item: IProduct): void {
    this.itemCard = item;
    this.events.emit('preview:changed', this.itemCard);
  }

  getItemCard(): IProduct | null {
    return this.itemCard;
  }
}
