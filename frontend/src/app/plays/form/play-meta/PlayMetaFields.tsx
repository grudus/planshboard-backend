import React from "react";
import css from "./play-meta-fields.module.scss";
import Input from "library/input/Input";
import { PlayMeta } from "app/plays/__models/PlayModels";
import useTranslations from "app/locale/__hooks/useTranslations";

interface PlayMetaFieldsProps {
    meta?: PlayMeta;
    onChange: (meta: PlayMeta) => void;
}

const PlayMetaFields: React.FC<PlayMetaFieldsProps> = props => {
    const { translate } = useTranslations();
    const onNoteChange = (note: string) => {
        const copy = { ...props.meta, note };
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
        </div>
    );
};

export default PlayMetaFields;
