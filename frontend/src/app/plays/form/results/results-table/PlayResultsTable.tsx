import React from "react";
import LinkedUser from "app/opponents/linkedUser/LinkedUser";
import Input from "library/input/Input";
import css from "./play-results-table.module.scss";
import { Opponent } from "app/opponents/__models/OpponentModels";
import { BoardGamePlayResultsOptions } from "app/board-games/__models/BoardGameModels";
import useTranslations from "app/locale/__hooks/useTranslations";

interface PlayResultsTableProps {
    selectedOpponents: Opponent[];
    gameOptions: BoardGamePlayResultsOptions;
}

const PlayResultsTable: React.FC<PlayResultsTableProps> = props => {
    const { translate } = useTranslations();
    const { showPoints, type, showPosition } = props.gameOptions;
    const position = props.selectedOpponents.map((p, index) => `[${index + 1}]`);

    return (
        <table className={css.table}>
            <thead>
                <tr>
                    <th>{translate("PLAYS.FORM.RESULTS_TABLE.OPPONENT")}</th>
                    {showPosition && <th>{translate("PLAYS.FORM.RESULTS_TABLE.POSITION")}</th>}
                    {showPoints && <th className={css.pointsHeader}>{translate("PLAYS.FORM.RESULTS_TABLE.POINTS")}</th>}
                </tr>
            </thead>
            <tbody>
                {props.selectedOpponents.map(op => (
                    <tr key={op.id}>
                        <td>
                            <span>{op.name}</span>
                            <LinkedUser opponent={op} />
                        </td>
                        {showPosition && <td>{position}</td>}
                        {showPoints && (
                            <td>
                                <Input name="name" size="small" type="number" className={css.pointsInput} />
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default React.memo(PlayResultsTable);
