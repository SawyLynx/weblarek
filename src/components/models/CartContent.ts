import { ICartContent } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class CartContent extends Component<ICartContent> {
  protected list: HTMLElement;
  protected totalPrice: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.list = ensureElement<HTMLElement>(".basket__list", this.container);
    this.totalPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );

    this.button.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length > 0) {
      this.list.replaceChildren(...items);
      this.button.disabled = false;
    } else {
      const emptyText = document.createElement("p");
      emptyText.textContent = "Корзина пуста";
      this.list.replaceChildren(emptyText);
      this.button.disabled = true;
    }
  }

  set total(value: number) {
    this.totalPrice.textContent = `${value} синапсов`;
  }
}
