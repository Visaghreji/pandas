/* ============================================================
   simulator.js
   Python can't run in the browser, so this recognizes a small
   set of beginner Pandas commands (typed as plain text) and
   returns a realistic-looking text output. It is a simulator,
   not an interpreter — clearly labeled as such in the UI.
   ============================================================ */

function datasetToTable(rows, limit) {
  const cols = getColumns(rows);
  const shown = limit ? rows.slice(0, limit) : rows;
  const widths = cols.map((c) =>
    Math.max(c.length, ...shown.map((r) => String(r[c] ?? 'NaN').length))
  );
  const pad = (text, w) => String(text).padEnd(w, ' ');

  const header = '   ' + cols.map((c, i) => pad(c, widths[i])).join('  ');
  const lines = shown.map((r, idx) =>
    pad(idx, 3) + cols.map((c, i) => pad(r[c] ?? 'NaN', widths[i])).join('  ')
  );
  return [header, ...lines].join('\n');
}

function simulatorContext() {
  return { df: STUDENT_DATA };
}

/**
 * Runs a single line of "Pandas-like" code and returns a string
 * to print in the output panel. Falls back to a friendly error
 * if the line isn't one of the supported example commands.
 */
function simulatePandas(code) {
  const line = code.trim();
  const { df } = simulatorContext();

  if (/^df\.head\(\s*\)$/.test(line)) {
    return datasetToTable(df, 5);
  }
  const headN = line.match(/^df\.head\(\s*(\d+)\s*\)$/);
  if (headN) {
    return datasetToTable(df, parseInt(headN[1], 10));
  }
  if (/^df\.info\(\s*\)$/.test(line)) {
    const cols = getColumns(df);
    return [
      `<class 'pandas.core.frame.DataFrame'>`,
      `RangeIndex: ${df.length} entries, 0 to ${df.length - 1}`,
      `Data columns (total ${cols.length} columns):`,
      ...cols.map((c) => ` - ${c}: ${df.length} non-null, dtype: ${typeof df[0][c] === 'number' ? 'int64' : 'object'}`),
    ].join('\n');
  }
  const colMatch = line.match(/^df\[['"](\w+)['"]\]$/);
  if (colMatch) {
    const col = colMatch[1];
    if (!getColumns(df).includes(col)) return `KeyError: '${col}'`;
    return df.map((r, i) => `${i}    ${r[col]}`).join('\n') + `\nName: ${col}, dtype: object`;
  }
  const filterMatch = line.match(/^df\[df\[['"](\w+)['"]\]\s*(>|<|>=|<=|==)\s*(\d+)\]$/);
  if (filterMatch) {
    const [, col, op, valStr] = filterMatch;
    const val = parseInt(valStr, 10);
    if (!getColumns(df).includes(col)) return `KeyError: '${col}'`;
    const ops = {
      '>': (a, b) => a > b, '<': (a, b) => a < b,
      '>=': (a, b) => a >= b, '<=': (a, b) => a <= b, '==': (a, b) => a === b,
    };
    const filtered = df.filter((r) => ops[op](r[col], val));
    return filtered.length ? datasetToTable(filtered) : '(no rows match this condition)';
  }
  if (/^df\.isnull\(\)\.sum\(\)$/.test(line)) {
    const cols = getColumns(MISSING_DATA);
    return cols.map((c) => `${c}    ${MISSING_DATA.filter((r) => r[c] === null).length}`).join('\n');
  }
  if (/^df\.fillna\(\s*0\s*\)$/.test(line)) {
    const filled = MISSING_DATA.map((r) => {
      const copy = { ...r };
      Object.keys(copy).forEach((k) => { if (copy[k] === null) copy[k] = 0; });
      return copy;
    });
    return datasetToTable(filled);
  }
  const groupMatch = line.match(/^df\.groupby\(['"](\w+)['"]\)\[['"](\w+)['"]\]\.sum\(\)$/);
  if (groupMatch) {
    const [, groupCol, valCol] = groupMatch;
    const totals = {};
    SALES_DATA.forEach((r) => { totals[r[groupCol]] = (totals[r[groupCol]] || 0) + r[valCol]; });
    return Object.entries(totals).map(([k, v]) => `${k}    ${v}`).join('\n');
  }
  if (/^import pandas as pd$/.test(line)) {
    return '(Pandas is now available as "pd")';
  }
  if (/^pd\.Series\(/.test(line)) {
    return SERIES_LETTERS.map((v, i) => `${i}    ${v}`).join('\n') + '\ndtype: object';
  }
  if (/^pd\.DataFrame\(/.test(line)) {
    return datasetToTable(STUDENT_DATA, 3);
  }

  return `# Simulator note: "${line}" isn't one of the example commands yet.\n# Try df.head(), df.info(), df['Age'], df[df['Age'] > 22],\n# df.isnull().sum(), df.fillna(0), or df.groupby('Category')['Sales'].sum()`;
}
