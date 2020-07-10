import { useLocation } from "react-router-dom";

export const useQueryParams = () => {
    const location = useLocation();
    return Object.fromEntries(new URLSearchParams(location.search));
};
