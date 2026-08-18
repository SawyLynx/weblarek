import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { WebLarekApi } from "./components/models/WebLarekApi";
import { Products } from "./components/models/Products";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";
import { Header } from "./components/models/Header";
import { Gallery } from "./components/models/Gallery";
import { Modal } from "./components/models/Modal";
import {
  CatalogCard,
  CardPreview,
  CartCard,
} from "./components/models/ProductCard";
import { CartContent } from "./components/models/CartContent";
import { FormError, IBuyer, IOrder, IProduct, TPayment } from "./types";
import { OrderData, OrderContacts } from "./components/models/Form";
import { Success } from "./components/models/Success";

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);
const products = new Products(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const catalogCard = document.querySelector(
  "#card-catalog"
) as HTMLTemplateElement;
const cardPreview = document.querySelector(
  "#card-preview"
) as HTMLTemplateElement;
const cartCard = document.querySelector("#card-basket") as HTMLTemplateElement;
const basket = document.querySelector("#basket") as HTMLTemplateElement;
const order = document.querySelector("#order") as HTMLTemplateElement;
const contacts = document.querySelector("#contacts") as HTMLTemplateElement;
const success = document.querySelector("#success") as HTMLTemplateElement;

const header = new Header(events, document.body);
const gallery = new Gallery(document.querySelector(".gallery") as HTMLElement);
const modal = new Modal(
  events,
  document.querySelector("#modal-container") as HTMLElement
);
const basketElement = (basket.content.cloneNode(true) as HTMLElement)
  .firstElementChild as HTMLElement;
const cartContent = new CartContent(events, basketElement);

let orderForm: OrderData | null = null;
let contactsForm: OrderContacts | null = null;

events.on("catalog:updated", () => {
  gallery.catalog = products.getItems().map((item) => {
    const template = catalogCard.content.cloneNode(true) as HTMLElement;

    const card = new CatalogCard(template, {
      onClick: () => events.emit("itemCard:select", item),
    });
    return card.render({
      title: item.title,
      category: item.category,
      price: item.price,
      image: CDN_URL + item.image,
    });
  });
});

events.on("itemCard:select", (item: IProduct) => {
  products.setItemCard(item);
});

events.on("preview:changed", (item: IProduct) => {
  const container = cardPreview.content.cloneNode(true) as HTMLElement;

  const cardPreviewView = new CardPreview(container, {
    onClick: () => {
      if (cart.isInTheCart(item.id)) {
        cart.removeItem(item.id);
      } else {
        cart.addItem(item);
      }
      modal.close();
    },
  });

  cardPreviewView.buttonText = cart.isInTheCart(item.id)
    ? "Удалить из корзины"
    : "Купить";

  modal.content = cardPreviewView.render({
    title: item.title,
    category: item.category,
    description: item.description,
    image: CDN_URL + item.image,
    price: item.price,
  });

  modal.open();
});

events.on("cart:updated", () => {
  header.counter = cart.getCount();

  cartContent.items = cart.getItems().map((item, index) => {
    const container = cartCard.content.cloneNode(true) as HTMLElement;

    const cartCardView = new CartCard(container, {
      onClick: () => cart.removeItem(item.id),
    });

    cartCardView.index = index + 1;
    return cartCardView.render({
      title: item.title,
      price: item.price,
    });
  });

  cartContent.total = cart.getPrice();
});

events.on("cart:open", () => {
  events.emit("cart:updated");
  modal.content = cartContent.render();
  modal.open();
});

events.on("order:open", () => {
  buyer.clearData();

  const formElement = (order.content.cloneNode(true) as HTMLElement)
    .firstElementChild as HTMLFormElement;
  formElement.name = "order";

  orderForm = new OrderData(events, formElement);
  contactsForm = null;

  orderForm.payment = undefined;

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    events.emit("order:submit");
  });

  modal.content = orderForm.render({
    valid: false,
    errors: ["Не выбран вид оплаты", "Укажите адрес"],
  });
  modal.open();
});

events.on(
  /^(order|contacts)\..*:change/,
  (data: { field: keyof IBuyer; value: string }) => {
    buyer.setData(data.field, data.value);

    if (data.field === "payment" && orderForm) {
      orderForm.payment = data.value as TPayment;
    }

    const errors = buyer.validateData();
    events.emit("formErrors:change", errors);
  }
);

events.on("formErrors:change", (errors: FormError) => {
  if (orderForm) {
    const orderDataValid = !errors.payment && !errors.address;
    orderForm.valid = orderDataValid;

    const orderDataErrors: string[] = [];
    if (errors.payment) orderDataErrors.push(errors.payment);
    if (errors.address) orderDataErrors.push(errors.address);
    orderForm.errors = orderDataErrors;
  } else if (contactsForm) {
    const orderContactsValid = !errors.email && !errors.phone;
    contactsForm.valid = orderContactsValid;

    const orderContactsErrors: string[] = [];
    if (errors.email) orderContactsErrors.push(errors.email);
    if (errors.phone) orderContactsErrors.push(errors.phone);
    contactsForm.errors = orderContactsErrors;
  }
});

events.on("order:submit", () => {
  const errors = buyer.validateData();

  const formElement = (contacts.content.cloneNode(true) as HTMLElement)
    .firstElementChild as HTMLFormElement;
  formElement.name = "contacts";

  contactsForm = new OrderContacts(events, formElement);
  orderForm = null;

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    events.emit("contacts:submit");
  });

  modal.content = contactsForm.render({
    valid: !errors.email && !errors.phone,
    errors: Object.values(errors).filter(
      (err) => err && (err.includes("email") || err.includes("телефон"))
    ),
  });
});

events.on("contacts:submit", () => {
  const final: IOrder = {
    ...buyer.getAllData(),
    total: cart.getPrice(),
    items: cart.getItems().map((item) => item.id),
  };

  webLarekApi
    .postOrder(final)
    .then((result) => {
      const template = success.content.cloneNode(true) as HTMLElement;

      const successView = new Success(template, {
        onClose: () => {
          modal.close();
        },
      });

      cart.clearCart();
      buyer.clearData();

      modal.content = successView.render({
        total: result.total,
      });
    })
    .catch((err) => {
      console.error("Произошла ошибка при отправке заказа на сервер:", err);
    });
});

events.on("modal:open", () => {
  document
    .querySelector(".page__wrapper")
    ?.classList.add("page__wrapper_locked");
});

events.on("modal:close", () => {
  document
    .querySelector(".page__wrapper")
    ?.classList.remove("page__wrapper_locked");
});

webLarekApi
  .getProductList()
  .then((data) => {
    products.setItems(data.items);
  })
  .catch((err) => {
    console.error("Не удалось загрузить каталог товаров:", err);
  });
