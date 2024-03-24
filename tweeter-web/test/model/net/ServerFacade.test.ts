import {
  RegisterRequest,
  GetUserInfoRequest,
  User,
  LoadPagedItemRequest,
  AuthToken,
  FakeData,
} from "tweeter-shared";
import "isomorphic-fetch";
import { instance, mock } from "ts-mockito";
import { ServerFacade } from "../../../src/model/net/ServerFacade";
import { ClientCommunicator } from "../../../src/model/net/ClientCommunicator";

describe("ServerFacade", () => {
  let serverFacade: ServerFacade;
  let clientCommunicatorMock: ClientCommunicator;
  let authToken: AuthToken;
  let user: User;

  beforeEach(() => {
    clientCommunicatorMock = mock(ClientCommunicator);
    serverFacade = new ServerFacade(); // Create an instance of the actual ServerFacade class
    (serverFacade as any).getClientCommunicator = jest
      .fn()
      .mockReturnValue(instance(clientCommunicatorMock)); // Mock the generateClientCommunicator method to return the mocked clientCommunicator
    authToken = new AuthToken("test", 12345);
    user = new User(
      "testFirstName",
      "testLastName",
      "testAlias",
      "testImageBytes"
    );
  });

  it("should register a new user", async () => {
    const request = new RegisterRequest(
      "testFirstName",
      "testLastName",
      "testAlias",
      "testPassword",
      "testImageBytes"
    );

    let response = await serverFacade.register(request);
    expect(response.user).toEqual(FakeData.instance.firstUser);
  });

  it("should get followers of a user", async () => {
    const request = new LoadPagedItemRequest<User>(authToken, user, 10, null);

    let response = await serverFacade.loadMoreFollowers(request);
    expect(response.items.length).toBe(10);
    expect(response.items).toBeInstanceOf(Array<User>);
  });

  it("should get followers count and followees count of a user", async () => {
    const request = new GetUserInfoRequest(authToken, user);

    let response = await serverFacade.getFollowersCount(request);
    expect(response.followCount).toBe(20);

    response = await serverFacade.getFolloweesCount(request);
    expect(response.followCount).toBe(10);
  });
});
