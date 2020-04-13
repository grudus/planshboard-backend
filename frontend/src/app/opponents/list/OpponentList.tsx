import React, { useEffect } from "react";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { useRedux } from "store/rootReducer";
import { getAllOpponentsRequest } from "app/opponents/OpponentApi";

const OpponentList: React.FC = () => {
    const opponents = useRedux(state => state.opponent.list);
    const dispatch = useHttpDispatch();

    useEffect(() => {
        getAllOpponentsRequest(dispatch);
    }, [dispatch]);

    return (
        <div>
            <ul>
                {opponents.map(op => (
                    <li key={op.id}>{op.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default OpponentList;
