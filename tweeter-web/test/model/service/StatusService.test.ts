import { instance, mock } from "ts-mockito";
import { AuthToken, Status, User } from "tweeter-shared";
import { ServerFacade } from "../../../src/model/net/ServerFacade";
import { StatusService } from "../../../src/model/service/StatusService";
import "isomorphic-fetch";


describe("StatusService", () => {
    let statusService: StatusService;
    let authToken: AuthToken;
    let user: User;

    beforeAll(() => {
        let mockServerFacade = mock(ServerFacade);
        statusService = new StatusService();
        (statusService as any).getServerFacade = jest.fn().mockReturnValue(instance(mockServerFacade));
        authToken = new AuthToken("test", 12345);
        user = new User("testFirstName", "testLastName", "testAlias", "testImageBytes");
    });
    
    it("should return a user's story page", async () => {
        let response = await statusService.loadMoreStoryItems(authToken, user, 10, null);
        expect(response[0]).toBeInstanceOf(Array<Status>);
    });
});