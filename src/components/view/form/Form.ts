import { IForm } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export class Form extends Component<IForm> {
  protected submit: HTMLButtonElement;
  protected error: HTMLElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(container);

    this.submit = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      this.container
    );
    this.error = ensureElement<HTMLElement>(".form__errors", this.container);

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const formElement = this.container as HTMLFormElement;
      const formName =
        formElement.name || formElement.getAttribute("id") || "form";

      this.events.emit(`${formName}.${target.name}:change`, {
        field: target.name,
        value: target.value,
      });
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      const formElement = this.container as HTMLFormElement;
      const formName =
        formElement.name || formElement.getAttribute("id") || "form";
      this.events.emit(`${formName}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submit.disabled = !value;
  }

  set errors(value: string[]) {
    this.error.textContent = value.join(", ");
  }
}
