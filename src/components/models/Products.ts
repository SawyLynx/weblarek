import { IProduct } from '../../types/index';

export class Products {
  private items: IProduct[] = [];
  private itemCard: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setItemCard(item: IProduct): void {
    this.itemCard = item;
  }

  getItemCard(): IProduct | null {
    return this.itemCard;
  }
}