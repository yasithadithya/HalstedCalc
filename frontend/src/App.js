import React, { useMemo, useState } from 'react';
import axios from 'axios';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography
} from '@mui/material';
import './App.css';
import { CodeEditor, ResultTable, OperatorsTable, OperandsTable } from './components/editor';

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

const formatMetric = (value) => {
    const parsed = toNumber(value);
    if (parsed === null) {
        return value ?? 'N/A';
    }

    return parsed.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

function App() {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [result, setResult] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleCalculate = async () => {
        try {
            setError('');
            const response = await axios.post('http://localhost:5000/calculate', { code, language });
            setResult(response.data);
        } catch (error) {
            console.error('Error calculating metrics:', error);
            setError('Unable to calculate metrics right now. Please check the backend service and try again.');
        }
    };

    const handleFileUpload = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);

        // Upload the file and extract code
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setError('');
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setCode(response.data.code);
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('File upload failed. Please verify file type and backend availability.');
        }
    };

    const summaryMetrics = useMemo(() => {
        if (!result) {
            return [];
        }

        return [
            { label: 'Vocabulary', value: result.vocabulary ?? 'N/A' },
            { label: 'Length', value: result.length ?? 'N/A' },
            { label: 'Volume', value: result.volume ?? 'N/A' },
            { label: 'Difficulty', value: result.difficulty ?? 'N/A' }
        ];
    }, [result]);

    return (
        <Box className="app-shell">
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                <Paper className="hero-panel" elevation={0}>
                    <Typography variant="overline" className="eyebrow">
                        Static Analysis Workbench
                    </Typography>
                    <Typography variant="h2" component="h1" className="hero-title">
                        Halstead Metrics Calculator
                    </Typography>
                    <Typography variant="body1" className="hero-copy">
                        Analyze source code complexity with a cleaner workspace, instant uploads, and structured metric reporting.
                    </Typography>
                </Paper>

                <Paper className="workspace-panel" elevation={0}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'stretch', md: 'center' }}
                        justifyContent="space-between"
                    >
                        <FormControl fullWidth sx={{ maxWidth: { xs: '100%', md: 280 } }}>
                            <InputLabel id="language-select-label">Language</InputLabel>
                            <Select
                                labelId="language-select-label"
                                value={language}
                                label="Language"
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <MenuItem value="python">Python</MenuItem>
                                <MenuItem value="cpp">C++</MenuItem>
                                <MenuItem value="java">Java</MenuItem>
                            </Select>
                        </FormControl>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                            <Button component="label" variant="outlined" className="upload-button">
                                Upload Source File
                                <input
                                    hidden
                                    type="file"
                                    accept=".py,.cpp,.java,.txt"
                                    onChange={handleFileUpload}
                                />
                            </Button>
                            {file ? (
                                <Chip label={file.name} color="success" variant="outlined" className="file-chip" />
                            ) : (
                                <Chip label="No file selected" variant="outlined" className="file-chip" />
                            )}
                        </Stack>
                    </Stack>

                    <Box sx={{ mt: 3 }}>
                        <CodeEditor code={code} setCode={setCode} />
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            className="calculate-button"
                            onClick={handleCalculate}
                            disabled={!code.trim()}
                        >
                            Run Metrics Analysis
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 3 }}>
                            {error}
                        </Alert>
                    )}
                </Paper>

                {result && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h4" className="results-title">
                            Analysis Snapshot
                        </Typography>

                        <Box className="metric-grid">
                            {summaryMetrics.map((metric) => (
                                <Paper key={metric.label} className="metric-card" elevation={0}>
                                    <Typography variant="caption" className="metric-label">
                                        {metric.label}
                                    </Typography>
                                    <Typography variant="h5" className="metric-value">
                                        {formatMetric(metric.value)}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>

                        <Typography variant="h5" component="h2" className="section-title">
                            Operators
                        </Typography>
                        <OperatorsTable operators={result.operators} />

                        <Typography variant="h5" component="h2" className="section-title">
                            Operands
                        </Typography>
                        <OperandsTable operands={result.operands} />

                        <Typography variant="h5" component="h2" className="section-title">
                            Full Halstead Metrics
                        </Typography>
                        <ResultTable result={result} />
                    </Box>
                )}
            </Container>
        </Box>
    );
}

export default App;
