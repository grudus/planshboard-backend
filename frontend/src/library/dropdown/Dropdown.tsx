import React, { CSSProperties } from "react";
import CreatableSelect, { Props } from "react-select/creatable";
import useTranslations from "../../app/locale/__hooks/useTranslations";
import useTheme from "../../app/shared/hooks/useTheme";
import { OptionsType, ValueType } from "react-select/src/types";
import RingLoading from "library/loading/RingLoading";
import css from "./dropdown.module.scss";
import { SelectComponents } from "react-select/src/components";
import { components } from "react-select";
import { StylesConfig } from "react-select/src/styles";
import { cssIf, merge } from "utils/cssUtils";

export interface DropdownProps<T> extends Props<T> {
    options: OptionsType<T>;
    onSelect: (value: ValueType<T>) => void;
    onCreateOption?: (inputValue: string) => void;
    createTextKey?: string;
    selectTextKey?: string;
    isLoading?: boolean;
}

export interface BaseDropdownItem {
    label: string;
    value: any;
    __isNew__?: boolean;
}

const Dropdown: React.FC<DropdownProps<BaseDropdownItem>> = props => {
    const { translate } = useTranslations();
    const theme = useTheme();
    const placeholder = translate(props.selectTextKey ?? "DROPDOWN.SELECT_LABEL");

    const customComponents: Partial<SelectComponents<any>> = {
        ClearIndicator: null,
        IndicatorSeparator: null,
        LoadingIndicator: a => (
            <div className={css.loadingWrapper} {...a}>
                <RingLoading borderWidth={2} size={20} />
            </div>
        ),
        ValueContainer: container => {
            const shouldFloatLabel = container.selectProps.menuIsOpen || container.hasValue;
            return (
                <components.ValueContainer {...container}>
                    <label className={merge(css.dropdownLabel, cssIf(css.floating, shouldFloatLabel))}>
                        {placeholder}
                    </label>
                    {container.children}
                </components.ValueContainer>
            );
        },

        ...props.components,
    };

    const customStyles: StylesConfig = {
        menuList: (provided: CSSProperties) => ({
            ...provided,
            background: theme["--card-background"],
        }),

        option: (provided: CSSProperties, state: any) => ({
            ...provided,
            color: theme["--input-text"],
            background: state.isFocused ? theme["--input-background"] : theme["--card-background"],

            "&:hover": {
                background: theme["--card-background"],
            },
            padding: "13px 16px 13px",
            fontSize: "14px",
        }),
        control: (provided: CSSProperties) => ({
            ...provided,
            background: theme["--input-background"],
            border: `1px solid ${theme["--input-border-normal"]}`,
            boxShadow: "none",
            fontSize: "14px",
            "&:hover": {
                border: `1px solid ${theme["--input-border-normal"]}`,
            },
        }),
        singleValue: (provided: CSSProperties) => ({
            ...provided,
            color: theme["--input-text"],
        }),
        valueContainer: base => ({
            ...base,
            minHeight: "52px",
            paddingLeft: "16px",
            paddingTop: "16px",
        }),
    };

    return (
        <CreatableSelect
            options={props.options}
            onChange={props.onSelect}
            formatCreateLabel={value => `${translate(props.createTextKey ?? "DROPDOWN.CREATE_LABEL")} "${value}"`}
            styles={customStyles}
            placeholder=""
            onCreateOption={props.onCreateOption}
            isLoading={props.isLoading}
            isDisabled={props.isLoading}
            {...props}
            components={customComponents}
            openMenuOnFocus
        />
    );
};

export default Dropdown;
