import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @types/pikaday includes whole moment.js lib (optional in the original pikaday)
// which cra cannot easily ignore. It unnecessarily adds ~60kB of not-used js to the bundle
import Pikaday from "pikaday";
import Input from "library/input/Input";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";
import "./datepicker.scss";
import { formatFullDate } from "utils/dateUtils";
import { connect } from "react-redux";
import { Store } from "store/rootReducer";
import { Translations } from "app/locale/__store/localeStore";
import { memoizedTranslation } from "app/locale/__hooks/useTranslations";

interface DatePickerProps {
    initialValue?: Date;
    onSelect: (date: Date) => void;
    translations?: Translations;
}

interface DatePickerState {
    date: Date;
    pikadayInstance?: any;
}

class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
    private readonly pickadayRef: React.RefObject<HTMLInputElement>;

    state: DatePickerState = {
        date: new Date(),
    };

    constructor(props: DatePickerProps) {
        super(props);
        this.pickadayRef = React.createRef();
    }

    componentDidMount() {
        const translate = (key: string) => memoizedTranslation(key, this.props.translations ?? {});

        const pikadayInstance = new Pikaday({
            field: this.pickadayRef.current,
            defaultDate: this.state.date,
            setDefaultDate: true,
            onSelect: (date: Date) => {
                this.setState({ date });
                this.props.onSelect(date);
            },
            i18n: {
                previousMonth: "",
                nextMonth: "",
                months: translate("DATEPICKER.MONTHS")?.split(","),
                weekdays: translate("DATEPICKER.WEEKDAYS")?.split(","),
                weekdaysShort: translate("DATEPICKER.WEEKDAYS_SHORT")?.split(","),
            },
        });
        this.setState({ pikadayInstance });
    }

    showDialog = () => {
        this.state.pikadayInstance?.show();
    };

    render() {
        return (
            <div>
                <Input
                    label="Data"
                    name="date"
                    initialValue={formatFullDate(this.state.date)}
                    actionIcon={<IconButton svgIcon={Icons.CalendarIcon} onClick={this.showDialog} />}
                    inputExtra={{ readOnly: true, ref: this.pickadayRef }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: Store) => ({ translations: state.locale.translations });

export default connect(mapStateToProps)(DatePicker);
