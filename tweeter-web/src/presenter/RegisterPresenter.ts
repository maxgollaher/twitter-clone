import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import {
  AuthenticatedPresenter,
  AuthenticatedView,
} from "./AuthenticatedPresenter";

export interface RegisterView extends AuthenticatedView {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter extends AuthenticatedPresenter {
  public constructor(view: RegisterView) {
    super(view);
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
    this.doAuthenticationOperation(
      async () => {
        let [user, authToken] = await this.service.register(
          firstName,
          lastName,
          alias,
          password,
          userImageBytes
        );
        this.view.updateUserInfo(user, user, authToken);
      },
      "register user",
      () => {
        this.view.navigate("/");
      }
    );
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
