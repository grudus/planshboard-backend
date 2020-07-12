import React, { ChangeEvent, useState } from "react";
import css from "./cooperative-play-result.module.scss";
import Icons from "library/icons/Icons";
import CooperativeResultRadio from "app/plays/form/results/cooperative-play-result/CooperativeResultRadio";
import useTranslations from "app/locale/__hooks/useTranslations";
import { FinalResult } from "app/plays/__models/PlayModels";

export interface CooperativePlayResult {
    onChange: (result: FinalResult) => void;
    initialResult?: FinalResult;
}

const CooperativePlayResult: React.FC<CooperativePlayResult> = props => {
    const [finalResult, setFinalResult] = useState(props.initialResult as FinalResult | undefined);
    const { translate } = useTranslations();

    const changeFinalResult = (a: ChangeEvent<HTMLInputElement>) => {
        const result = a.target.value as FinalResult;
        setFinalResult(result);
        props.onChange(result);
    };

    return (
        <div className={css.wrapper}>
            <h6>{translate("PLAYS.FORM.FINAL_RESULT.TITLE")}</h6>
            <div className={css.buttonsWrapper} onChange={changeFinalResult}>
                <CooperativeResultRadio
                    icon={Icons.TrophyIcon}
                    text={translate("PLAYS.FORM.FINAL_RESULT.WIN")}
                    value={FinalResult.WIN}
                    selectedValue={finalResult}
                />
                <CooperativeResultRadio
                    icon={Icons.GhostIcon}
                    text={translate("PLAYS.FORM.FINAL_RESULT.DEFEAT")}
                    value={FinalResult.DEFEAT}
                    selectedValue={finalResult}
                />
            </div>
        </div>
    );
};

export default React.memo(CooperativePlayResult);
