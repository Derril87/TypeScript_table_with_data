import React, {useState} from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import DdTableRow from "./DdTableRow";
import {
    Button,
    TextField,
    Checkbox,
    TableContainer,
    TableHead,
    TableCell,
    TableBody,
    Table,
    Paper,
    TableRow,
    FormControlLabel
} from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const DdTable:React.FC = () => {

    const initialColumns: string[] = ["First Name", "Last Name", "Phone Number", "Email"]

    const columnToKey = (col: string) =>
        col.replace(/\s+/g, '')
           .replace(/^[A-Z]/, (match) => match.toLowerCase());

    const initialTableRow:{ [key:string]: string | boolean}[] = [
        {
            firstName: "Yaroslav",
            lastName: "Baliuk",
            phoneNumber: "0123456789",
            email: "yaroslav@gmail.com",
            editing: true
        },
        {
            firstName: "Maryna",
            lastName: "Vasylyshena",
            phoneNumber: "0123456449",
            email: "maryna@gmail.com",
            editing: false
        },
        {
            firstName: "Max",
            lastName: "Yaroshenko",
            phoneNumber: "0133456789",
            email: "max@gmail.com",
            editing: false
        },
    ];

    const [columns, setColumns] = useState<string[]>(initialColumns);
    const [tableRow, setTableRow] = useState<{ [key:string]: string | boolean}[]>(initialTableRow);

    const [newColumn, setNewColumn] = useState<string>('');
    const [newRow, setNewRow] = useState<{[key:string]: string}>({});

    const [isShowAddRowInput, setIsShowAddRowInput] = useState<boolean>(false);
    const [isShowAddColumnInput, setIsShowAddColumnInput] = useState<boolean>(false);


    const handleCheckedBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const callName = event.target.name;
        if(event.target.checked) {
            setColumns([...columns, callName]);
        } else {
            setColumns(columns.filter(col => col !== callName));
        }
    };

    const handleAddColumn = () => {
        if (newColumn.trim()) {
            setColumns([...columns, newColumn.trim()]);
            setNewColumn('');
        }
    }

    const handleKeyDown =(e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddColumn()
        }
    }

    const handleDeleteRow = () => {
        setTableRow(prev => prev.slice(0, -1));
    };

    const moveRow = (indexFrom: number, indexTo: number) => {
        const newTableRow = [...tableRow];
        newTableRow.splice(indexTo, 0, newTableRow.splice(indexFrom, 1)[0]);
        setTableRow(newTableRow);
    }

    return (
        <DndProvider backend={HTML5Backend}>
           <div style={{maxWidth: 1300, margin: "auto"}}>

              <Button onClick={() => setIsShowAddRowInput(!isShowAddRowInput)} variant="outlined" style={{marginRight: 10, marginTop: 10, marginBottom: 15}}>Add Row</Button>

               <Button onClick={() => setIsShowAddColumnInput(!isShowAddColumnInput)} variant="outlined" style={{marginLeft: 10, marginTop: 10, marginBottom: 15}}>Add Column</Button>

               {isShowAddColumnInput && (
                   <>
                <div style={{marginTop: 20}}>
                  <TextField
                      id="outlined-basic"
                      label="Add Column"
                      variant="outlined"
                      value={newColumn} onChange={(e) => setNewColumn(e.target.value)}
                      onKeyDown={handleKeyDown}
                  />
                  <Button variant="outlined" style={{marginLeft: 10, height: 55}} onClick={handleAddColumn}>Add</Button>
                </div>

                <div>
                   {columns.map((col, index) => (
                       <FormControlLabel
                           key={index}
                           control={
                           <Checkbox
                               checked={columns.includes(col)}
                               name={col}
                               onChange={handleCheckedBox}
                               color="info"
                               icon={<BookmarkBorderIcon />}
                               checkedIcon={<BookmarkIcon />}
                           />
                       }
                           label={col}
                       />
                   ))}
                </div>
                   </>
               )}

               {isShowAddRowInput && (
                   <div style={{ marginTop: 20 }}>
                       {columns.map((col, index) => {
                           const key = columnToKey(col);
                           return (
                               <TextField
                                   key={index}
                                   label={col}
                                   variant="outlined"
                                   style={{ marginRight: 10, marginBottom: 10 }}
                                   value={newRow[key] || ''}
                                   onChange={(event) =>
                                       setNewRow({ ...newRow, [key]: event.target.value })
                                   }
                               />
                           );
                       })}
                       <Button
                           variant="contained"
                           onClick={() => {
                               setTableRow([...tableRow, { ...newRow, editing: false }]);
                               setNewRow({});
                           }}
                           style={{ marginTop: 10 }}
                       >
                           Add
                       </Button>

                       <Button
                           variant="outlined"
                           color="error"
                           onClick={handleDeleteRow}
                           style={{ marginTop: 10, marginLeft: 10 }}
                       >
                           Delete
                       </Button>
                   </div>
               )}

               <div>
                   <TableContainer component={Paper}>
                       <Table sx={{ minWidth: 650 }} aria-label="simple table">
                           <TableHead>
                               <TableRow>
                                   {columns.map((col, idx) => (
                                       <TableCell align="center" key={idx} style={{color: "purple", fontSize: 17, fontWeight: "bold"}}>{col.toUpperCase()}</TableCell>
                                   ))}
                               </TableRow>

                           </TableHead>

                           <TableBody>

                               {tableRow.map((row, index) => (
                                   <DdTableRow
                                       key={index}
                                       row={row}
                                       columns={columns}
                                       index={index}
                                       setTableRow={setTableRow}
                                       moveRow={moveRow}
                                   />
                               ))}

                           </TableBody>

                       </Table>
                   </TableContainer>
               </div>

           </div>
        </DndProvider>
    );
};

export default DdTable;