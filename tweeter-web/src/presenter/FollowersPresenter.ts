import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE, PagedItemView } from "./PagedItemPresenter";

export class FollowersPresenter extends UserItemPresenter {
  public constructor(view: PagedItemView<User>) {
    super(view);
  }

  protected get view(): PagedItemView<User> {
    return super.view as PagedItemView<User>;
  }

  protected getMoreItems(
    authToken: AuthToken,
    user: User
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowers(
      authToken!,
      user!,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load follower items";
  }
}
