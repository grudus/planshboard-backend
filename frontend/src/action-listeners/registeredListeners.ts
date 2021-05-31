import { ActionListeners } from "store/listenForActionMiddleware";
import { LoginListener } from "app/auth/__listeners/loginListener";
import { LogoutListener } from "app/auth/__listeners/logoutListener";
import { HttpErrorListener } from "app/shared/listeners/httpErrorListener";

export const registeredListeners: ActionListeners = new Map([LoginListener, LogoutListener, HttpErrorListener]);
