# HalstedCalc

HalstedCalc is a full-stack code analysis tool that calculates Halstead complexity metrics for source code.

It has:
- A Node.js/Express backend that parses code with regex-based token rules and computes Halstead metrics.
- A React + Material UI frontend where users can paste code or upload a file and view metric tables.

Supported languages:
- Python
- C++
- Java

## What This Codebase Does

At a high level, the app lets a user:
1. Choose a language.
2. Paste code in the editor or upload a file.
3. Send code to the backend for analysis.
4. View summary cards plus detailed operator/operand and metric tables.

### Backend responsibilities
- Exposes `POST /upload` to accept a source file, read it, and return plain code text.
- Exposes `POST /calculate` to compute Halstead metrics from `{ code, language }`.
- Uses per-language regex and keyword filters to identify operators and operands.
- Returns both raw counts and derived Halstead values.

### Frontend responsibilities
- Provides the UI for language selection, code entry, and file upload.
- Calls backend APIs with Axios.
- Formats metric values safely for display (including numeric strings).
- Renders:
  - Summary metric cards
  - Operators table
  - Operands table
  - Full Halstead metrics table

## Repository Structure

```
HalstedCalc/
  backend/
    package.json
    server.js
    uploads/            # temp upload folder used by multer
  frontend/
    package.json
    public/
    src/
      App.js
      App.css
      index.js
      index.css
      components/
        editor.js
```

## How Metrics Are Computed

The backend computes these values from token counts:
- `n1`: distinct operators
- `n2`: distinct operands
- `N1`: total operators
- `N2`: total operands

Then:
- Vocabulary: `n = n1 + n2`
- Length: `N = N1 + N2`
- Estimated length: `n1 * log2(n1) + n2 * log2(n2)`
- True length (`truthProgramLength` in API): `estimatedLength / length`
- Volume: `N * log2(n)`
- Difficulty: `(n1 / 2) * (N2 / n2)`
- Effort: `difficulty * volume`
- Time: `effort / 18`
- Bugs: `volume / 3000`

## API Reference

Base URL (local): `http://localhost:5000`

### `POST /upload`
Uploads one file and returns extracted code.

Request:
- Content-Type: `multipart/form-data`
- Field: `file`

Response:
```json
{
  "code": "...file content..."
}
```

Notes:
- The uploaded file is stored temporarily in `backend/uploads/` and deleted after reading.

### `POST /calculate`
Calculates Halstead metrics.

Request body:
```json
{
  "code": "print('hello')",
  "language": "python"
}
```

Response shape:
```json
{
  "vocabulary": 0,
  "length": 0,
  "estimatedLength": "0.000",
  "truthProgramLength": "0.000",
  "volume": "0.000",
  "difficulty": "0.000",
  "effort": "0.000",
  "time": "0.000",
  "bugs": "0.000",
  "operators": {
    "list": [],
    "count": 0,
    "distinctCount": 0
  },
  "operands": {
    "list": [],
    "count": 0,
    "distinctCount": 0
  }
}
```

## Local Development

### Prerequisites
- Node.js 18+ recommended
- npm

### 1) Install dependencies
Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 2) Run backend
From `backend/`:
```bash
node server.js
```

The API runs on port `5000` by default.
You can override with:
- `PORT` environment variable

### 3) Run frontend
From `frontend/`:
```bash
npm start
```

Frontend runs at `http://localhost:3000` and calls backend at `http://localhost:5000`.

## Scripts

### Backend
Defined scripts are minimal currently.
- `npm test` (placeholder)

### Frontend
- `npm start` - run dev server
- `npm test` - run React tests
- `npm run build` - production build
- `npm run eject` - CRA eject

## Current Limitations

- Language support is limited to Python, C++, and Java.
- Tokenization is regex-based, not AST-based, so edge cases can be misclassified.
- Some values can become unstable for degenerate input (for example, when distinct operand count is zero).
- Frontend backend URL is hardcoded to `http://localhost:5000`.
- Backend CORS is open by default.

## Notes for Improvement

Potential next enhancements:
- Add AST-based parsing for higher metric accuracy.
- Add validation/guards for divide-by-zero scenarios in metric formulas.
- Move API base URL to environment variables.
- Add backend test coverage for metric calculation.
- Add Docker compose for one-command startup.
