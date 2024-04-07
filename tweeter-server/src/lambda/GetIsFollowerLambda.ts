import { GetIsFollowerRequest, GetIsFollowerResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { User } from "tweeter-shared";

export async function handler(
  event: GetIsFollowerRequest
): Promise<GetIsFollowerResponse> {
  let user = User.fromJson(JSON.stringify(event.user));
  let selectedUser = User.fromJson(JSON.stringify(event.selectedUser));

  let data = await new UserService().getIsFollowerStatus(
    event.authToken,
    user!,
    selectedUser!
  );
  let response = new GetIsFollowerResponse(data);
  return response;
}
