import React, { ChangeEvent, useState } from "react";
import FancyRadio from "library/fancy-radio/FancyRadio";
import Icons from "library/icons/Icons";
import css from "./board-game-options.module.scss";
import { FinalResult } from "app/plays/__models/PlayModels";

const BoardGameOptions: React.FC = () => {
    const [gameType, setGameType] = useState("REGULAR");

    const changeGameType = (a: ChangeEvent<HTMLInputElement>) => {
        const result = a.target.value as FinalResult;
        setGameType(result);
    };

    return (
        <div>
            <h6>Rodzaj gry</h6>
            <div className={css.gameTypeWrapper} onChange={changeGameType}>
                <FancyRadio
                    text={"Tradycyjna"}
                    icon={Icons.HiveIcon}
                    value="REGULAR"
                    inputName="type"
                    selectedValue={gameType}
                    selectedClassName={css.selectedType}
                />
                <FancyRadio
                    text={"Kooperacyjna"}
                    icon={Icons.PolygonIcon}
                    value="COOPERATIVE"
                    inputName="type"
                    selectedValue={gameType}
                    selectedClassName={css.selectedType}
                />
            </div>
        </div>
    );
};

export default BoardGameOptions;
