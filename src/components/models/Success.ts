import { ISuccessActions, ISuccessData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Success extends Component<ISuccessData> {
  protected button: HTMLButtonElement;
  protected description: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this.button = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );
    this.description = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );

    this.button.addEventListener("click", () => {
      actions.onClose();
    });
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}
