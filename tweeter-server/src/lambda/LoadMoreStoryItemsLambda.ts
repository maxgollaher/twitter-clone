import {
  AuthToken,
  LoadPagedItemRequest,
  LoadPagedItemResponse,
  Status,
  User,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export async function handler(
  event: LoadPagedItemRequest<Status>
): Promise<LoadPagedItemResponse<Status>> {
  let lastItem = event.lastItem
    ? Status.fromJson(JSON.stringify(event.lastItem))
    : null;
  let authToken = AuthToken.fromJson(JSON.stringify(event.authToken));
  let user = User.fromJson(JSON.stringify(event.user));
  let pageSize = event.pageSize;

  if (!authToken || !user || !pageSize) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let data = await new StatusService().loadMoreStoryItems(
    authToken!,
    user!,
    pageSize,
    lastItem
  );
  let response = new LoadPagedItemResponse<Status>(...data);
  return response;
}
