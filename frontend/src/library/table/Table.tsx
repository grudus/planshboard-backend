import React from "react";
import css from "./table.module.scss";
import { merge } from "utils/cssUtils";

interface HeaderProps {
    [key: string]: React.ReactNode;
}

type DataAndHeaderCommonProps = {
    [key in keyof HeaderProps]: React.ReactNode;
};

interface DataProps extends DataAndHeaderCommonProps {
    id: any;
}

interface TableProps {
    headers: HeaderProps;
    data: DataProps[];
    className?: string;
}

const Table: React.FC<TableProps> = props => {
    return (
        <table className={merge(css.table, props.className)}>
            <thead>
                <tr>
                    {Object.entries(props.headers).map(([key, value]) => (
                        <th key={key}>{value}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.data.map(item => (
                    <tr key={item.id + ""}>
                        {Object.entries(props.headers).map(([headerKey, headerValue]) => (
                            <td data-label={headerValue} key={`${headerKey} + ${item.id}`}>
                                {item[headerKey]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
