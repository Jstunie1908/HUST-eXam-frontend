import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function TableResult(props) {
    const rows = props.rows;
    const display = props.display;
    return (
        <TableContainer component={Paper} sx={{ borderRadius: '10px', display: `${display ? "" : "none"}` }}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>User ID</StyledTableCell>
                        <StyledTableCell align="right">Exam ID</StyledTableCell>
                        <StyledTableCell align="right">State&nbsp;</StyledTableCell>
                        <StyledTableCell align="right">Complete Time&nbsp;</StyledTableCell>
                        <StyledTableCell align="right">Score&nbsp;</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.UserId}>
                            <StyledTableCell component="th" scope="row">
                                {row.UserId}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.ExamId}</StyledTableCell>
                            <StyledTableCell align="right">{row.state}</StyledTableCell>
                            <StyledTableCell align="right">{row.complete_time}</StyledTableCell>
                            <StyledTableCell align="right">{row.score}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}