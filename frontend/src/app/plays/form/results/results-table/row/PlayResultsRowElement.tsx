import React, { forwardRef } from "react";
import { PlayResultRow } from "app/plays/__models/PlayModels";
import { BoardGamePlayResultsOptions } from "app/board-games/__models/BoardGameModels";
import LinkedUser from "app/opponents/linkedUser/LinkedUser";
import Input from "library/input/Input";
import css from "app/plays/form/results/results-table/play-results-table.module.scss";
import SelectOpponentPosition from "app/plays/form/results/results-table/select-position/SelectOpponentPosition";

interface PlayResultsRowProps {
    result: PlayResultRow;
    gameOptions: BoardGamePlayResultsOptions;
    numberOfResults: number;
    onChange: (row: PlayResultRow) => any;
}

const PlayResultsRowElement: React.FC<PlayResultsRowProps> = forwardRef<HTMLTableRowElement, PlayResultsRowProps>(
    (props, ref) => {
        const { result } = props;
        const { showPoints, showPosition } = props.gameOptions;

        const pointsChange = (text: string) => {
            const copy = { ...result, points: parseInt(text, 10) };
            props.onChange(copy);
        };

        return (
            <tr key={result.opponent.id} ref={ref}>
                <td>
                    <span>{result.opponent.name}</span>
                    <LinkedUser opponent={result.opponent} />
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
