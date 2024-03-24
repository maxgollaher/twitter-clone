
import { LoadPagedItemRequest, LoadPagedItemResponse, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";


 export async function handler (event: LoadPagedItemRequest<User>): Promise<LoadPagedItemResponse<User>> {
    let data = await new FollowService().loadMoreFollowees(event.authToken, event.user, event.pageSize, event.lastItem);
    let response = new LoadPagedItemResponse<User>(...data);
    return response;
  };
  