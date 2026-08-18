import { TPayment, IBuyer, FormError } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment | "" = "";
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  constructor(protected events: IEvents) {}

  setData(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      this.payment = value as TPayment | "";
    } else {
      this[field] = value;
    }
  }

  getAllData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearData(): void {
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
    this.events.emit('data cleared', {});
  }

  validateData(): FormError {
    const error: FormError = {};

    if (!this.payment) {
      error.payment = "Не выбран вид оплаты";
    }
    if (!this.address.trim()) {
      error.address = "Укажите адрес";
    }
    if (!this.phone.trim()) {
      error.phone = "Укажите телефон";
    }
    if (!this.email.trim()) {
      error.email = "Укажите email";
    }

    return error;
  }
}
