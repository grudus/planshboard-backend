import React from "react";
import Dialog, { DialogProps } from "library/dialog/Dialog";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import { useRedux } from "store/rootReducer";
import css from "./select-board-game-dialog.module.scss";
import SearchInput from "library/search-input/SearchInput";
import useFilter from "app/shared/hooks/useFilter";
import { BoardGame } from "app/board-games/__models/BoardGameModels";
import useTranslations from "app/locale/__hooks/useTranslations";
import Heading from "library/text/Heading";

interface SelectBoardGameDialogProps extends DialogProps {
    onSelect: (id: number) => void;
}

const SelectBoardGameDialog: React.FC<SelectBoardGameDialogProps> = props => {
    const boardGames = useRedux(state => state.boardGame.list);
    const { setFilter, filterCondition } = useFilter();

    const selectGame = (game: BoardGame) => {
        props.onSelect(game.id);
        setFilter("");
        props.onCancel?.();
    };

    const selectFirstValue = () => {
        const game = boardGames.find(game => filterCondition(game.name));
        if (game) {
            selectGame(game);
        }
    };

    return (
        <Dialog open={props.open} mobileFull {...props}>
            <CardFormTitle>
                <Heading text="BOARD_GAMES.SELECT.TITLE" variant="h4" />
            </CardFormTitle>
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
                                        <Heading text={boardGame.name} />
                                    </button>
                                </li>
                            ))}
                    </ul>
                </section>
            </CardFormContent>
        </Dialog>
    );
};

export default React.memo(SelectBoardGameDialog);
