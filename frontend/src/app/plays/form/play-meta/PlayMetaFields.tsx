import React from "react";
import css from "./play-meta-fields.module.scss";
import Input from "library/input/Input";
import { PlayMeta } from "app/plays/__models/PlayModels";
import useTranslations from "app/locale/__hooks/useTranslations";
import DatePicker from "library/datepicker/DatePicker";
import TagsInput from "library/tags-input/TagsInput";
import { useRedux } from "store/rootReducer";

interface PlayMetaFieldsProps {
    meta?: PlayMeta;
    onChange: (meta: PlayMeta) => void;
}

const PlayMetaFields: React.FC<PlayMetaFieldsProps> = props => {
    const allTags = useRedux(state => state.play.tags);
    const { translate } = useTranslations();
    const onNoteChange = (note: string) => {
        const copy = { ...props.meta, note };
        props.onChange(copy);
    };

    const onDateChange = (date: Date) => {
        const copy = { ...props.meta, date };
        props.onChange(copy);
    };

    return (
        <div className={css.wrapper}>
            <h6>{translate("PLAYS.FORM.META.TITLE")}</h6>

            <Input
                name="note"
                label={translate("PLAYS.FORM.META.NOTE")}
                multiline
                initialValue={props.meta?.note}
                onTextChange={onNoteChange}
            />
            <DatePicker onSelect={onDateChange} initialValue={props.meta?.date} />

            <TagsInput allTags={allTags} selectedTags={[]} />
        </div>
    );
};

export default PlayMetaFields;
