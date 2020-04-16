import React, { FormEvent, useState } from "react";
import OpponentForm from "app/opponents/form/OpponentForm";

const AddOpponent: React.FC = () => {
    const [opponentName, setOpponentName] = useState("");
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        alert("Submit " + opponentName);
    };
    return <OpponentForm />;
};

export default AddOpponent;
