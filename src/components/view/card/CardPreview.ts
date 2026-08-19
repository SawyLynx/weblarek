import { IProductCard } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { ProductCard } from "./ProductCard";

export class CardPreview extends ProductCard {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

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
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    if (this.buttonElement) {
      this.buttonElement.textContent = value;
    }
  }

  set buttonDisabled(value: boolean) {
    if (this.buttonElement) {
      this.buttonElement.disabled = value;
    }
  }
}
