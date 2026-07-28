import "./scss/styles.scss";
import { Cart } from "./components/models/Cart";
import { Products } from "./components/models/Products";
import { Buyer } from "./components/models/Buyer";
import { WebLarekApi } from "./components/models/WebLarekApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
//import { IProduct } from './types';
import { apiProducts } from "./utils/data";

const products = new Products();

products.setItems(apiProducts.items);

const getItems = products.getItems();
console.log("Массив товаров из каталога", getItems);

const getItemById = products.getItemById(apiProducts.items[0].id);
console.log(`Получение товара по ID ${apiProducts.items[0].id}`, getItemById);

const item1 = getItems[0];
const item2 = getItems[2];

products.setItemCard(item2);
console.log(
  "Получение товара для подробного отображения",
  products.getItemCard()
);

const cart = new Cart();

cart.addItem(item1);
cart.addItem(item2);
console.log("Получение массива товаров корзины", cart.getItems());
console.log("Получение количества товаров корзины", cart.getCount());
console.log("Получение стоимости товаров корзины", cart.getPrice());

cart.removeItem(item1.id);
console.log(
  "Получение массива товаров корзины, после удаления товара",
  cart.getItems()
);
console.log(
  "Получение количества товаров корзины, после удаления товара",
  cart.getCount()
);

console.log(
  `Проверка наличия товара в корзине по id ${item1.id}`,
  cart.isInTheCart(item1.id)
);
console.log(
  `Проверка наличия товара в корзине по id ${item2.id}`,
  cart.isInTheCart(item2.id)
);

cart.clearCart();
console.log(
  "Получение массива товаров, после очистки корзины",
  cart.getItems()
);

const buyer = new Buyer();

buyer.setData("address", "улица Новая, дом 14");
buyer.setData("phone", "+79999999999");

console.log("Получение всех данных пользователя", buyer.getAllData());

console.log("Валидация данных пользователя", buyer.validateData());

buyer.clearData();
console.log("Получение данных пользователя, после очистки", buyer);

const webLarekApi = new WebLarekApi(new Api(API_URL));

webLarekApi.getProductList().then((data) => {
  console.log("Получение данных с сервера", data);
  products.setItems(data.items);
  console.log("Сохранненые в массив данные с сервера", products.getItems());
})
.catch((err) => {
  console.error("Ошибка при получении данных с сервера", err)
})
;
