import { AuthToken, PostStatusRequest, Status } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const BATCH_SIZE = 25;

export async function handler(event: any): Promise<void> {
  console.log("Received event: ", JSON.stringify(event));
  console.log("Received event body: ", JSON.stringify(event.Records[0].body));
  let authTokenJSON = JSON.parse(event.Records[0].body).authToken;
  let statusJSON = JSON.parse(event.Records[0].body).status;

  console.log("authToken: ", JSON.stringify(authTokenJSON));
  console.log("status: ", JSON.stringify(statusJSON));

  let authToken = AuthToken.fromJson(JSON.stringify(authTokenJSON));
  let status = Status.fromJson(JSON.stringify(statusJSON));

  if (!status || !authToken) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let sqsURL =
    "https://sqs.us-west-2.amazonaws.com/885896080876/Update-Feed-Queue";
  let sqsClient = new SQSClient();

// Start with a null lastItem to load the first batch of followers
let lastItem = null;
let hasMore: boolean = true;

while (hasMore) {
  // Load the next batch of followers
  let followers = await new FollowService().loadMoreFollowers(
    authToken,
    status.user,
    BATCH_SIZE,
    lastItem
  );

  // Check if followers array is empty or has less than BATCH_SIZE items
  if (!followers[0].length || followers[0].length < BATCH_SIZE) {
    hasMore = false;
  } else {
    // Set lastItem to the last follower in the current batch
    lastItem = followers[0][followers[0].length - 1];
  }

  // Construct messageBody with followers and status
  let messageBody = JSON.stringify({
    followers: followers[0],
    status: status,
  });

  console.log("Sending message: ", messageBody);

  try {
    // Send message to SQS queue
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: sqsURL,
        MessageBody: messageBody,
      })
    );
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    throw new Error("[Internal Server Error] Failed to send message to SQS.");
  }
}
}
