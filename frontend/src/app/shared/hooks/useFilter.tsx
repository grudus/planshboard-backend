import { useCallback, useState } from "react";

const useFilter = () => {
    const [filter, setFilter] = useState("");

    const filterCondition = useCallback(
        (item: string): boolean => !!item && (!filter || item.toLocaleLowerCase().includes(filter.toLocaleLowerCase())),
        [filter],
    );

    return { setFilter, filterCondition };
};

export default useFilter;
