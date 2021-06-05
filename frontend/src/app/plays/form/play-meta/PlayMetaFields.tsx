import React from "react";
import css from "./play-meta-fields.module.scss";
import Input from "library/input/Input";
import { PlayMeta } from "app/plays/__models/PlayModels";
import useTranslations from "app/locale/__hooks/useTranslations";
import DatePicker from "library/datepicker/DatePicker";
import TagsInput from "library/tags-input/TagsInput";
import { useRedux } from "store/rootReducer";
import { BoardGamePlayResultsOptions } from "app/board-games/__models/BoardGameModels";
import Heading from "library/text/Heading";

interface PlayMetaFieldsProps {
    meta?: PlayMeta;
    onChange: (meta: PlayMeta) => void;
    gameOptions: BoardGamePlayResultsOptions;
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

    const onTagsChange = (tags: string[]) => {
        const copy = { ...props.meta, tags };
        props.onChange(copy);
    };

    return (
        <div className={css.wrapper}>
            <Heading variant="h6" text="PLAYS.FORM.META.TITLE" />

            <div className={css.fieldsWrapper}>
                {props.gameOptions.showTags && (
                    <TagsInput allTags={allTags} selectedTags={[]} onChange={onTagsChange} />
                )}
                {props.gameOptions.showDate && <DatePicker onSelect={onDateChange} initialValue={props.meta?.date} />}
                {props.gameOptions.showNote && (
                    <Input
                        name="note"
                        label={translate("PLAYS.FORM.META.NOTE")}
                        multiline
                        initialValue={props.meta?.note}
                        onTextChange={onNoteChange}
                    />
                )}
            </div>
        </div>
    );
};

export default PlayMetaFields;
