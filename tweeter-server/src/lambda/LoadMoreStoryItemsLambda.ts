import {
  LoadPagedItemRequest,
  Status,
  LoadPagedItemResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export async function handler(
  event: LoadPagedItemRequest<Status>
): Promise<LoadPagedItemResponse<Status>> {
  let lastItem: Status | null = event.lastItem;
  if (event.lastItem) {
    lastItem = Status.fromJson(JSON.stringify(event.lastItem));
  }
  let data = await new StatusService().loadMoreStoryItems(
    event.authToken,
    event.user,
    event.pageSize,
    lastItem
  );
  let response = new LoadPagedItemResponse<Status>(...data);
  return response;
}
