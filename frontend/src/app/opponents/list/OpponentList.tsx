import React, { useEffect, useState } from "react";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { useRedux } from "store/rootReducer";
import { getAllOpponentsRequest } from "app/opponents/OpponentApi";
import OpponentListItem from "app/opponents/list-item/OpponentListItem";
import css from "./opponent-list.module.scss";
import FlipMove from "react-flip-move";
import SearchInput from "library/search-input/SearchInput";
import AddOpponentButton from "app/opponents/add-button/AddOpponentButton";

const OpponentList: React.FC = () => {
    const opponents = useRedux(state => state.opponent.list);
    const [filter, setFilter] = useState("");
    const dispatch = useHttpDispatch();

    useEffect(() => {
        getAllOpponentsRequest(dispatch);
    }, [dispatch]);

    return (
        <div>
            <div className={css.searchWrapper}>
                <SearchInput onTextChange={setFilter} />
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
