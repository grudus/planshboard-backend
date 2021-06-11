import React, { useEffect } from "react";
import useFilter from "app/shared/hooks/useFilter";
import { useAppDispatch } from "store/useAppDispatch";
import { useRedux } from "store/rootReducer";
import { BoardGameActions } from "app/board-games/__store/boardGameActions";
import EmptyListPlaceholder from "app/board-games/list/empty/EmptyListPlaceholder";
import AddBoardGameButton from "app/board-games/list/add-button/AddBoardGameButton";
import css from "app/board-games/list/board-game-list.module.scss";
import SearchInput from "library/search-input/SearchInput";
import BoardGameList from "app/board-games/list/BoardGameList";
import LinkedBoardGameList from "app/board-games/list/LinkedBoardGameList";

const BoardGamesView: React.FC = () => {
    const { setFilter, filterCondition } = useFilter();
    const dispatch = useAppDispatch();
    const { boardGameExists } = useRedux(state => state.boardGame);

    useEffect(() => {
        dispatch(BoardGameActions.getBoardGames());
        dispatch(BoardGameActions.getLinkedBoardGames());
    }, [dispatch]);

    if (!boardGameExists) {
        return (
            <>
                <EmptyListPlaceholder />
                <AddBoardGameButton className={css.addButton} />
            </>
        );
    }

    return (
        <div>
            <div className={css.searchWrapper}>
                <SearchInput onTextChange={setFilter} hideLabel />
            </div>
            <AddBoardGameButton className={css.addButton} />

            <BoardGameList filterCondition={filterCondition} />
            <LinkedBoardGameList filterCondition={filterCondition} />
        </div>
    );
};

export default BoardGamesView;
