import React from "react";
import { Link } from "react-router-dom";
import { appRoutes } from "app/routing/routes";
import css from "./home-logo.module.scss";

const HomeLogo: React.FC = () => (
    <Link to={appRoutes.home} className={css.wrapper}>
        <img src={process.env.PUBLIC_URL + "/logos/xhdpi-logo.png"} alt="Planshboard Logo" className={css.logo} />
        <h3 className={css.logoText}>Planshboard</h3>
    </Link>
);

export default React.memo(HomeLogo);
