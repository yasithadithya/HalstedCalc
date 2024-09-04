import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);

    const handleCalculate = async () => {
        try {
            const response = await axios.post('http://localhost:5000/calculate', { code });
            setResult(response.data);
        } catch (error) {
            console.error('Error calculating metrics:', error);
        }
    };

    return (
        <div className="App">
            <h1>Halstead Metrics Calculator</h1>
            <textarea
                rows="10"
                cols="50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code here..."
            />
            <div>
                <button onClick={handleCalculate}>Calculate</button>
            </div>
            {result && (
                <>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Vocabulary</td>
                                <td>{result.vocabulary}</td>
                            </tr>
                            <tr>
                                <td>Length</td>
                                <td>{result.length}</td>
                            </tr>
                            <tr>
                                <td>Estimated Length</td>
                                <td>{result.estimatedLength}</td>
                            </tr>
                            <tr>
                                <td>Volume</td>
                                <td>{result.volume}</td>
                            </tr>
                            <tr>
                                <td>Difficulty</td>
                                <td>{result.difficulty}</td>
                            </tr>
                            <tr>
                                <td>Effort</td>
                                <td>{result.effort}</td>
                            </tr>
                            <tr>
                                <td>Time</td>
                                <td>{result.time}</td>
                            </tr>
                            <tr>
                                <td>Bugs</td>
                                <td>{result.bugs}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>Operators</h2>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Operator</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.operators.map((operator, index) => (
                                <tr key={index}>
                                    <td>{operator}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2>Operands</h2>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Operand</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.operands.map((operand, index) => (
                                <tr key={index}>
                                    <td>{operand}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default App;
