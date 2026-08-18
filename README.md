# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

#### Данные
В ходе анализа проекта было установлено: в приложении используются две сущности, которые описывают данные, — товар и покупатель. Их можно описать такими интерфейсами:
Товар:
```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
} 
```
Покупатель:
```
interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}
```
В ходе анализа проекта было установлено: в приложении используются три зоны ответственности —  хранение товаров, которые можно купить в приложении, хранение товаров, которые пользователь выбрал для покупки и данные покупателя, которые тот должен указать при оформлении заказа. Их можно описать такими классами:

Каталог товаров хранит массив всех товаров; хранит товар, выбранный для подробного отображения. Содержит методы: сохранение массива товаров полученного в параметрах метода; получение массива товаров из модели; получение одного товара по его id; сохранение товара для подробного отображения; получение товара для подробного отображения:
```
class Products {
  private items: IProduct[] = [];
  private itemCard: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setItemCard(item: IProduct): void {
    this.itemCard = item;
  }

  getItemCard(): IProduct | null {
    return this.itemCard;
  }
} 
```
Корзина хранит массив товаров, выбранных покупателем для покупки. Содержит методы: получение массива товаров, которые находятся в корзине; добавление товара, который был получен в параметре, в массив корзины;
удаление товара, полученного в параметре из массива корзины; очистка корзины; получение стоимости всех товаров в корзине; получение количества товаров в корзине; проверка наличия товара в корзине по его id, полученного в параметр метода:
```
class Cart {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit('item added');
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('item removed');
  }

  clearCart(): void {
    this.items = [];
    this.events.emit('cart cleared');
  }

  getPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  isInTheCart(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
```
Покупатель хранит следующие данные о виде оплаты; адреcе; телефоне; email. Содержит методы: сохранение данных в модели; получение всех данных покупателя; очистка данных покупателя; валидация данных:
```
class Buyer {
  private payment: TPayment | '' = '';
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  constructor(protected events: IEvents) {}

  setData(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      this.payment = value as TPayment | '';
    } else {
      this[field] = value;
    }
  }

  getAllData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email
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
```

#### Слой коммуникации
В ходе анализа проекта было установлено: при взаимодействии с сервером приложение получает и отправляет три сущности. Они описывают следующие данные: список товаров, полученный с сервера, созданный заказ и подтвержденный заказ. Их можно описать такими интерфейсами:
Список товаров:
```
export interface IProductList {
    items: IProduct[];
    total: number;
}
```
Создание заказа:
```
export interface IOrder extends IBuyer {
    items: string[];
    total: number;
}
```
Подтверждение заказа:
```
export interface IResult  {
    id: string;
    total: number;
}
```
В ходе анализа проекта было установлено: приложение взаимодействует с другими приложениями и хранилищами. Эти функции можно описать классом, отвечающим за получение данных и отправку данных на сервер.

Класс WebLarekApi хранит данные api. Содержит методы: получение списка товаров с сервера; отправка данных заказа на сервер: 
```
class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
      this.api = api
  }

  getProductList(): Promise<IProductList> {
      return this.api.get<IProductList>('/product/');
  }

  postOrder(order: IOrder): Promise<IResult> {
      return this.api.post<IResult>('/order/', order);
  }  
}
```

#### Слой представления
В ходе анализа проекта было установлено: в приложении используются сущности, которые описывают блоки сайта, — шапку, галерею, корзину, карточки товаров, модальные окна, формы оформления и окно успешного оформления заказа. Их можно описать следующими интерфейсами:
Шапка:
```
interface IHeader {
  counter: number;
}
```
Галерея:
```
interface IGallery {
  catalog: HTMLElement[];
}
```
Корзина:
```
interface ICartContent {
  items: HTMLElement[];
  total: number;
}
```
Карточка товара:
```
interface IProductCard {
  onClick: (event: MouseEvent) => void;
  index?: number;
  buttonText?: string;
}
```
Модальное окно:
```
interface IModal {
  content: HTMLElement;
}
```
Форма оформления заказа:
```
interface IForm {
  valid: boolean;
  errors: string[];
}
```
Окно успешного оформления заказа, сожержит два интерфейса:
```
export interface ISuccessActions {
  onClose: () => void;
}

export interface ISuccessData {
  total: number;
}
```
В ходе анализа проекта было установлено: в приложении используются блоки шапки, галереи, корзины, карточек товаров, модальных окон, формы оформления и окно успешного оформления заказа. Их можно описать следующими классами:

Шапка хранит счетчик количества товаров в корзине и кнопку открытия корзины. Наследует интерфейс IHeader. Содержит метод изменения счетчика товаров:
```
class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open')
    })
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
```
Галерея хранит каталог товаров. Наследует интерфейс IGallery. Содержит метод, заменяющий содержимое галлереи новыми элементами:
```
class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    
    this.catalogElement = this.container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items)
  }
}
```
Корзина хранит список товаров в корзине, общую сумму товаров в корзине и кнопку закрытия окна корзины. Наследует интерфейс ICartContent. Содержит методы отображения и подсчета количества товаров в корзине, а также подсчета и вывода общей суммы товаров в корзине:
```
class CartContent extends Component<ICartContent> {
  protected list: HTMLElement;
  protected totalPrice: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    
    this.list = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.button.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length > 0) {
      this.list.replaceChildren(...items);
      this.button.disabled = false;
    } else {
      const emptyText = document.createElement('p');
      emptyText.textContent = 'Корзина пуста';
      this.list.replaceChildren(emptyText);
      this.button.disabled = true;
    }
  }

  set total(value: number) {
    this.totalPrice.textContent = `${value} синапсов`;
  }
}
```
Карточка товара состоит из родительского класса и трех дочерних. Родительский класс ProductCard хранит название товара и его цену. Наследует интерфейс IProduct. Содержит методы загрузки названия и установки цены товара, а также бокировки кнопки покупки, если цена товара не установленна. 
Класс ProductCard наследуют три класса: CatalogCard, CardPreview и CartCard, которые отвечают за разные варианты отображения карточки. 
Класс CatalogCard отвечает за карточку товара в каталоге-галерее. Класс хранит изображение товара и его категорию. Содержит методы загрузки категории и изображения. 
Класс CardPreview отвечает за карточку товара в открытую в самостоятельном модальном окне. Класс хранит картинку, категорию, описание товара и кнопку его покупки. Содержит методы загрузки изображения, описания, категории, цены товара, а также отображение кнопки покупки товара. 
Класс CartCard отвечает за оотбражение карточки в корзине. Класс хранит индекс товара и кнопку его удаления из корзины. Содержит метод загрузки индекса.
```
class ProductCard extends Component<IProduct> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (value == null) {
      this.priceElement.textContent = 'Бесценно';
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }
}

class CatalogCard extends ProductCard {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: IProductCard) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    const targetElement = (this.container.firstElementChild || this.container) as HTMLElement;
    if (actions?.onClick) {
      targetElement.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = 'card__category';
    const modClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
    this.categoryElement.classList.add(modClass);
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent || '');
  }
}

class CardPreview extends ProductCard {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IProductCard) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = 'card__category';
    const modClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
    this.categoryElement.classList.add(modClass);
  }
  
  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent || '');
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    if (this.buttonElement) {
      this.buttonElement.textContent = value;
    }
  }

  override set price(value: number | null) {
    super.price = value;
    if (value == null && this.buttonElement) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = 'Недоступно';
    }
  }
}

class CartCard extends ProductCard {
  protected cardIndex: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IProductCard) {
    super(container);

    this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onClick) {
      this.deleteButton.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}
```
Модальное окно хранит кнопку закрытия и контент модального окна. Наследует интерфейс IModal. Содержит методы загрузки контента, открытия и закрытия модального окна:
```
class Modal extends Component<IModal> {
  protected button: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.button = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.button.addEventListener('click', () => this.close());
    this.container.addEventListener('click', () => this.close());
    this.contentElement.addEventListener('click', (e) => e.stopPropagation());
  }

  set content(value: HTMLElement) {
    const targetElement = this.contentElement || ensureElement<HTMLElement>('.modal__content', this.container);
    if (targetElement) {
      targetElement.replaceChildren(value);
    }
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }
}
```
Форма оформления заказа состоит из родительского класса и двух дочерних. Родительский класс Form хранит кнопку подтверждения, формат ошибки и форму. Наследует интерфейс IForm. Содержит методы проверяющий правильность заполнения формы согласно валидации и отображающий ошибки. 
Класс Form наследуют два класса: OrderData и OrderContacts, которые отвечают за разные стадии заполнения формы. Класс OrderData хранит две кнопки, отвечающие за разные виды оплаты заказа. Содержит методы выбора типа оплаты и удаления выбранного товара. Класс OrderContacts отвечает за форму ввода телефона и электронной почты.
```
class Form extends Component<IForm> {
  protected submit: HTMLButtonElement;
  protected error: HTMLElement;
  protected override readonly container: HTMLFormElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(container);

    this.container = container;
    this.submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this.error = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const formName = this.container.name || this.container.getAttribute('id') || 'form';
      this.events.emit(`${formName}.${target.name}:change`, {
        field: target.name,
        value: target.value
      });
    });
  }

  set valid(value: boolean) {
    this.submit.disabled = !value;
  }

  set errors(value: string[]) {
    this.error.textContent = value.join(', ');
  }
}

class OrderData extends Form {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.cardButton = ensureElement<HTMLButtonElement>('button[name=card]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name=cash]', this.container);

    this.cardButton.addEventListener('click', (e) => { 
      e.preventDefault(); 
      this.events.emit('order.payment:change', { field: 'payment', value: 'card' });
    });

    this.cashButton.addEventListener('click', (e) => { 
      e.preventDefault(); 
      this.events.emit('order.payment:change', { field: 'payment', value: 'cash' });
    });
  }

  set payment(value: TPayment | undefined) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  clearButtons() {
    this.cardButton.classList.remove('button_alt-active');
    this.cashButton.classList.remove('button_alt-active');
  }
}

class OrderContacts extends Form {}
```
Окно успешного оформления заказа заказа хранит кнопку закрытия и описание окна успешного оформления заказа. Наследует интерфейс ISuccessData. Содержит метод подсчета и вывода на экран общей списанной суммы:
```
class Success extends Component<ISuccessData> {
  protected button: HTMLButtonElement;
  protected description: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this.button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.description = ensureElement<HTMLElement>('.order-success__description', this.container);

    this.button.addEventListener('click', () => {
      actions.onClose();
    });
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}
```

#### Презентер
Презентер приложения отвечает за логику работы главной страницы. Код Презентера описан в виде обработчиков событий в основном файле проекта - main.ts.
Обработчик событий 'catalog:updated' вызывается при обновлениях и изменениях в каталоге товаров, а затем передает каталог в галерею.

Обработчик событий 'itemCard:select' вызывается при выборе карточки товара в каталоге на сайте.
Обработчик событий 'preview:changed' вызывается при нажатии на кнопку 'Купить' в карточке выбранного товара, изменяя текст кнопки на 'Удалить из корзины'.
Обработчик событий 'cart:updated' вызывается при изменениях в корзине с товарами, в том числе при добавлении и удалении товаров из корзины.
Обработчик событий 'cart:open' вызывается при открытии корзины.
Обработчик событий 'order:open' вызывается при открытии окна оформления заказа.
Обработчик событий 'formErrors:change' вызывается при изменении статуса валидации введенных пользотелем данных в форму.
Обработчик событий 'order:submit' вызывается при открытия второго окна формы с полями для ввода телефона и электронной почты.
Обработчик событий 'contacts:submit' вызывается при отправки всех введенных пользователем данных для оформления заказа на сервер.
Обработчик событий 'modal:open' вызывается при открытии модального окна.
Обработчик событий 'modal:close' вызывается при закрытии модального окна.