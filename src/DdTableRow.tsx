import React, { useState, useRef } from 'react';
import { Button, TableCell, TableRow, TextField } from "@mui/material";
import { useDrag, useDrop } from "react-dnd";

interface DdTableRowProps {
    row: { [key: string]: string | boolean };
    index: number;
    columns: string[];
    setTableRow: React.Dispatch<React.SetStateAction<Array<{ [key: string]: string | boolean }>>>;
    moveRow: (indexFrom: number, indexTo: number) => void;
}

const toCamelCase = (str: string): string => {
    return str
        .trim()
        .replace(/\s(.)/g, (_, group1) => group1.toUpperCase())
        .replace(/^(.)/, (_, group1) => group1.toLowerCase());
};

const DdTableRow = ({ row, index, columns, setTableRow, moveRow }: DdTableRowProps) => {

    const rowRef = useRef<HTMLTableRowElement>(null);

    const [, drag] = useDrag({
        type: "table_row",
        item: { index },
    });

    const [, drop] = useDrop({
        accept: "table_row",
        hover: (draggedItem: { index: number }, monitor) => {
            if (!rowRef.current) return;

            const dragIndex = draggedItem.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = rowRef.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;

            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveRow(dragIndex, hoverIndex);
            draggedItem.index = hoverIndex;
        }
    });

    // Комбинируем drag и drop в один ref
    drag(drop(rowRef));

    const [cell, setCell] = useState<{ [key: string]: string | boolean }>(
        columns.reduce<{ [key: string]: string | boolean }>((acc, col) => {
            const key = toCamelCase(col);
            acc[col] = row[col] ?? row[key] ?? '';
            return acc;
        }, {})
    );

    const toggle = () => {
        setTableRow(prevRows => {
            const newRows = [...prevRows];
            newRows[index] = {
                ...newRows[index],
                editing: !newRows[index].editing
            };
            return newRows;
        });
    };

    const handleCancel = () => {
        setCell(columns.reduce((acc, col) => {
            const key = toCamelCase(col);
            acc[col] = row[col] ?? row[key] ?? '';
            return acc;
        }, {} as { [key: string]: string | boolean }));

        setTableRow(prev => {
            const newRows = [...prev];
            newRows[index] = {
                ...newRows[index],
                editing: false
            };
            return newRows;
        });
    };

    const handleSave = () => {
        setTableRow(prev => {
            const newRows = [...prev];
            newRows[index] = {
                ...newRows[index],
                ...cell,
                editing: false
            };
            return newRows;
        });
    };

    return (
        <TableRow ref={rowRef}>
            {columns.map((col, idx) => (
                <TableCell align="center" key={`${col}-${index}`}>
                    {row.editing ? (
                        <TextField
                            id={`outlined-${col}-${index}`}
                            label={col}
                            variant="outlined"
                            value={String(cell[col])}
                            onChange={(e) => setCell({ ...cell, [col]: e.target.value })}
                        />
                    ) : (
                        <span style={{ fontSize: 15 }}>{String(row[toCamelCase(col)])}</span>
                    )}
                </TableCell>
            ))}

            {row.editing ? (
                <>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </>
            ) : (
                <Button onClick={toggle}>Edit</Button>
            )}
        </TableRow>
    );
};

export default DdTableRow;