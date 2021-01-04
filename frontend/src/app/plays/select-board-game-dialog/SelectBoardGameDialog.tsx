import React from "react";
import Dialog from "library/dialog/Dialog";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import { useRedux } from "store/rootReducer";
import css from "./select-board-game-dialog.module.scss";
import MediumTitle from "library/text/MediumTitle";
import SearchInput from "library/search-input/SearchInput";
import useFilter from "app/shared/hooks/useFilter";
import { BoardGame } from "app/board-games/__models/BoardGameModels";
import useTranslations from "app/locale/__hooks/useTranslations";

export interface SelectBoardGame {
    onSelect: (id: number) => void;
    open: boolean;
    onClose: () => void;
}

const SelectBoardGameDialog: React.FC<SelectBoardGame> = props => {
    const boardGames = useRedux(state => state.boardGame.list);
    const { setFilter, filterCondition } = useFilter();
    const { translate } = useTranslations();

    const selectGame = (game: BoardGame) => {
        props.onSelect(game.id);
        setFilter("");
    };

    const selectFirstValue = () => {
        const game = boardGames.find(game => filterCondition(game.name));
        if (game) {
            props.onSelect(game.id);
            setFilter("");
        }
    };

    return (
        <Dialog open={props.open} onCancel={props.onClose} mobileFull>
            <CardFormTitle>{translate("BOARD_GAMES.SELECT.TITLE")}</CardFormTitle>
            <CardFormContent className={css.content}>
                <SearchInput hideLabel onTextChange={setFilter} autoFocus onEnter={selectFirstValue} />

                <section className={css.listSizeContainer}>
                    <ul className={css.boardGameOptionsWrapper}>
                        {boardGames
                            .filter(game => filterCondition(game.name))
                            .map(boardGame => (
                                <li
                                    key={boardGame.id}
                                    className={css.boardGameOption}
                                    onClick={() => selectGame(boardGame)}
                                >
                                    <button className={css.boardGameOptionButton}>
                                        <MediumTitle>{boardGame.name}</MediumTitle>
                                    </button>
                                </li>
                            ))}
                    </ul>
                </section>
            </CardFormContent>
        </Dialog>
    );
};

export default SelectBoardGameDialog;
