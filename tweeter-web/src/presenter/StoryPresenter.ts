import { AuthToken, Status, User } from "tweeter-shared";
import { PAGE_SIZE, PagedItemView } from "./PagedItemPresenter";
import { StatusItemPresenter } from "./StatusItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  public constructor(view: PagedItemView<Status>) {
    super(view);
  }

  protected get view(): PagedItemView<Status> {
    return super.view as PagedItemView<Status>;
  }

  protected getMoreItems(
    authToken: AuthToken,
    user: User
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems(
      authToken!,
      user!,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load story items";
  }
}
