import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Box } from '@mui/material';
import { CodeEditor, ResultTable, OperatorsTable, OperandsTable } from './components';

function App() {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [result, setResult] = useState(null);

    const handleCalculate = async () => {
        try {
            const response = await axios.post('http://localhost:5000/calculate', { code, language });
            setResult(response.data);
        } catch (error) {
            console.error('Error calculating metrics:', error);
        }
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '40px', textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Halstead Metrics Calculator
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <FormControl fullWidth sx={{ maxWidth: 300 }}>
                    <InputLabel>Select Language</InputLabel>
                    <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="cpp">C++</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <CodeEditor code={code} setCode={setCode} />

            <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                onClick={handleCalculate} 
                style={{ marginTop: '20px' }}>
                Calculate
            </Button>

            {result && (
                <>
                    <ResultTable result={result} />
                    <Typography variant="h5" component="h2" gutterBottom>
                        Operators
                    </Typography>
                    <OperatorsTable operators={result.operators} />
                    <Typography variant="h5" component="h2" gutterBottom>
                        Operands
                    </Typography>
                    <OperandsTable operands={result.operands} />
                </>
            )}
        </Container>
    );
}

export default App;
