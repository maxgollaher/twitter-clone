import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import { Presenter, View } from "./Presenter";

export interface RegisterView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken
  ) => void;
  navigate: (url: string) => void;
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter extends Presenter {
  private service: UserService;

  public constructor(view: RegisterView) {
    super(view);
    this.service = new UserService();
  }

  protected get view(): RegisterView {
    return super.view as RegisterView;
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array
  ) {
    this.doFailureReportingOperation(async () => {
      let [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        userImageBytes
      );
      this.view.updateUserInfo(user, user, authToken);
      this.view.navigate("/");
    }, "register user");
  }

  public handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }
}
