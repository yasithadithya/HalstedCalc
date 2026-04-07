import React from 'react';
import {
    Box,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';

const toNumber = (value) => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === 'string') {
        const normalized = value.replace(/,/g, '').trim();
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
};

const formatAmount = (value) => {
    const numberValue = toNumber(value);
    if (numberValue === null) {
        return value ?? 'N/A';
    }

    if (Math.abs(numberValue) >= 1000) {
        return numberValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    return numberValue.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

// Code editor component
export const CodeEditor = ({ code, setCode }) => (
    <Box sx={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <TextField
            fullWidth
            multiline
            rows={14}
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code here..."
            className="code-editor"
            sx={{
                maxWidth: '100%',
                '& .MuiInputBase-root': {
                    fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    backgroundColor: 'var(--surface-2)',
                    borderRadius: 2
                }
            }}
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
        <TableContainer component={Paper} className="result-table-shell" elevation={0}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell className="table-head-cell"><strong>Metric</strong></TableCell>
                        <TableCell className="table-head-cell"><strong>Value</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {metrics.map((metric) => (
                        <TableRow key={metric.key}>
                            <TableCell className="table-label-cell">{metric.label}</TableCell>
                            <TableCell className="table-value-cell">{formatAmount(result[metric.key])}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// Operators table
export const OperatorsTable = ({ operators }) => (
    <TableContainer component={Paper} className="result-table-shell" elevation={0}>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell className="table-head-cell"><strong>Operator</strong></TableCell>
                    <TableCell className="table-head-cell"><strong>Count</strong></TableCell>
                    <TableCell className="table-head-cell"><strong>Distinct</strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                            {(operators?.list ?? []).map((operator, index) => (
                                <Chip key={`${operator}-${index}`} size="small" label={operator} variant="outlined" />
                            ))}
                        </Box>
                    </TableCell>
                    <TableCell className="table-value-cell">{formatAmount(operators?.count)}</TableCell>
                    <TableCell className="table-value-cell">{formatAmount(operators?.distinctCount)}</TableCell>
                </TableRow>
                {(!(operators?.list) || operators.list.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={3}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                No operators detected.
                            </Typography>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
);

// Operands table
export const OperandsTable = ({ operands }) => (
    <TableContainer component={Paper} className="result-table-shell" elevation={0}>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell className="table-head-cell"><strong>Operand</strong></TableCell>
                    <TableCell className="table-head-cell"><strong>Count</strong></TableCell>
                    <TableCell className="table-head-cell"><strong>Distinct</strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                            {(operands?.list ?? []).map((operand, index) => (
                                <Chip key={`${operand}-${index}`} size="small" label={operand} variant="outlined" />
                            ))}
                        </Box>
                    </TableCell>
                    <TableCell className="table-value-cell">{formatAmount(operands?.count)}</TableCell>
                    <TableCell className="table-value-cell">{formatAmount(operands?.distinctCount)}</TableCell>
                </TableRow>
                {(!(operands?.list) || operands.list.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={3}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                No operands detected.
                            </Typography>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
);
