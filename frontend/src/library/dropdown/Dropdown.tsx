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

export interface DropdownProps<T> extends Props<T> {
    options: OptionsType<T>;
    onSelect: (value: ValueType<T>) => void;
    onCreateOption?: (inputValue: string) => void;
    createTextKey?: string;
    selectTextKey?: string;
    isLoading?: boolean;
    hideLabel?: boolean;
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

    const customComponents: Partial<SelectComponents<any>> = React.useMemo(
        () => ({
            ClearIndicator: null,
            IndicatorSeparator: null,
            LoadingIndicator: a => (
                <div className={css.loadingWrapper} {...a}>
                    <RingLoading borderWidth={2} size={20} />
                </div>
            ),
            ValueContainer: container => (
                <components.ValueContainer {...container} className={container.className}>
                    <label className={css.dropdownLabel}>{placeholder}</label>
                    {container.children}
                </components.ValueContainer>
            ),
        }),
        [placeholder],
    );

    const customStyles: StylesConfig = {
        menu: (provided: CSSProperties) => ({
            ...provided,
            zIndex: 20,
        }),

        menuList: (provided: CSSProperties) => ({
            ...provided,
            background: theme["--card-background"],
        }),

        option: (provided: CSSProperties, state: any) => ({
            ...provided,
            color: theme["--input-text"],
            background: state.isFocused ? theme["--input-background"] : theme["--card-background"],

            "&:hover": {
                background: theme["--icon-button-hover-background"],
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
            borderRadius: "8px",
            "&:hover": {
                border: `1px solid ${theme["--input-border-normal"]}`,
            },
            height: "40px",
            marginTop: "21px",
        }),
        noOptionsMessage: (provided: CSSProperties) => ({
            ...provided,
            fontSize: "14px",
        }),
        singleValue: (provided: CSSProperties) => ({
            ...provided,
            color: theme["--input-text"],
        }),
        valueContainer: base => ({
            ...base,
            minHeight: "40px",
            paddingLeft: "12px",
            position: "initial",
        }),
    };

    return (
        <CreatableSelect
            options={props.options}
            onChange={props.onSelect}
            formatCreateLabel={value => (
                <span className={css.createLabelDefault}>
                    {`${translate(props.createTextKey ?? "DROPDOWN.CREATE_LABEL")} "${value}"`}
                </span>
            )}
            styles={customStyles}
            placeholder=""
            onCreateOption={props.onCreateOption}
            isLoading={props.isLoading}
            isDisabled={props.isLoading}
            {...props}
            components={{ ...customComponents, ...props.components }}
            openMenuOnFocus
            tabSelectsValue={false}
        />
    );
};

export default Dropdown;
