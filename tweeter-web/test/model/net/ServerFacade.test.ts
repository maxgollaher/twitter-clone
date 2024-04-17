import "isomorphic-fetch";
import { instance, mock } from "ts-mockito";
import {
  AuthToken,
  GetUserInfoRequest,
  LoadPagedItemRequest,
  LoginRequest,
  PostStatusRequest,
  RegisterRequest,
  Status,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "../../../src/model/net/ClientCommunicator";
import { ServerFacade } from "../../../src/model/net/ServerFacade";

describe("ServerFacade", () => {
  let serverFacade: ServerFacade;
  let clientCommunicatorMock: ClientCommunicator;
  let authToken: AuthToken | null = null;
  let status: Status;
  let user: User;

  beforeEach(() => {
    clientCommunicatorMock = mock(ClientCommunicator);
    serverFacade = new ServerFacade(); // Create an instance of the actual ServerFacade class
    (serverFacade as any).getClientCommunicator = jest
      .fn()
      .mockReturnValue(instance(clientCommunicatorMock)); // Mock the generateClientCommunicator method to return the mocked clientCommunicator
    user = new User("a", "a", "@a", "https://max-gollaher-tweeter.s3.us-west-2.amazonaws.com/image/@a.png");
    let currentTime = new Date().getTime();
    status = new Status("testStatus", user, currentTime);
  });

  it("should login a user", async () => {
    const request = new LoginRequest(user.alias, "a");
    let response = await serverFacade.login(request);
    expect(response).not.toBeNull();
    expect(response!.token).not.toBeNull();
    expect(response!.user!.alias).toEqual(user.alias);
    authToken = response!.token;
  });

  it("should post a status", async () => {
    const request = new PostStatusRequest(authToken, status);
    let response = await serverFacade.postStatus(request);
    expect(response.success).toBeTruthy();
  });

  it("should retrieve the status from the user's story", async () => {
    let request = new LoadPagedItemRequest<Status>(authToken, user, 10, null);
    let response = await serverFacade.loadMoreStoryItems(request);

    expect(response).not.toBeNull();
    expect(response!.items).not.toBeNull();
    expect(response!.items[0].post).toEqual(status.post); // Check that the post matches, due to the timestamp being slightly different
  });

});
