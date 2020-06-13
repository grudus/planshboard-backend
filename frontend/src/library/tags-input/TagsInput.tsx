import React from "react";
import Dropdown, { BaseDropdownItem } from "library/dropdown/Dropdown";
import { SelectComponents } from "react-select/src/components";
import Tag from "library/tags/Tag";
import css from "./tags-input.module.scss";
import { TagCounts } from "app/plays/__models/TagModels";

export interface TagsInputProps {
    selectedTags?: string[];
    allTags?: TagCounts[];
    onChange?: (tags: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = props => {
    const options = props.allTags?.map(tag => ({ label: tag.name, value: tag.name, count: tag.count })) ?? [];
    const selected = props.selectedTags?.map(tag => ({ label: tag, value: tag })) ?? [];

    const onSelect = (tagValues: any) => {
        const tags = (tagValues as BaseDropdownItem[])?.map(tag => tag.value);
        props.onChange?.(tags);
    };

    const components: Partial<SelectComponents<any>> = {
        MultiValue: props => (
            <Tag
                text={props.data.label}
                className={css.tag}
                onClose={() => props.removeProps.onClick(null)}
                onCloseButtonProps={{ ...props.removeProps }}
            />
        ),
    };

    const formatOptionLabel = (option: BaseDropdownItem) => {
        const tagOption = option as BaseDropdownItem & TagCounts;
        const { label, count, __isNew__ } = tagOption;
        if (__isNew__) {
            return <span>{label}</span>;
        }
        return (
            <div className={css.tagOptionWrapper}>
                <Tag text={label} />
                <span className={css.tagCount}>{count ?? 0} gier</span>
            </div>
        );
    };

    return (
        <Dropdown
            options={options}
            onSelect={onSelect}
            isMulti
            formatOptionLabel={formatOptionLabel}
            defaultValue={selected}
            components={components}
            menuPlacement="top"
            selectTextKey="PLAYS.TAGS.DROPDOWN_LABEL"
        />
    );
};

export default React.memo(TagsInput);
