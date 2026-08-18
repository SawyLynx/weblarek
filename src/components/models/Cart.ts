import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Cart {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    if (!this.isInTheCart(item.id)) {
      this.items.push(item);
    }
    this.events.emit('cart:updated');
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('cart:updated');
  }

  clearCart(): void {
    this.items = [];
    this.events.emit('cart:updated');
  }

  getPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  isInTheCart(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
