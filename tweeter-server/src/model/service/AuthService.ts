import { AuthToken } from "tweeter-shared";
import { DaoFactory, IDao } from "../../dataAccess/DaoFactory";

export class AuthService {
  protected static db = new DaoFactory();
  protected static authTokenDao: IDao =
    AuthService.db.authToken;

  protected async verifyAuthToken(token: AuthToken): Promise<void> {
    let authToken = await AuthService.authTokenDao.getItem(token.token);
    if (!authToken) {
      throw new Error("[Unauthorized] Invalid token");
    }
  }
}
