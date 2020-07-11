import { useHistory } from "react-router-dom";
import { History } from "history";

export const useQueryParams: () => { history: History; [key: string]: any } = () => {
    const history: History = useHistory();
    const query = Object.fromEntries(new URLSearchParams(history.location.search));
    return { ...query, history };
};
