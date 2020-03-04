import React, { FunctionComponent } from "react";
import css from "./auth-wrapper.module.scss";
import { merge } from "../../../utils/cssUtils";

interface AuthFormWrapperProps {

}

const AuthFormWrapper: FunctionComponent<AuthFormWrapperProps> = (props) => {
  return (
    <div className={css.wrapper}>
      <div className={merge(css.halfItem, css.image)}>
        {"APP_TITLE"}
      </div>
      <div className={css.halfItem}>
        {props.children}
      </div>
    </div>
  );
};


export default AuthFormWrapper;
