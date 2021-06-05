import React, { ChangeEvent, useState } from "react";
import FancyRadio from "library/fancy-radio/FancyRadio";
import Icons from "library/icons/Icons";
import css from "./board-game-options.module.scss";
import {
    BoardGamePlayResultsOptions,
    BoardGameType,
    defaultGameOptions,
} from "app/board-games/__models/BoardGameModels";
import Checkbox from "library/checkbox/Checkbox";
import Heading from "library/text/Heading";

export interface BoardGameOptionsProps {
    options: BoardGamePlayResultsOptions;
    onChangeOptions: (options: BoardGamePlayResultsOptions) => void;
}

const BoardGameOptions: React.FC<BoardGameOptionsProps> = props => {
    const [userChangedData, setUserChangedData] = useState(!props.options.isDefault);

    const changeGameType = (a: ChangeEvent<HTMLInputElement>) => {
        const result = a.target.value as BoardGameType;
        const changedOptions = userChangedData ? props.options : defaultGameOptions.get(result)!;
        props.onChangeOptions({ ...changedOptions, gameType: result });
    };

    const changeSingleOption = (optionName: keyof BoardGamePlayResultsOptions) => (value: any) => {
        const newOptions = { ...props.options, [optionName]: value };
        setUserChangedData(true);
        props.onChangeOptions(newOptions);
    };

    return (
        <div>
            <Heading text="BOARD_GAMES.OPTIONS.GAME_TYPE" variant="h6" />
            <div className={css.gameTypeWrapper} onChange={changeGameType}>
                <FancyRadio
                    text="BOARD_GAMES.OPTIONS.TRADITIONAL"
                    icon={Icons.HiveIcon}
                    value="REGULAR"
                    inputName="type"
                    selectedValue={props.options.gameType}
                    selectedClassName={css.selectedType}
                />
                <FancyRadio
                    text="BOARD_GAMES.OPTIONS.COOPERATIVE"
                    icon={Icons.PolygonIcon}
                    value="COOPERATIVE"
                    inputName="type"
                    selectedValue={props.options.gameType}
                    selectedClassName={css.selectedType}
                />
            </div>

            <Heading text="BOARD_GAMES.OPTIONS.SHOW_WHEN_CREATING_PLAY" variant="h6" />

            <div className={css.gameSettingsWrapper}>
                <Checkbox
                    text="BOARD_GAMES.OPTIONS.SHOW_POSITION"
                    checked={props.options.showPosition}
                    onCheck={changeSingleOption("showPosition")}
                />
                <Checkbox
                    text="BOARD_GAMES.OPTIONS.SHOW_POINTS"
                    checked={props.options.showPoints}
                    onCheck={changeSingleOption("showPoints")}
                />
                <Checkbox
                    text="BOARD_GAMES.OPTIONS.SHOW_NOTE"
                    checked={props.options.showNote}
                    onCheck={changeSingleOption("showNote")}
                />
                <Checkbox
                    text="BOARD_GAMES.OPTIONS.SHOW_DATE"
                    checked={props.options.showDate}
                    onCheck={changeSingleOption("showDate")}
                />
                <Checkbox
                    text="BOARD_GAMES.OPTIONS.SHOW_TAGS"
                    checked={props.options.showTags}
                    onCheck={changeSingleOption("showTags")}
                />
            </div>
        </div>
    );
};

export default React.memo(BoardGameOptions);
