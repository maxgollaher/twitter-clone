import { GetUserInfoRequest, GetUserInfoResponse} from "tweeter-shared";
import { UserService } from "../model/service/UserService";


 export async function handler (event: GetUserInfoRequest): Promise<GetUserInfoResponse> {
    let data = await new UserService().getFollowersCount(event.authToken, event.user);
    let response = new GetUserInfoResponse(data);
    return response;
  };