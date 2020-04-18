import React from "react";
import { SingleOpponentStats } from "app/opponents/__models/OpponentModels";
import useTranslations from "app/locale/__hooks/useTranslations";
import css from "./opponent-profile-stats.module.scss";
import CardFormContent from "library/card-form/CardFormContent";

interface OpponentProfileStatsProps {
    stats?: SingleOpponentStats;
}

const OpponentProfileStats: React.FC<OpponentProfileStatsProps> = props => {
    const { translate } = useTranslations();

    const winsRatio = props.stats?.numberOfPlays
        ? Math.round((100 * props.stats.numberOfWins) / props.stats.numberOfPlays)
        : 0;

    const { mostPlayedBoardGame, mostWinsBoardGame, lastPlayedBoardGame } = props.stats ?? {};

    return (
        <CardFormContent className={css.wrapper}>
            <h4 className={css.title}>{translate("OPPONENTS.PROFILE.STATS.TITLE")}</h4>

            <div className={css.numberStatsWrapper}>
                <div className={css.numberStat}>
                    <span>{props.stats?.numberOfPlays}</span>
                    <span>{translate("OPPONENTS.LIST.NUMBER_OF_PLAYS")}</span>
                </div>
                <div className={css.numberStat}>
                    <span>{props.stats?.numberOfWins}</span>
                    <span>{translate("OPPONENTS.LIST.NUMBER_OF_WINS")}</span>
                </div>
                <div className={css.numberStat}>
                    <span>{winsRatio}%</span>
                    <span>{translate("OPPONENTS.LIST.WINS_RATIO")}</span>
                </div>
            </div>

            <div className={css.textStatsWrapper}>
                <div className={css.textStat}>
                    <span>{translate("OPPONENTS.PROFILE.STATS.LAST_PLAY")}</span>
                    <span>{lastPlayedBoardGame ?? "-"}</span>
                </div>
                <div className={css.textStat}>
                    <span>{translate("OPPONENTS.PROFILE.STATS.MOST_PLAYED_BOARD_GAME")}</span>
                    <span>
                        {!mostPlayedBoardGame ? "-" : `${mostPlayedBoardGame.name} (${mostPlayedBoardGame?.plays})`}
                    </span>
                </div>
                <div className={css.textStat}>
                    <span>{translate("OPPONENTS.PROFILE.STATS.MOST_WINS_BOARD_GAME")}</span>
                    <span>{!mostWinsBoardGame ? "-" : `${mostWinsBoardGame.name} (${mostWinsBoardGame?.wins})`}</span>
                </div>
            </div>
        </CardFormContent>
    );
};

export default React.memo(OpponentProfileStats);
