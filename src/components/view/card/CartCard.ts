import { IProductCard } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { ProductCard } from "./ProductCard";

export class CartCard extends ProductCard {
  protected cardIndex: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IProductCard) {
    super(container);

    this.cardIndex = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    if (actions?.onClick) {
      this.deleteButton.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}
