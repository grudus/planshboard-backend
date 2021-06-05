import React from "react";
import Input, { InputProps } from "library/input/Input";
import { ReactComponent as SearchIcon } from "./search.svg";

type SearchInputProps = Omit<InputProps, "name" | "label">;

const SearchInput: React.FC<SearchInputProps> = props => (
    <Input label="SEARCH" name="search" frontIcon={<SearchIcon />} {...props} />
);

export default React.memo(SearchInput);
