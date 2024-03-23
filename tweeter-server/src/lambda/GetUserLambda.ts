import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


 export async function handler (event: GetUserRequest): Promise<GetUserResponse> {
    let data = await new UserService().getUser(event.authToken, event.username);
    let response = new GetUserResponse(data);
    return response;
  };