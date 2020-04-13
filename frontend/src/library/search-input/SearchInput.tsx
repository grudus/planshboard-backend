import React from "react";
import Input, { InputProps } from "library/input/Input";
import useTranslations from "app/locale/hooks/useTranslations";
import { ReactComponent as SearchIcon } from "./search.svg";

type SearchInputProps = Omit<InputProps, "name" | "label">;

const SearchInput: React.FC<SearchInputProps> = props => {
    const { translate } = useTranslations();
    return <Input label={translate("SEARCH")} name="search" frontIcon={<SearchIcon />} {...props} />;
};

export default React.memo(SearchInput);
