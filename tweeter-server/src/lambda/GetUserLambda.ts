import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(event: GetUserRequest): Promise<GetUserResponse> {
  console.log("GetUserLambda: Processing event: ", event);
  console.log(event.username);

  console.log("GetUserRequest as JSON: ", JSON.stringify(event)); 
  console.log("GetUserRequest.username: ", JSON.parse(JSON.stringify(event)).username)

  event = JSON.parse(JSON.stringify(event));

  let data = await new UserService().getUser(event.authToken, event.username);
  let response = new GetUserResponse(data);
  return response;
}
