import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

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
        <div className="App">
            <h1>Halstead Metrics Calculator</h1>
            <div>
                <label>
                    Select Language: 
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                    </select>
                </label>
            </div>
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
                                <td>True Length</td>
                                <td>{result.truthProgramLength}</td>
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
                                <th>N1</th>
                                <th>n2</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {result.operators.list.map((operator, index) => (
                                        <span key={index}>{operator}{index < result.operators.list.length - 1 ? ', ' : ''}</span>
                                    ))}
                                </td>
                                <td>{result.operators.count}</td>
                                <td>{result.operators.distinctCount}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>Operands</h2>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Operand</th>
                                <th>N2</th>
                                <th>n2</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {result.operands.list.map((operand, index) => (
                                        <span key={index}>{operand}{index < result.operands.list.length - 1 ? ', ' : ''}</span>
                                    ))}
                                </td>
                                <td>{result.operands.count}</td>
                                <td>{result.operands.distinctCount}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default App;
