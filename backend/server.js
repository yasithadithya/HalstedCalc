const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

function calculateHalsteadMetrics(code) {
    // Refined regex pattern to identify Python operators, including bracket pairs
    const operatorPattern = /\b(and|or|not|is|in)\b|==|!=|<=|>=|[+\-*/%=<>!&|~^:]+|\*\*|\/\/|<<|>>|\(\)|\[\]|\{\}|[+\-*/%=<>!&|~^:]+|[(){}\[\],]/g;

    // Refined regex pattern to identify Python operands (variables, literals, function names, etc.)
    const operandPattern = /\b[a-zA-Z_]\w*\b|\b\d+\b|\bTrue\b|\bFalse\b|\bNone\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;

    // Find operators and operands
    let operators = code.match(operatorPattern) || [];
    const operands = code.match(operandPattern) || [];

    // Remove standalone open and close brackets after identifying pairs
    operators = operators.filter(op => !['(', ')', '[', ']', '{', '}'].includes(op));

    // Python keywords to exclude from operands
    const pythonKeywords = ['and', 'or', 'not', 'is', 'in', 'if', 'for', 'def', 'return', 'print', 'range'];

    // Remove keywords used as operands from the operands list
    const filteredOperands = operands.filter(operand => !pythonKeywords.includes(operand));

    // Distinct operators and operands
    const distinctOperators = [...new Set(operators)];
    const distinctOperands = [...new Set(filteredOperands)];

    const n1 = distinctOperators.length; // Number of distinct operators
    const n2 = distinctOperands.length;  // Number of distinct operands
    const N1 = operators.length;         // Total number of operators
    const N2 = filteredOperands.length;  // Total number of operands

    // Calculate Halstead metrics
    const vocabulary = n1 + n2;
    const length = N1 + N2;
    const estimatedLength = n1 * Math.log2(n1) + n2 * Math.log2(n2);
    const volume = length * Math.log2(vocabulary || 1);
    const difficulty = (n1 / 2) * (N2 / (n2 || 1));
    const effort = difficulty * volume;
    const time = effort / 18;  // Programming time in seconds
    const bugs = volume / 3000; // Number of delivered bugs

    return {
        vocabulary,
        length,
        estimatedLength: estimatedLength.toFixed(2),
        volume: volume.toFixed(2),
        difficulty: difficulty.toFixed(2),
        effort: effort.toFixed(2),
        time: time.toFixed(2),
        bugs: bugs.toFixed(2),
        operators: distinctOperators,
        operands: distinctOperands
    };
}

app.post('/calculate', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Code is required.' });
    }
    const result = calculateHalsteadMetrics(code);
    res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//
