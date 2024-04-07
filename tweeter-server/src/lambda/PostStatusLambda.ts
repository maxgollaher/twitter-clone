import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export async function handler(
  event: PostStatusRequest
): Promise<PostStatusResponse> {
  let request = PostStatusRequest.fromJson(JSON.stringify(event));

  if (!request || !request.authToken || !request.status) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  return await new StatusService().postStatus(
    request.authToken,
    request.status
  );
}
