import { IProductCard } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { ProductCard } from "./ProductCard";

export class CatalogCard extends ProductCard {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: IProductCard) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );

    const targetElement = (this.container.firstElementChild ||
      this.container) as HTMLElement;
    if (actions?.onClick) {
      targetElement.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = "card__category";
    const modClass =
      categoryMap[value as keyof typeof categoryMap] || "card__category_other";
    this.categoryElement.classList.add(modClass);
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      value,
      this.titleElement.textContent || ""
    );
  }
}
