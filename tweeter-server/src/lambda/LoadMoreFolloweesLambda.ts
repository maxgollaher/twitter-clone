import {
  LoadPagedItemRequest,
  LoadPagedItemResponse,
  User,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export async function handler(
  event: LoadPagedItemRequest<User>
): Promise<LoadPagedItemResponse<User>> {
  let lastItem: User | null = event.lastItem;
  if (event.lastItem) {
    lastItem = User.fromJson(JSON.stringify(event.lastItem));
  }

  let data = await new FollowService().loadMoreFollowees(
    event.authToken,
    event.user,
    event.pageSize,
    lastItem
  );
  let response = new LoadPagedItemResponse<User>(...data);
  return response;
}
