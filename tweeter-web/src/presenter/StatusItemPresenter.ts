import { Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  StatusService
> {
  protected constructor(view: PagedItemView<Status>) {
    super(view);
  }

  protected createService(): StatusService {
    return new StatusService();
  }
}
