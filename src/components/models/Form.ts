import { IForm, TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Form extends Component<IForm> {
  protected submit: HTMLButtonElement;
  protected error: HTMLElement;
  protected override readonly container: HTMLFormElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(container);

    this.container = container;
    this.submit = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      this.container
    );
    this.error = ensureElement<HTMLElement>(".form__errors", this.container);

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const formName =
        this.container.name || this.container.getAttribute("id") || "form";
      this.events.emit(`${formName}.${target.name}:change`, {
        field: target.name,
        value: target.value,
      });
    });
  }

  set valid(value: boolean) {
    this.submit.disabled = !value;
  }

  set errors(value: string[]) {
    this.error.textContent = value.join(", ");
  }
}

export class OrderData extends Form {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.cardButton = ensureElement<HTMLButtonElement>(
      "button[name=card]",
      this.container
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      "button[name=cash]",
      this.container
    );

    this.cardButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("order.payment:change", {
        field: "payment",
        value: "card",
      });
    });

    this.cashButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("order.payment:change", {
        field: "payment",
        value: "cash",
      });
    });
  }

  set payment(value: TPayment | undefined) {
    this.cardButton.classList.toggle("button_alt-active", value === "card");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }

  clearButtons() {
    this.cardButton.classList.remove("button_alt-active");
    this.cashButton.classList.remove("button_alt-active");
  }
}

export class OrderContacts extends Form {}
