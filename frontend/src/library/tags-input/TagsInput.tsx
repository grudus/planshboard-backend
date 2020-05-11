import React from "react";
import Dropdown from "library/dropdown/Dropdown";
import { SelectComponents } from "react-select/src/components";
import Tag from "library/tags/Tag";
import css from "./tags-input.module.scss";

export interface TagsInputProps {
    selectedTags?: string[];
    allTags?: string[];
    onChange?: (tags: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = props => {
    const options = props.allTags?.map(tag => ({ label: tag, value: tag })) ?? [];
    const selected = props.selectedTags?.map(tag => ({ label: tag, value: tag })) ?? [];

    const onSelect = (tagValues: any /*: { label: tag, value: tag }*/) => {
        const tags = tagValues?.map((tag: any) => tag.value);
        console.log("@@ Selected", tags);
        props.onChange?.(tags);
    };

    const components: Partial<SelectComponents<any>> = {
        ClearIndicator: null,
        IndicatorSeparator: null,
        MultiValue: props => (
            <Tag
                text={props.data.label}
                className={css.tag}
                onClose={() => props.removeProps.onClick(null)}
                onCloseButtonProps={{ ...props.removeProps }}
            />
        ),
    };

    return (
        <Dropdown
            options={options}
            onSelect={onSelect}
            isMulti
            defaultValue={selected}
            components={components}
            menuPlacement="top"
        />
    );
};

export default React.memo(TagsInput);
