import React, { useEffect } from "react";
import { useRedux } from "store/rootReducer";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { getAllPlaysRequest } from "app/plays/PlayApi";

const PlayList: React.FC = () => {
    const plays = useRedux(state => state.play.list);
    const dispatch = useHttpDispatch();

    useEffect(() => {
        getAllPlaysRequest(dispatch);
    }, [dispatch]);

    return (
        <>
            <div>Hello PlayList</div>

            <ul>
                {plays?.map(play => (
                    <li key={play.id}>{JSON.stringify(play)}</li>
                ))}
            </ul>
        </>
    );
};

export default PlayList;
