import {
  AuthToken,
  LoadPagedItemRequest,
  LoadPagedItemResponse,
  User,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export async function handler(
  event: LoadPagedItemRequest<User>
): Promise<LoadPagedItemResponse<User>> {
  let lastItem = event.lastItem ? User.fromJson(JSON.stringify(event.lastItem)) : null;
  let authToken = AuthToken.fromJson(JSON.stringify(event.authToken));
  let user = User.fromJson(JSON.stringify(event.user));
  let pageSize = event.pageSize;

  if (!authToken || !user || !pageSize) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let data = await new FollowService().loadMoreFollowees(
    authToken!,
    user!,
    pageSize,
    lastItem
  );
  let response = new LoadPagedItemResponse<User>(...data);
  return response;
}
