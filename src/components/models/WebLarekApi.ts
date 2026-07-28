import { IApi, IProductList, IOrder, IOrderResult } from "../../types/index";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProductList(): Promise<IProductList> {
    return this.api.get<IProductList>("/product/");
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order/", order);
  }
}
