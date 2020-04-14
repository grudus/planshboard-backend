import React, { useEffect } from "react";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { useRedux } from "store/rootReducer";
import { getAllOpponentsRequest } from "app/opponents/OpponentApi";
import OpponentListItem from "app/opponents/list-item/OpponentListItem";
import { Opponent } from "app/opponents/__models/OpponentModels";
import css from "./opponent-list.module.scss";
import FlipMove from "react-flip-move";

const OpponentList: React.FC = () => {
    const opponents = useRedux(state => state.opponent.list);
    const dispatch = useHttpDispatch();

    const deleteOpponent = (opponent: Opponent) => {
        console.log("@DEEEELETE", opponent);
    };

    useEffect(() => {
        getAllOpponentsRequest(dispatch);
    }, [dispatch]);

    return (
        <div>
            <FlipMove typeName="ul" className={css.list}>
                {opponents.map(op => (
                    <li key={op.id}>
                        <OpponentListItem opponent={op} onDeleteClick={deleteOpponent} />
                    </li>
                ))}
            </FlipMove>
        </div>
    );
};

export default OpponentList;
