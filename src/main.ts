import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { WebLarekApi } from "./components/models/WebLarekApi";
import { Products } from "./components/models/Products";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";
import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { Modal } from "./components/view/Modal";
import { CatalogCard } from "./components/view/card/CatalogCard";
import { CardPreview } from "./components/view/card/CardPreview";
import { CartCard } from "./components/view/card/CartCard";
import { CartContent } from "./components/view/CartContent";
import { IBuyer, IOrder, IProduct } from "./types";
import { OrderContacts } from "./components/view/form/OrderContacts";
import { Success } from "./components/view/Success";
import { OrderData } from "./components/view/form/OrderData";

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

const orderFormElement = (order.content.cloneNode(true) as HTMLElement)
  .firstElementChild as HTMLFormElement;
orderFormElement.name = "order";
const orderForm = new OrderData(events, orderFormElement);

const contactsFormElement = (contacts.content.cloneNode(true) as HTMLElement)
  .firstElementChild as HTMLFormElement;
contactsFormElement.name = "contacts";
const contactsForm = new OrderContacts(events, contactsFormElement);

const cardPreviewElement = (cardPreview.content.cloneNode(true) as HTMLElement)
  .firstElementChild as HTMLElement;

const cardPreviewView = new CardPreview(cardPreviewElement, {
  onClick: () => events.emit("preview:submit"),
});

const syncFormViews = () => {
  const currentData = buyer.getAllData() || {};
  const errors = buyer.validateData() || {};

  orderForm.payment = currentData.payment;
  orderForm.address = currentData.address || "";
  contactsForm.email = currentData.email || "";
  contactsForm.phone = currentData.phone || "";

  const orderErrors = [errors.payment, errors.address].filter(
    Boolean
  ) as string[];
  orderForm.errors = orderErrors;
  orderForm.valid = orderErrors.length === 0;

  const contactsErrors = [errors.email, errors.phone].filter(
    Boolean
  ) as string[];
  contactsForm.errors = contactsErrors;
  contactsForm.valid = contactsErrors.length === 0;
};

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

events.on("preview:submit", () => {
  const currentItem = products.getItemCard();
  if (currentItem) {
    if (cart.isInTheCart(currentItem.id)) {
      cart.removeItem(currentItem.id);
    } else {
      cart.addItem(currentItem);
    }
    modal.close();
  }
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
  modal.content = cartContent.render();
  modal.open();
});

events.on("order:open", () => {
  syncFormViews();
  modal.content = orderForm.render();
  modal.open();
});

events.on("order:submit", () => {
  modal.content = contactsForm.render();
});

events.on(
  /^(order|contacts)\..*:change/,
  (data: { field: keyof IBuyer; value: string }) => {
    buyer.setData(data.field, data.value);
  }
);

events.on("buyer:changed", () => {
  syncFormViews();
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
  document.body.classList.add("page_locked");
});

events.on("modal:close", () => {
  document.body.classList.remove("page_locked");
});

webLarekApi
  .getProductList()
  .then((data) => {
    products.setItems(data.items);
  })
  .catch((err) => {
    console.error("Не удалось загрузить каталог товаров:", err);
  });
