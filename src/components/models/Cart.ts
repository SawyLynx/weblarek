import { IProduct } from '../../types/index';

export class Cart {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
  }

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  clearCart(): void {
    this.items = [];
  }

  getPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  isInTheCart(id: string): boolean {
    return this.items.some(item => item.id === id)
  }
}