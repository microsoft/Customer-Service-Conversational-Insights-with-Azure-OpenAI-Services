import { Table, TableBody, TableCell, TableRow } from "@fluentui/react-components";

interface TableTabProps {
    tableValues: TableData;
}

interface TableData {
    row_count: number;
    column_count: number;
    cells: Cell[];
}

interface Cell {
    colIndex: number;
    colSpan: number;
    is_header: boolean;
    rowIndex: number;
    rowSpan: number;
    text: string;
}

export function TableTab({tableValues}: TableTabProps) {
    const data: TableData = tableValues;

    // Create a 2D array for the table cells
    const tableCells = Array(data.row_count)
        .fill("")
        .map(() => Array(data.column_count).fill(""));

    // Populate the 2D array with the cell data
    data.cells.forEach((cell: Cell) => {
        tableCells[cell.rowIndex][cell.colIndex] = cell.text;
    });

    return (
        <div style={{ maxHeight: "700px", overflow: "auto" }}>
            <Table>
                <TableBody>
                    {tableCells.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                    <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableTab;
