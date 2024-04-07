import { User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export abstract class UserItemPresenter extends PagedItemPresenter<
  User,
  FollowService
> {
  protected constructor(view: PagedItemView<User>) {
    super(view);
  }

  protected createService(): FollowService {
    return new FollowService();
  }
}
