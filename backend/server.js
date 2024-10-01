const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Multer setup for handling file uploads
const upload = multer({ dest: 'uploads/' });

function calculateHalsteadMetrics(code, language) {
    let operatorPattern, operandPattern, keywords;

    // Define patterns based on language
    if (language === 'python') {
        operatorPattern = /\b(and|or|not|is|in)\b|==|!=|<=|>=|[+\-*/%=<>!&|~^:]+|\*\*|\/\/|<<|>>|\(\)|\[\]|\{\}|[+\-*/%=<>!&|~^:]+|[(){}\[\],]/g;
        operandPattern = /\b[a-zA-Z_]\w*\b|\b\d+\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
        keywords = ['and', 'or', 'not', 'is', 'in', 'if', 'for', 'def', 'return', 'print', 'range', 'True', 'False', 'None'];
    } else if (language === 'cpp') {
        operatorPattern = /==|!=|<=|>=|\+\+|--|\->|\+\=|\-\=|\*\=|\/\=|<<|>>|&&|\|\||[+\-*/%=<>!&|~^:]+|[(){}\[\],;]/g;
        operandPattern = /\b[a-zA-Z_]\w*\b|\b\d+\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
        keywords = ['auto', 'include', 'bool', 'break', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'delete', 'do', 'double', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'operator', 'private', 'protected', 'public', 'register', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'template', 'this', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'while', 'iostream', 'std', 'cout', 'main', 'endl'];
    } else if (language === 'java') {
        operatorPattern = /==|!=|<=|>=|\+\+|--|\+=|-=|\*=|\/=|<<|>>|&&|\|\||->|\binstanceof\b|[+\-*/%=<>!&|~^]+|[(){}\[\],]/g;
        operandPattern = /\b[a-zA-Z_]\w*\b|\b\d+\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
        keywords = ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while', 'main', 'String', 'args'];
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

    // Exclude class declarations and System.out in Java
    operands = operands.filter(operand => {
        const isClassDeclaration = new RegExp(`\\bclass\\s+${operand}`).test(code);
        const isSystemOut = operand === 'System' || operand === 'out' || operand.startsWith('System.out');
        return !isClassDeclaration && !isSystemOut;
    });

    // Filter out function calls but keep function declarations as operands
    operands = operands.filter((operand) => {
        const functionPattern = new RegExp(`\\b${operand}\\s*\\(`);
        const isFunctionCall = functionPattern.test(code);
        const isFunctionDeclaration = new RegExp(`\\b(def|void|int|double|float|char|bool|class|public|private|protected|static|final)\\s+${operand}\\s*\\(`).test(code);
        return !isFunctionCall || isFunctionDeclaration;
    });

    // Distinct operators and operands
    const distinctOperators = [...new Set(operators)];
    const distinctOperands = [...new Set(operands)];

    const n1 = distinctOperators.length;
    const n2 = distinctOperands.length;
    const N1 = operators.length;
    const N2 = operands.length;

    // Calculate Halstead metrics
    const vocabulary = n1 + n2;
    const length = N1 + N2;
    const estimatedLength = n1 * Math.log2(n1) + n2 * Math.log2(n2);
    const truthProgramLength = estimatedLength / length;
    const volume = length * Math.log2(vocabulary);
    const difficulty = (n1 / 2) * (N2 / n2);
    const effort = difficulty * volume;
    const time = effort / 18;
    const bugs = volume / 3000;

    return {
        vocabulary,
        length,
        estimatedLength: estimatedLength.toFixed(3),
        truthProgramLength: truthProgramLength.toFixed(3),
        volume: volume.toFixed(3),
        difficulty: difficulty.toFixed(3),
        effort: effort.toFixed(3),
        time: time.toFixed(3),
        bugs: bugs.toFixed(3),
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

// Route to handle file upload and return code content
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = path.join(__dirname, req.file.path);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }

        // Respond with the file content (the code)
        res.json({ code: data });

        // Optionally, delete the file after reading
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete the file:', err);
        });
    });
});

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
