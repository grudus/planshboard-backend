import React, { useEffect } from "react";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { getAllOpponentsRequest } from "app/opponents/OpponentApi";
import { useRedux } from "store/rootReducer";

const OpponentList: React.FC = () => {
    console.log("@@@@ Opponent list render");
    const opponents = useRedux(state => state.opponent.list);
    const dispatch = useHttpDispatch();

    useEffect(() => {
        getAllOpponentsRequest(dispatch);
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            Hello OpponentList
            <ul>
                {opponents.map(op => (
                    <li key={op.id}>{op.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default OpponentList;
