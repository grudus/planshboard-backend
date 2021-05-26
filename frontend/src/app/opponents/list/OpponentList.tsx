import React, { useEffect, useState } from "react";
import { useRedux } from "store/rootReducer";
import OpponentListItem from "app/opponents/list-item/OpponentListItem";
import css from "./opponent-list.module.scss";
import FlipMove from "react-flip-move";
import SearchInput from "library/search-input/SearchInput";
import AddOpponentButton from "app/opponents/add-button/AddOpponentButton";
import { useAppDispatch } from "store/useAppDispatch";
import OpponentActions from "app/opponents/__store/opponentActions";

const OpponentList: React.FC = () => {
    const opponents = useRedux(state => state.opponent.list);
    const [filter, setFilter] = useState("");
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(OpponentActions.getAllOpponents());
    }, [dispatch]);

    return (
        <div>
            <div className={css.searchWrapper}>
                <SearchInput onTextChange={setFilter} hideLabel />
            </div>
            <FlipMove typeName="ul" className={css.list}>
                {opponents
                    .filter(op => !filter || op.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
                    .map(op => (
                        <li key={op.id}>
                            <OpponentListItem opponent={op} />
                        </li>
                    ))}
            </FlipMove>
            <AddOpponentButton className={css.addButton} />
        </div>
    );
};

export default OpponentList;
