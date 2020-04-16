import React from "react";
import OpponentForm from "app/opponents/form/OpponentForm";
import css from "./add-opponent.module.scss";

const AddOpponent: React.FC = () => {
    return (
        <article className={css.formWrapper}>
            <OpponentForm />
        </article>
    );
};

export default AddOpponent;
