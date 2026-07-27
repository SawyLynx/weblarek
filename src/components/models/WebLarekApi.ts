import { IApi, IProductList, IOrder, IResult } from "../../types/index";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProductList(): Promise<IProductList> {
    return this.api.get<IProductList>("/product/");
  }

  postOrder(order: IOrder): Promise<IResult> {
    return this.api.post<IResult>("/order/", order);
  }
}
