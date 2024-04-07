import { StatusService } from "../model/service/StatusService";
import {
  AuthToken,
  PostStatusRequest,
  PostStatusResponse,
  Status,
} from "tweeter-shared";

export async function handler(
  event: PostStatusRequest
): Promise<PostStatusResponse> {
  let authToken = AuthToken.fromJson(JSON.stringify(event.authToken));
  let status = Status.fromJson(JSON.stringify(event.status));

  if (!authToken || !status) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  return await new StatusService().postStatus(event.authToken, event.status);
}
