const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

function calculateHalsteadMetrics(code, language) {
    let operatorPattern, operandPattern, keywords;

    // Define patterns based on language
    if (language === 'python') {
        // Python-specific patterns
        operatorPattern = /\b(and|or|not|is|in)\b|==|!=|<=|>=|[+\-*/%=<>!&|~^:]+|\*\*|\/\/|<<|>>|\(\)|\[\]|\{\}|[+\-*/%=<>!&|~^:]+|[(){}\[\],]/g;
        operandPattern = /\b[a-zA-Z_]\w*\b|\b\d+\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
        keywords = ['and', 'or', 'not', 'is', 'in', 'if', 'for', 'def', 'return', 'print', 'range', 'True', 'False', 'None'];
    } else if (language === 'cpp') {
        // C++-specific patterns
        operatorPattern = /==|!=|<=|>=|\+\+|--|\->|\+\=|\-\=|\*\=|\/\=|<<|>>|&&|\|\||[+\-*/%=<>!&|~^:]+|[(){}\[\],;]/g;
        operandPattern = /\b[a-zA-Z_]\w*\b|\b\d+\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
        keywords = ['auto', 'include', 'bool', 'break', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'delete', 'do', 'double', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'operator', 'private', 'protected', 'public', 'register', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'template', 'this', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'while', 'iostream', 'std', 'cout', 'main', 'endl'];
    } else if (language === 'java') {
        // Java-specific patterns
        operatorPattern = /==|!=|<=|>=|\+\+|--|\+=|-=|\*=|\/=|<<|>>|&&|\|\||->|\binstanceof\b|[+\-*/%=<>!&|~^:]+|[(){}\[\],;]/g;
        operandPattern = /\b[a-zA-Z_]\w*\b|\b\d+\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
        keywords = ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'void', 'volatile', 'while'];
    } else {
        return { error: 'Unsupported language' };
    }

    // Find operators and operands
    let operators = code.match(operatorPattern) || [];
    let operands = code.match(operandPattern) || [];

    // Remove standalone open and close brackets after identifying pairs
    operators = operators.filter(op => !['(', ')', '[', ']', '{', '}'].includes(op));

    // Filtering out keywords from operands
    operands = operands.filter(operand => !keywords.includes(operand));

    // Filter out function calls but keep function declarations as operands
    operands = operands.filter((operand, index, allOperands) => {
        const functionPattern = new RegExp(`\\b${operand}\\s*\\(`);

        // If it's not a function call, or if it appears in a function definition, keep it.
        const isFunctionCall = functionPattern.test(code);
        const isFunctionDeclaration = new RegExp(`\\b(def|void|int|double|float|char|bool|class|public|private|protected|static|final)\\s+${operand}\\s*\\(`).test(code);
        return !isFunctionCall || isFunctionDeclaration;
    });

    // Distinct operators and operands
    const distinctOperators = [...new Set(operators)];
    const distinctOperands = [...new Set(operands)];

    const n1 = distinctOperators.length; // Number of distinct operators
    const n2 = distinctOperands.length;  // Number of distinct operands
    const N1 = operators.length;         // Total number of operators
    const N2 = operands.length;          // Total number of operands

    // Calculate Halstead metrics
    const vocabulary = n1 + n2;
    const length = N1 + N2;
    const estimatedLength = n1 * Math.log2(n1) + n2 * Math.log2(n2);
    const truthProgramLength = estimatedLength / length;
    const volume = length * Math.log2(vocabulary || 1);
    const difficulty = (n1 / 2) * (N2 / (n2 || 1));
    const effort = difficulty * volume;
    const time = effort / 18;  // Programming time in seconds
    const bugs = volume / 3000; // Number of delivered bugs

    return {
        vocabulary,
        length,
        estimatedLength: estimatedLength.toFixed(2),
        truthProgramLength: truthProgramLength.toFixed(2),
        volume: volume.toFixed(2),
        difficulty: difficulty.toFixed(2),
        effort: effort.toFixed(2),
        time: time.toFixed(2),
        bugs: bugs.toFixed(2),
        operators: {
            list: distinctOperators,
            count: N1,
            distinctCount: n1
        },
        operands: {
            list: distinctOperands,
            count: N2,
            distinctCount: n2
        }
    };
}

app.post('/calculate', (req, res) => {
    const { code, language } = req.body;
    if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required.' });
    }
    const result = calculateHalsteadMetrics(code, language);
    res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
