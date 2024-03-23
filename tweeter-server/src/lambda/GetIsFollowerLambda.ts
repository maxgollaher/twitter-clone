import { GetIsFollowerRequest, GetIsFollowerResponse} from "tweeter-shared";
import { UserService } from "../model/service/UserService";


 export async function handler (event: GetIsFollowerRequest): Promise<GetIsFollowerResponse> {
    let data = await new UserService().getIsFollowerStatus(event.authToken, event.user, event.selectedUser);
    let response = new GetIsFollowerResponse(data);
    return response;
  };