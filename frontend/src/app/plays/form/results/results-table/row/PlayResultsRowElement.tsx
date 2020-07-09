import React, { forwardRef } from "react";
import { PlayResultRow } from "app/plays/__models/PlayModels";
import { BoardGamePlayResultsOptions } from "app/board-games/__models/BoardGameModels";
import Input from "library/input/Input";
import css from "app/plays/form/results/results-table/play-results-table.module.scss";
import SelectOpponentPosition from "app/plays/form/results/results-table/select-position/SelectOpponentPosition";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";

interface PlayResultsRowProps {
    result: PlayResultRow;
    gameOptions: BoardGamePlayResultsOptions;
    numberOfResults: number;
    onChange: (row: PlayResultRow) => any;
    deleteResult: (result: PlayResultRow) => any;
}

const PlayResultsRowElement: React.FC<PlayResultsRowProps> = forwardRef<HTMLTableRowElement, PlayResultsRowProps>(
    (props, ref) => {
        const { result } = props;
        const { showPoints, showPosition } = props.gameOptions;

        const pointsChange = (text: string) => {
            const copy = { ...result, points: parseInt(text, 10) };
            props.onChange(copy);
        };

        const removeRow = () => props.deleteResult(props.result);

        const showDeleteButton = props.numberOfResults > 1;

        return (
            <tr key={result.opponent.id} ref={ref}>
                <td className={css.actionsCell}>
                    {showDeleteButton && (
                        <IconButton className={css.deleteRowButton} onClick={removeRow} svgIcon={Icons.DeleteIcon} />
                    )}
                </td>
                <td className={css.opponentInfoCell}>
                    <span>{result.opponent.name}</span>
                </td>
                {showPosition && (
                    <td>
                        <SelectOpponentPosition
                            numberOfPositions={props.numberOfResults}
                            result={props.result}
                            onChange={props.onChange}
                        />
                    </td>
                )}
                {showPoints && (
                    <td>
                        <Input
                            name="points"
                            size="small"
                            type="number"
                            className={css.pointsInput}
                            onTextChange={pointsChange}
                        />
                    </td>
                )}
            </tr>
        );
    },
);

export default React.memo(PlayResultsRowElement);
