import { injectable } from "inversify";

import { showErrorToast, showInfoToast } from "../../components/shared/Toast";
import { TTranslatedString } from "../../types";

@injectable()
export class NotificationCenter {
  public error(message: TTranslatedString): void {
    showErrorToast(message);
  }
  public info(message: TTranslatedString): void {
    showInfoToast(message);
  }
}
