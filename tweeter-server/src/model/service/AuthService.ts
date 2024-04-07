import { AuthToken } from "tweeter-shared";
import { DaoFactory, IDao } from "../../dataAccess/DaoFactory";

export class AuthService {
  protected static DaoFactory = new DaoFactory();
  protected static authTokenDao: IDao =
    AuthService.DaoFactory.getAuthTokenDao();

  protected async verifyAuthToken(token: AuthToken): Promise<boolean> {
    token = AuthToken.fromJson(JSON.stringify(token))!;

    let authToken = await AuthService.authTokenDao.getItem(token.token);
    if (authToken == undefined) {
      throw new Error("Invalid token");
    }
    return true;
  }
}
