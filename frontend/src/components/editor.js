import React from 'react';
import { TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Code editor component
export const CodeEditor = ({ code, setCode }) => (
    <Box sx={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code here..."
            sx={{ maxWidth: 600 }}
        />
    </Box>
);

// Result table for Halstead metrics
export const ResultTable = ({ result }) => {
    const metrics = [
        { label: 'Vocabulary', key: 'vocabulary' },
        { label: 'Length', key: 'length' },
        { label: 'Estimated Length', key: 'estimatedLength' },
        { label: 'True Length', key: 'truthProgramLength' },
        { label: 'Volume', key: 'volume' },
        { label: 'Difficulty', key: 'difficulty' },
        { label: 'Effort', key: 'effort' },
        { label: 'Time', key: 'time' },
        { label: 'Bugs', key: 'bugs' }
    ];

    return (
        <TableContainer component={Paper} sx={{ marginTop: '20px', maxWidth: 600, margin: '20px auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Metric</strong></TableCell>
                        <TableCell><strong>Value</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {metrics.map((metric) => (
                        <TableRow key={metric.key}>
                            <TableCell>{metric.label}</TableCell>
                            <TableCell>{result[metric.key] || 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// Operators table
export const OperatorsTable = ({ operators }) => (
    <TableContainer component={Paper} sx={{ marginTop: '20px', maxWidth: 600, margin: '20px auto' }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><strong>Operator</strong></TableCell>
                    <TableCell><strong>Count</strong></TableCell>
                    <TableCell><strong>Distinct</strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>
                        {operators.list.map((operator, index) => (
                            <span key={index}>
                                {operator}
                                {index < operators.list.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </TableCell>
                    <TableCell>{operators.count}</TableCell>
                    <TableCell>{operators.distinctCount}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
);

// Operands table
export const OperandsTable = ({ operands }) => (
    <TableContainer component={Paper} sx={{ marginTop: '20px', maxWidth: 600, margin: '20px auto' }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><strong>Operand</strong></TableCell>
                    <TableCell><strong>Count</strong></TableCell>
                    <TableCell><strong>Distinct</strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>
                        {operands.list.map((operand, index) => (
                            <span key={index}>
                                {operand}
                                {index < operands.list.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </TableCell>
                    <TableCell>{operands.count}</TableCell>
                    <TableCell>{operands.distinctCount}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
);
