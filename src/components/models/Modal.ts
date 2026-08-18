import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IModal } from "../../types";

export class Modal extends Component<IModal> {
  protected button: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.button = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );

    this.button.addEventListener("click", () => this.close());
    this.container.addEventListener("click", () => this.close());
    this.contentElement.addEventListener("click", (e) => e.stopPropagation());
  }

  set content(value: HTMLElement) {
    const targetElement =
      this.contentElement ||
      ensureElement<HTMLElement>(".modal__content", this.container);
    if (targetElement) {
      targetElement.replaceChildren(value);
    }
  }

  open() {
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:close");
  }
}
