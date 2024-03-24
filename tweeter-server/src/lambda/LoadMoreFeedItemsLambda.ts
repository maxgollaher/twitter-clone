
import { LoadPagedItemRequest, Status, LoadPagedItemResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";


 export async function handler (event: LoadPagedItemRequest<Status>): Promise<LoadPagedItemResponse<Status>> {
    let data = await new StatusService().loadMoreFeedItems(event.authToken, event.user, event.pageSize, event.lastItem);
    let response = new LoadPagedItemResponse<Status>(...data);
    return response;
  };
  