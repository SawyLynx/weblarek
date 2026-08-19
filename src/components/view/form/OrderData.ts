import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export class OrderData extends Form {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

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
    this.addressInput = ensureElement<HTMLInputElement>(
      "input[name=address]",
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

  set payment(value: TPayment | "" | undefined) {
    this.cardButton.classList.toggle("button_alt-active", value === "card");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
