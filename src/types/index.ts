export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "card" | "cash";
export type FormError = Partial<Record<keyof IBuyer, string>>;

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | "";
  email: string;
  phone: string;
  address: string;
}

export interface IProductList {
  items: IProduct[];
  total: number;
}

export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IHeader {
  counter: number;
}

export interface IGallery {
  catalog: HTMLElement[];
}

export interface ICartContent {
  items: HTMLElement[];
  total: number;
}

export interface IProductCard {
  onClick: (event: MouseEvent) => void;
  index?: number;
  buttonText?: string;
}

export interface IModal {
  content: HTMLElement;
}

export interface IForm {
  valid: boolean;
  errors: string[];
}

export interface ISuccessActions {
  onClose: () => void;
}

export interface ISuccessData {
  total: number;
}
