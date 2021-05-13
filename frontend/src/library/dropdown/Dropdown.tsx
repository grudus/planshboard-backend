import React, { CSSProperties } from "react";
import CreatableSelect, { Props } from "react-select/creatable";
import useTranslations from "../../app/locale/__hooks/useTranslations";
import useTheme from "../../app/shared/hooks/useTheme";
import { OptionsType, ValueType } from "react-select/src/types";
import RingLoading from "library/loading/RingLoading";
import css from "./dropdown.module.scss";
import { SelectComponents } from "react-select/src/components";
import Select, { components } from "react-select";
import { StylesConfig } from "react-select/src/styles";
import { merge } from "utils/cssUtils";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";

export interface DropdownProps<T> extends Props<T> {
    options: OptionsType<T>;
    onSelect: (value: ValueType<T>) => void;
    onCreateOption?: (inputValue: string) => void;
    createTextKey?: string;
    selectTextKey?: string;
    isLoading?: boolean;
    hideLabel?: boolean;
    creationForbidden?: boolean;
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
            SelectContainer: container => (
                <components.SelectContainer {...container} className={merge(container.className, css.container)}>
                    <label className={css.dropdownLabel}>{placeholder}</label>
                    {container.children}
                </components.SelectContainer>
            ),
            DropdownIndicator: a => <IconButton svgIcon={Icons.Down} className={css.dropdownIcon} />,
        }),
        [placeholder],
    );

    const customStyles: StylesConfig = {
        menu: (provided: CSSProperties) => ({
            ...provided,
            zIndex: 20,
            borderRadius: "8px",
            marginTop: "-8px",
        }),

        menuList: (provided: CSSProperties) => ({
            ...provided,
            background: theme["--card-background"],
            borderRadius: "8px",
            padding: "8px",
        }),

        option: (provided: CSSProperties, state: any) => ({
            ...provided,
            color: theme["--input-text"],
            background: state.isFocused ? theme["--input-background"] : theme["--card-background"],

            "&:hover": {
                background: theme["--control-focus-background"],
            },
            padding: "13px 16px 13px",
            fontSize: "14px",
            borderRadius: "8px",
            cursor: "pointer",
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
            height: "40px",
            paddingLeft: "12px",
            position: "initial",
        }),
    };

    const SelectComponent = (p: any) => (!p.creationForbidden ? <CreatableSelect {...p} /> : <Select {...p} />);

    return (
        <SelectComponent
            options={props.options}
            onChange={props.onSelect}
            formatCreateLabel={(value: string) => (
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
