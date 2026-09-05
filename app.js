/* ============================================================
   app.js
   Wires up navigation, renders the mission map / sidebar, and
   builds each section's Learn → Visualize → Code → Predict →
   Interact → Practice → Quiz → Summary flow from the SECTIONS
   array below. No section is ever locked by stored results —
   see progress.js for why.
   ============================================================ */

/* ---------- small render helpers --------------------------- */

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function renderDataTable(dataset, { highlightable = false } = {}) {
  const cols = getColumns(dataset);
  const thead = `<tr><th class="rt-corner"></th>${cols.map((c) => `<th data-col="${c}">${c}</th>`).join('')}</tr>`;
  const rows = dataset.map((row, ri) => {
    const cells = cols.map((c) => {
      const val = row[c];
      const shown = val === null || val === undefined ? '<span class="cell-missing">NaN</span>' : val;
      return `<td data-row="${ri}" data-col="${c}" tabindex="${highlightable ? '0' : '-1'}">${shown}</td>`;
    }).join('');
    return `<tr><th class="rt-index" data-row="${ri}">${ri}</th>${cells}</tr>`;
  }).join('');
  return `<div class="table-wrap"><table class="data-table">${thead}${rows}</table></div>`;
}

function renderCodeBlock(codeId, lines) {
  const rows = lines.map((l, i) =>
    `<button type="button" class="code-line" data-code="${codeId}" data-index="${i}">${escapeHtml(l.code)}</button>`
  ).join('\n');
  return `
    <div class="code-panel">
      <div class="code-panel__bar"><span class="dot dot--r"></span><span class="dot dot--y"></span><span class="dot dot--g"></span><span class="code-panel__label">pandas_lab.py</span></div>
      <pre class="code-panel__body">${rows}</pre>
      <p class="code-hint">Click a line to see what it does.</p>
      <p class="code-explain" data-explain-for="${codeId}">Select a line above to reveal its explanation.</p>
    </div>`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wireCodeBlock(container, codeId, lines) {
  const explainEl = container.querySelector(`[data-explain-for="${codeId}"]`);
  container.querySelectorAll(`.code-line[data-code="${codeId}"]`).forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll(`.code-line[data-code="${codeId}"]`).forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const idx = Number(btn.dataset.index);
      explainEl.textContent = lines[idx].explain;
    });
  });
}

/* ---------- SECTIONS: the 12-section learning path ---------- */

const SECTIONS = [
  {
    id: 'intro', num: 1, title: 'Introduction to Pandas', difficulty: 'Easy', minutes: 6,
    learn: `Pandas is an open-source Python library used for data manipulation, analysis, and cleaning.
      It gives you fast, flexible tools for working with tabular data — the kind of row-and-column
      data you'd normally reach for a spreadsheet or a SQL table to hold.`,
    visualize(container) {
      container.innerHTML = `
        <div class="flow-diagram">
          <div class="flow-step">Excel<br><span>Rows + Columns</span></div>
          <div class="flow-arrow">↓</div>
          <div class="flow-step flow-step--accent">Pandas<br><span>DataFrame</span></div>
          <div class="flow-arrow">↓</div>
          <div class="flow-step">Data Analysis<br><span>Insights</span></div>
        </div>`;
    },
    code: [
      { code: '# Pandas puts your data into a table-like object', explain: 'A comment — Python ignores this line, but it tells you what\'s coming next.' },
      { code: 'import pandas as pd', explain: 'Loads the Pandas library into your program.' },
      { code: 'print("Ready to analyze data!")', explain: 'A normal Python print statement — Pandas works alongside regular Python code.' },
    ],
    interact(container) {
      container.innerHTML = `
        <p class="interact-instructions">Click each tool to compare how it handles data.</p>
        <div class="compare-row" id="intro-compare">
          <button type="button" class="compare-card" data-tool="excel">Excel<br><small>Click to compare</small></button>
          <button type="button" class="compare-card" data-tool="sql">SQL</button>
          <button type="button" class="compare-card" data-tool="pandas">Pandas</button>
        </div>
        <p class="compare-output" id="intro-compare-output">Choose a tool above to see how it compares to Pandas.</p>`;
      const facts = {
        excel: 'Excel is great for point-and-click editing, but it struggles once a sheet has hundreds of thousands of rows, and steps aren\'t easily repeatable.',
        sql: 'SQL is excellent for querying data that already lives in a database — but you need a database first, and it isn\'t built for the statistics/plotting side of analysis.',
        pandas: 'Pandas combines both worlds: spreadsheet-like tables, SQL-like filtering and grouping, and full Python for cleaning, statistics, and automation.',
      };
      container.querySelectorAll('.compare-card').forEach((btn) => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.compare-card').forEach((b) => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          container.querySelector('#intro-compare-output').textContent = facts[btn.dataset.tool];
        });
      });
    },
    practice: {
      task: 'In your own words, write one sentence explaining why a company might choose Pandas over a plain spreadsheet.',
      hint: 'Think about repeatability — could you re-run the same cleanup on tomorrow\'s data in one click?',
      answer: 'A good answer mentions repeatability, scale (bigger data), or the ability to combine analysis with real code.',
    },
    summary: ['Pandas = a Python library for tabular data', 'It replaces a lot of manual spreadsheet work', 'It plays well with SQL-style filtering and grouping', 'import pandas as pd is always your first line'],
  },

  {
    id: 'install', num: 2, title: 'Installation & Import', difficulty: 'Easy', minutes: 4,
    learn: `Before you can use Pandas, Python needs to know it exists. That's a two-step habit:
      install it once on your machine, then import it at the top of every script that uses it.`,
    visualize(container) {
      container.innerHTML = `
        <div class="flow-diagram">
          <div class="flow-step">1. Install<br><span>pip install pandas</span></div>
          <div class="flow-arrow">↓</div>
          <div class="flow-step flow-step--accent">2. Import<br><span>import pandas as pd</span></div>
          <div class="flow-arrow">↓</div>
          <div class="flow-step">3. Use it<br><span>pd.Series(...), pd.DataFrame(...)</span></div>
        </div>`;
    },
    code: [
      { code: 'pip install pandas', explain: 'Run this once in your terminal (not inside a .py file) to download Pandas.' },
      { code: 'import pandas as pd', explain: '"pd" is just an alias — a shorter name so you don\'t retype "pandas" everywhere.' },
      { code: 'print(pd.__version__)', explain: 'A quick way to confirm the install worked, by printing the installed version number.' },
    ],
    interact(container) {
      container.innerHTML = `
        <p class="interact-instructions">Build the import line yourself — click the pieces in the right order.</p>
        <div class="builder-target" id="import-target" aria-live="polite">&nbsp;</div>
        <div class="builder-pool" id="import-pool">
          <button type="button" class="builder-chip" data-chip="import">import</button>
          <button type="button" class="builder-chip" data-chip="pandas">pandas</button>
          <button type="button" class="builder-chip" data-chip="as">as</button>
          <button type="button" class="builder-chip" data-chip="pd">pd</button>
        </div>
        <p class="builder-feedback" id="import-feedback"></p>`;
      const order = ['import', 'pandas', 'as', 'pd'];
      let picked = [];
      const target = container.querySelector('#import-target');
      const feedback = container.querySelector('#import-feedback');
      container.querySelectorAll('.builder-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          if (chip.disabled) return;
          picked.push(chip.dataset.chip);
          chip.disabled = true;
          target.textContent = picked.join(' ');
          if (picked.length === order.length) {
            const correct = picked.every((v, i) => v === order[i]);
            feedback.textContent = correct
              ? 'Correct — that\'s exactly how every Pandas script starts.'
              : `Not quite the standard order. The usual line is: ${order.join(' ')}`;
            feedback.className = 'builder-feedback ' + (correct ? 'is-correct' : 'is-wrong');
          }
        });
      });
    },
    practice: {
      task: 'Write the two lines you would type to install and then import Pandas.',
      hint: 'One line runs in the terminal, one line runs inside your Python file.',
      answer: 'pip install pandas\nimport pandas as pd',
    },
    summary: ['pip install pandas installs the library (once)', 'import pandas as pd loads it into a script', '"pd" is an alias, not a special keyword', 'You need internet access only for the install step'],
  },

  {
    id: 'series', num: 3, title: 'Pandas Series', difficulty: 'Easy', minutes: 7,
    learn: `A Series is a one-dimensional labeled array — think of it as a single spreadsheet column,
      where every value automatically gets a position number called an index.`,
    visualize(container) {
      container.innerHTML = renderDataTable(SERIES_LETTERS.map((v, i) => ({ Value: v })), { highlightable: true })
        .replace('<table', '<table id="series-table"');
    },
    code: [
      { code: "data = ['g', 'e', 'e', 'k', 's']", explain: 'A plain Python list — Pandas hasn\'t touched the data yet.' },
      { code: 's = pd.Series(data)', explain: 'Wraps the list in a Series, which adds the 0, 1, 2… index automatically.' },
      { code: 'print(s)', explain: 'Prints the index and value side by side, plus the data type at the bottom.' },
    ],
    interact(container) {
      container.innerHTML = `
        <p class="interact-instructions">Click an index number to highlight its value.</p>
        <div id="series-interactive"></div>`;
      const wrap = container.querySelector('#series-interactive');
      wrap.innerHTML = `
        <div class="series-row">
          ${SERIES_LETTERS.map((v, i) => `<button type="button" class="series-cell" data-index="${i}"><span class="series-cell__index">${i}</span><span class="series-cell__value">${v}</span></button>`).join('')}
        </div>`;
      wrap.querySelectorAll('.series-cell').forEach((cell) => {
        cell.addEventListener('click', () => {
          wrap.querySelectorAll('.series-cell').forEach((c) => c.classList.remove('is-active'));
          cell.classList.add('is-active');
        });
      });
    },
    practice: {
      task: 'Create (on paper or in your head) a Series containing: Python, Pandas, NumPy.',
      hint: 'Start from a plain Python list, then wrap it with pd.Series().',
      answer: "s = pd.Series(['Python', 'Pandas', 'NumPy'])\n# index 0 -> Python, 1 -> Pandas, 2 -> NumPy",
    },
    summary: ['Series = one-dimensional, labeled data', 'Every value gets an automatic index (0, 1, 2…)', 'pd.Series(list) builds one from a plain list', 'A single DataFrame column is itself a Series'],
  },

  {
    id: 'dataframe', num: 4, title: 'DataFrames', difficulty: 'Medium', minutes: 8,
    learn: `A DataFrame is a two-dimensional labeled data structure — rows and columns together,
      like a full spreadsheet or SQL table. Every column in a DataFrame is actually a Series.`,
    visualize(container) {
      container.innerHTML = `
        <div class="flow-diagram flow-diagram--tree">
          <div class="flow-step flow-step--accent">DataFrame</div>
          <div class="tree-branches">
            <div class="flow-step">Rows</div>
            <div class="flow-step">Columns</div>
            <div class="flow-step">Cells</div>
          </div>
        </div>`;
    },
    code: [
      { code: "df = pd.DataFrame(students)", explain: 'Builds a table from a list of dictionaries (or lists) — one dictionary per row.' },
      { code: 'df.shape', explain: 'Returns (rows, columns) — a quick way to see the table\'s size.' },
      { code: "df['Score']", explain: 'Pulls out just the Score column, returned as a Series.' },
    ],
    interact(container) {
      container.innerHTML = `
        <p class="interact-instructions">Click a row number, a column header, or a single cell to highlight it.</p>
        ${renderDataTable(STUDENT_DATA, { highlightable: true })}
        <p class="interact-output" id="df-select-output">Nothing selected yet.</p>`;
      const table = container.querySelector('.data-table');
      const output = container.querySelector('#df-select-output');
      table.addEventListener('click', (e) => {
        const target = e.target.closest('[data-row], [data-col]');
        if (!target) return;
        table.querySelectorAll('.is-selected').forEach((n) => n.classList.remove('is-selected'));

        if (target.matches('th.rt-index')) {
          const r = target.dataset.row;
          table.querySelectorAll(`[data-row="${r}"]`).forEach((c) => c.classList.add('is-selected'));
          output.textContent = `Selected row ${r}: ${JSON.stringify(STUDENT_DATA[r])}`;
        } else if (target.matches('th[data-col]')) {
          const c = target.dataset.col;
          table.querySelectorAll(`[data-col="${c}"]`).forEach((n) => n.classList.add('is-selected'));
          output.textContent = `Selected column "${c}": ${STUDENT_DATA.map((r) => r[c]).join(', ')}`;
        } else if (target.matches('td')) {
          target.classList.add('is-selected');
          output.textContent = `Selected cell — ${target.dataset.col} of row ${target.dataset.row}: ${target.textContent}`;
        }
      });
    },
    practice: {
      task: 'Name the three things a DataFrame is made of, using the diagram above as a hint.',
      hint: 'Look at the tree diagram in the Visualize step.',
      answer: 'Rows, Columns, and Cells (the individual values where a row and column meet).',
    },
    summary: ['DataFrame = rows + columns together', 'Each column is itself a Series', "df['ColumnName'] selects one column", 'df.shape tells you (rows, columns)'],
  },

  {
    id: 'loadcsv', num: 5, title: 'Loading CSV Data', difficulty: 'Easy', minutes: 5,
    learn: `Real data usually lives in a file, not typed directly into your script. read_csv() reads a
      comma-separated file from disk (or a URL) straight into a DataFrame.`,
    visualize(container) {
      container.innerHTML = `
        <div class="flow-diagram">
          <div class="flow-step">data.csv<br><span>on disk</span></div>
          <div class="flow-arrow">→</div>
          <div class="flow-step flow-step--accent">pd.read_csv()</div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">DataFrame<br><span>in memory</span></div>
        </div>`;
    },
    code: [
      { code: 'df = pd.read_csv("students.csv")', explain: 'Reads the file "students.csv" and loads it into a DataFrame called df.' },
      { code: 'print(df.head())', explain: 'Immediately previews the first few rows, to make sure the load worked.' },
    ],
    interact(container) {
      container.innerHTML = `
        <p class="interact-instructions">Here's what "students.csv" looks like as raw text, and what it becomes after read_csv(). Click to reveal the DataFrame.</p>
        <pre class="csv-raw">Name,Age,Course,Score
Arun,21,Python,85
Anu,22,Pandas,91
Rahul,20,Python,76</pre>
        <button type="button" class="btn btn--accent" id="reveal-df-btn">RUN read_csv()</button>
        <div id="csv-result"></div>`;
      container.querySelector('#reveal-df-btn').addEventListener('click', () => {
        container.querySelector('#csv-result').innerHTML = renderDataTable(STUDENT_DATA.slice(0, 3));
      });
    },
    practice: {
      task: 'Write the one line of code that loads a file named "sales.csv" into a variable called df.',
      hint: 'The function name is read_csv, and the file name goes in quotes.',
      answer: 'df = pd.read_csv("sales.csv")',
    },
    summary: ['read_csv() loads a CSV file into a DataFrame', 'The file name goes inside quotes as a string', 'Always sanity-check a fresh load with head()', 'read_csv() can also load files from a URL'],
  },

  {
    id: 'explore', num: 6, title: 'Exploring Data', difficulty: 'Easy', minutes: 6,
    learn: `Once your data is loaded, head() and info() are the two commands you'll reach for constantly
      to understand what you're working with before doing anything else.`,
    visualize(container) {
      container.innerHTML = `
        <div class="flow-diagram">
          <div class="flow-step flow-step--accent">df.head()<br><span>preview rows</span></div>
          <div class="flow-step flow-step--accent">df.info()<br><span>structure summary</span></div>
        </div>`;
    },
    code: [
      { code: 'df.head()', explain: 'Shows the first 5 rows by default — pass a number, like head(10), for more.' },
      { code: 'df.info()', explain: 'Prints row count, column names, non-null counts, and data types all at once.' },
    ],
    interact(container) {
      container.innerHTML = `
        <p class="interact-instructions">Click a command to see its output on the student dataset.</p>
        <div class="btn-row">
          <button type="button" class="btn" id="btn-head">HEAD()</button>
          <button type="button" class="btn" id="btn-info">INFO()</button>
        </div>
        <pre class="output-panel" id="explore-output">Click a button above.</pre>`;
      const out = container.querySelector('#explore-output');
      container.querySelector('#btn-head').addEventListener('click', () => {
        out.textContent = simulatePandas('df.head()');
      });
      container.querySelector('#btn-info').addEventListener('click', () => {
        out.textContent = simulatePandas('df.info()');
      });
    },
    practice: {
      task: 'You just loaded a new CSV. Name the first two commands you should run, and why.',
      hint: 'One previews the data, the other tells you about structure and missing values.',
      answer: 'df.head() to preview the first rows, then df.info() to check column types and spot missing data.',
    },
    summary: ['head() previews the first rows (default 5)', 'info() summarizes structure: columns, types, counts', 'Always explore before you clean or analyze', 'Both commands never change your data'],
  },

  {
    id: 'missing', num: 7, title: 'Missing Data', difficulty: 'Medium', minutes: 8,
    learn: `Real datasets are rarely complete. isnull() flags every missing cell, and fillna() lets you
      replace those gaps with a value you choose.`,
    visualize(container) {
      container.innerHTML = renderDataTable(MISSING_DATA);
    },
    code: [
      { code: 'df.isnull()', explain: 'Returns a same-shaped table of True/False — True wherever a value is missing.' },
      { code: 'df.isnull().sum()', explain: 'Adds up the True values in each column, giving a missing-value count per column.' },
      { code: 'df = df.fillna(0)', explain: 'Replaces every missing cell with 0 — you could use any value, like a column average.' },
    ],
    interact(container) {
      container.innerHTML = `
        <p class="interact-instructions">DATA CLEANING LAB — click a highlighted missing cell, then choose what to do with it.</p>
        ${renderDataTable(MISSING_DATA, { highlightable: true })}
        <div class="clean-actions hidden" id="clean-actions">
          <span>Selected cell: <strong id="clean-target-label"></strong></span>
          <button type="button" class="btn btn--accent" data-action="zero">Replace with 0</button>
          <button type="button" class="btn" data-action="leave">Leave unchanged</button>
          <button type="button" class="btn btn--danger" data-action="drop">Remove row</button>
        </div>
        <p class="section-label">Result:</p>
        <div id="clean-result"></div>`;
      let working = MISSING_DATA.map((r) => ({ ...r }));
      let target = null;
      const renderResult = () => { container.querySelector('#clean-result').innerHTML = renderDataTable(working); };
      renderResult();

      container.querySelector('.data-table').addEventListener('click', (e) => {
        const td = e.target.closest('td');
        if (!td) return;
        const r = Number(td.dataset.row), c = td.dataset.col;
        if (working[r][c] !== null) return; // only missing cells are editable
        target = { r, c };
        container.querySelector('#clean-actions').classList.remove('hidden');
        container.querySelector('#clean-target-label').textContent = `row ${r}, column ${c}`;
      });
      container.querySelector('#clean-actions').addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (!action || !target) return;
        if (action === 'zero') working[target.r][target.c] = 0;
        if (action === 'drop') working = working.filter((_, i) => i !== target.r);
        renderResult();
        container.querySelector('#clean-actions').classList.add('hidden');
        target = null;
      });
    },
    practice: {
      task: 'Write the two lines of code that count missing values per column, then fill them with 0.',
      hint: 'isnull() and sum() combine into one line; fillna() handles the second.',
      answer: 'df.isnull().sum()\ndf = df.fillna(0)',
    },
    summary: ['isnull() flags missing cells as True', 'isnull().sum() counts them per column', 'fillna(value) replaces missing cells', 'Dropping a row is another valid option, when appropriate'],
  },

  {
    id: 'selecting', num: 8, title: 'Selecting Data', difficulty: 'Easy', minutes: 5,
    learn: `Selecting data means pulling out just the column (or columns) you need, without touching
      the rest of the table.`,
    visualize(container) {
      container.innerHTML = renderDataTable(STUDENT_DATA.slice(0, 3), { highlightable: true });
    },
    code: [
      { code: "df['Age']", explain: 'Selects a single column, returned as a Series.' },
      { code: "df[['Name', 'Score']]", explain: 'Double brackets select multiple columns at once, returned as a smaller DataFrame.' },
    ],
    interact(container) {
      container.innerHTML = `
        <p class="interact-instructions">Click a column name to "select" it, like df['ColumnName'] would.</p>
        <div class="btn-row" id="select-buttons">
          ${getColumns(STUDENT_DATA).map((c) => `<button type="button" class="btn" data-col="${c}">${c}</button>`).join('')}
        </div>
        <pre class="output-panel" id="select-output">Click a column above.</pre>`;
      container.querySelectorAll('#select-buttons .btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const c = btn.dataset.col;
          container.querySelector('#select-output').textContent =
            `df['${c}']\n\n` + STUDENT_DATA.map((r, i) => `${i}    ${r[c]}`).join('\n');
        });
      });
    },
    practice: {
      task: 'Write the code to select only the "Course" column from df.',
      hint: 'A single column uses one pair of square brackets.',
      answer: "df['Course']",
    },
    summary: ["df['col'] selects one column as a Series", "df[['col1','col2']] selects multiple columns", 'Selecting never changes the original DataFrame', 'You can chain a selection into further operations'],
  },

  {
    id: 'filtering', num: 9, title: 'Filtering Data', difficulty: 'Medium', minutes: 9,
    learn: `Filtering means keeping only the rows that match a condition — like asking "show me
      everyone older than 22" instead of scrolling through the whole table.`,
    visualize(container) {
      container.innerHTML = renderDataTable(STUDENT_DATA);
    },
    code: [
      { code: "df['Age'] > 22", explain: 'Builds a column of True/False values — True wherever the condition holds.' },
      { code: "df[df['Age'] > 22]", explain: 'Uses that True/False column to keep only the matching rows.' },
    ],
    interact(container) {
      const cols = getColumns(STUDENT_DATA).filter((c) => typeof STUDENT_DATA[0][c] === 'number');
      container.innerHTML = `
        <p class="interact-instructions">Build a filter, then run it against the student dataset.</p>
        <div class="filter-builder">
          <label>Column
            <select id="filter-col">${cols.map((c) => `<option value="${c}">${c}</option>`).join('')}</select>
          </label>
          <label>Condition
            <select id="filter-op">
              <option value=">">&gt;</option><option value="<">&lt;</option>
              <option value="==">==</option><option value=">=">&gt;=</option><option value="<=">&lt;=</option>
            </select>
          </label>
          <label>Value
            <input type="number" id="filter-val" value="22">
          </label>
          <button type="button" class="btn btn--accent" id="run-filter">RUN FILTER</button>
        </div>
        <p class="code-echo" id="filter-code"></p>
        <div id="filter-result"></div>`;
      container.querySelector('#run-filter').addEventListener('click', () => {
        const col = container.querySelector('#filter-col').value;
        const op = container.querySelector('#filter-op').value;
        const val = Number(container.querySelector('#filter-val').value);
        const ops = { '>': (a, b) => a > b, '<': (a, b) => a < b, '==': (a, b) => a === b, '>=': (a, b) => a >= b, '<=': (a, b) => a <= b };
        const rows = STUDENT_DATA.filter((r) => ops[op](r[col], val));
        container.querySelector('#filter-code').textContent = `df[df['${col}'] ${op} ${val}]`;
        container.querySelector('#filter-result').innerHTML = rows.length ? renderDataTable(rows) : '<p class="empty-state">No rows match this condition.</p>';
      });
    },
    practice: {
      task: 'Write the Pandas code to keep only rows where Score is at least 85.',
      hint: 'The condition goes inside df[ ... ], comparing df["Score"] to 85.',
      answer: "df[df['Score'] >= 85]",
    },
    summary: ['A condition like df["Age"] > 22 makes a True/False mask', 'df[mask] keeps only the True rows', 'You can combine conditions with & (and) / | (or)', 'Filtering returns a new DataFrame — the original is untouched'],
  },

  {
    id: 'columns', num: 10, title: 'Adding & Removing Columns', difficulty: 'Medium', minutes: 7,
    learn: `You can create a new column from existing ones with simple arithmetic, and drop columns
      you no longer need with drop().`,
    visualize(container) {
      container.innerHTML = renderDataTable(TEST_SCORES);
    },
    code: [
      { code: "df['total'] = df['Test1'] + df['Test2']", explain: 'Adds Test1 and Test2 row by row, storing the result in a brand-new "total" column.' },
      { code: "df = df.drop(columns=['Test1'])", explain: 'Removes the Test1 column entirely — drop() returns a new DataFrame without it.' },
    ],
    interact(container) {
      container.innerHTML = `
        <p class="interact-instructions">Add a computed column, then try removing one.</p>
        <div class="btn-row">
          <button type="button" class="btn btn--accent" id="add-col-btn">ADD COLUMN (total = Test1 + Test2)</button>
          <button type="button" class="btn btn--danger" id="remove-col-btn">REMOVE COLUMN (Test1)</button>
        </div>
        <div id="columns-result"></div>`;
      let working = TEST_SCORES.map((r) => ({ ...r }));
      const renderResult = () => { container.querySelector('#columns-result').innerHTML = renderDataTable(working); };
      renderResult();
      container.querySelector('#add-col-btn').addEventListener('click', () => {
        working = working.map((r) => ({ ...r, total: (r.Test1 ?? 0) + (r.Test2 ?? 0) }));
        renderResult();
      });
      container.querySelector('#remove-col-btn').addEventListener('click', () => {
        working = working.map((r) => { const { Test1, ...rest } = r; return rest; });
        renderResult();
      });
    },
    practice: {
      task: 'Write the code that creates a "total" column by adding columns "a" and "b".',
      hint: 'Assign the sum directly to a new column name in square brackets.',
      answer: "df['total'] = df['a'] + df['b']",
    },
    summary: ['New columns are created by assigning to df[\'name\']', 'Column math works row by row, automatically', 'drop(columns=[...]) removes one or more columns', 'Neither operation changes the original file on disk'],
  },

  {
    id: 'groupby', num: 11, title: 'GroupBy', difficulty: 'Hard', minutes: 10,
    learn: `groupby() splits your data into groups based on a column's values, so you can calculate a
      summary — like total sales — for each group separately.`,
    visualize(container) {
      container.innerHTML = renderDataTable(SALES_DATA);
    },
    code: [
      { code: "df.groupby('Category')", explain: 'Splits the rows into groups, one per unique Category value (Electronics, Furniture).' },
      { code: "df.groupby('Category')['Sales'].sum()", explain: 'Within each group, adds up the Sales column — one total per category.' },
    ],
    interact(container) {
      container.innerHTML = `
        <p class="interact-instructions">GROUPBY LAB — choose a calculation, then analyze.</p>
        <div class="filter-builder">
          <label>Group by
            <select id="groupby-col"><option value="Category">Category</option></select>
          </label>
          <label>Calculate
            <select id="groupby-calc">
              <option value="sum">SUM</option><option value="count">COUNT</option><option value="avg">AVERAGE</option>
            </select>
          </label>
          <button type="button" class="btn btn--accent" id="run-groupby">ANALYZE</button>
        </div>
        <p class="code-echo" id="groupby-code"></p>
        <div id="groupby-result"></div>`;
      container.querySelector('#run-groupby').addEventListener('click', () => {
        const calc = container.querySelector('#groupby-calc').value;
        const groups = {};
        SALES_DATA.forEach((r) => {
          groups[r.Category] = groups[r.Category] || [];
          groups[r.Category].push(r.Sales);
        });
        const results = Object.entries(groups).map(([cat, vals]) => {
          let value;
          if (calc === 'sum') value = vals.reduce((a, b) => a + b, 0);
          else if (calc === 'count') value = vals.length;
          else value = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
          return { category: cat, value };
        });
        const fnName = { sum: 'sum()', count: 'count()', avg: 'mean()' }[calc];
        container.querySelector('#groupby-code').textContent = `df.groupby('Category')['Sales'].${fnName}`;
        const max = Math.max(...results.map((r) => r.value), 1);
        container.querySelector('#groupby-result').innerHTML = `
          <div class="bar-chart">
            ${results.map((r) => `
              <div class="bar-chart__row">
                <span class="bar-chart__label">${r.category}</span>
                <div class="bar-chart__track"><div class="bar-chart__fill" style="width:${(r.value / max) * 100}%"></div></div>
                <span class="bar-chart__value">${r.value}</span>
              </div>`).join('')}
          </div>`;
      });
    },
    practice: {
      task: 'Write the code to find the average Sales per Category.',
      hint: 'Swap sum() for the averaging function.',
      answer: "df.groupby('Category')['Sales'].mean()",
    },
    summary: ['groupby(col) splits rows into groups by value', 'Follow it with a column and an aggregation: sum, count, mean', 'The result has one row per unique group', 'GroupBy never modifies the original DataFrame'],
  },

  {
    id: 'final', num: 12, title: 'Final Data Analyst Challenge', difficulty: 'Hard', minutes: 15, isFinal: true,
    learn: `Scenario: you've been hired as a junior data analyst. Your company has handed you a
      student-performance dataset — put everything from this Data Lab to work.`,
    visualize(container) {
      container.innerHTML = renderDataTable(FINAL_DATA);
    },
    code: [
      { code: 'df = pd.read_csv("performance.csv")', explain: 'Step one for any real analysis: load the data.' },
      { code: 'df.info()', explain: 'Then check its shape and look for missing values before doing anything else.' },
    ],
    interact(container) {
      const tasks = [
        { id: 't1', prompt: 'How many students have an Exam score greater than 80?', check: () => FINAL_DATA.filter((r) => r.Exam > 80).length, hint: "Use df[df['Exam'] > 80] and count the rows." },
        { id: 't2', prompt: 'How many missing values are in this dataset (there are none — enter 0)?', check: () => 0, hint: 'This dataset happens to be complete — isnull().sum() would show all zeros.' },
        { id: 't3', prompt: 'What is Arun\'s total score (Assignment + Exam)?', check: () => FINAL_DATA.find((r) => r.Name === 'Arun').Assignment + FINAL_DATA.find((r) => r.Name === 'Arun').Exam, hint: "df['total'] = df['Assignment'] + df['Exam']" },
        { id: 't4', prompt: 'How many different departments appear in the dataset?', check: () => new Set(FINAL_DATA.map((r) => r.Department)).size, hint: "df.groupby('Department') creates one group per department." },
        { id: 't5', prompt: 'Rounded to the nearest whole number, what is the average Exam score for the CS department?', check: () => {
            const cs = FINAL_DATA.filter((r) => r.Department === 'CS').map((r) => r.Exam);
            return Math.round(cs.reduce((a, b) => a + b, 0) / cs.length);
          }, hint: "df.groupby('Department')['Exam'].mean()" },
      ];
      container.innerHTML = `
        <p class="interact-instructions">Answer each task using the dataset above. Type a number and submit.</p>
        <div class="challenge-list">
          ${tasks.map((t, i) => `
            <div class="challenge-task" data-task="${t.id}">
              <p><strong>Task ${i + 1}.</strong> ${t.prompt}</p>
              <div class="challenge-row">
                <input type="number" class="challenge-input" data-task-input="${t.id}">
                <button type="button" class="btn btn--accent" data-task-submit="${t.id}">Submit</button>
              </div>
              <p class="challenge-feedback" data-task-feedback="${t.id}"></p>
            </div>`).join('')}
        </div>`;
      tasks.forEach((t) => {
        container.querySelector(`[data-task-submit="${t.id}"]`).addEventListener('click', () => {
          const input = container.querySelector(`[data-task-input="${t.id}"]`);
          const feedback = container.querySelector(`[data-task-feedback="${t.id}"]`);
          const val = Number(input.value);
          const correct = val === t.check();
          feedback.textContent = correct
            ? 'Correct! +25 XP'
            : `Not quite. Hint: ${t.hint}`;
          feedback.className = 'challenge-feedback ' + (correct ? 'is-correct' : 'is-wrong');
          if (correct && feedback.dataset.awarded !== 'true') {
            feedback.dataset.awarded = 'true';
            addXP(25);
          }
        });
      });
    },
    practice: {
      task: 'Write the single line of code that would group this dataset by Department and average the Exam column.',
      hint: 'This is the same pattern as the GroupBy mission.',
      answer: "df.groupby('Department')['Exam'].mean()",
    },
    summary: ['Real analysis starts with load → explore → clean', 'Filtering answers "which rows match?"', 'New columns answer "what can I compute?"', 'GroupBy answers "how does this break down by category?"'],
  },
];

/* ---------- generic section shell renderer ------------------ */

function renderSection(sectionId) {
  const section = SECTIONS.find((s) => s.id === sectionId);
  const content = document.getElementById('lesson-content');
  if (!section) return;

  setLastSection(sectionId);
  document.getElementById('header-current-mission').textContent = `Mission: ${section.title}`;

  const bank = QUIZ_BANKS[section.id] || [];
  const predictQ = bank[0] ? [bank[0]] : [];
  const quizQs = bank.length > 1 ? bank.slice(1) : bank;

  content.innerHTML = `
    <div class="section-header">
      <span class="section-eyebrow">Section ${String(section.num).padStart(2, '0')} · ${section.difficulty} · ${section.minutes} min</span>
      <h1>${section.title}</h1>
    </div>

    <section class="lesson-block">
      <h2>Learn</h2>
      <p>${section.learn}</p>
    </section>

    <section class="lesson-block">
      <h2>Visualize</h2>
      <div class="visualize-slot" id="visualize-slot"></div>
    </section>

    <section class="lesson-block">
      <h2>Code</h2>
      <div id="code-slot"></div>
    </section>

    ${predictQ.length ? `
    <section class="lesson-block">
      <h2>Predict</h2>
      <p class="section-sub">Before you scroll on — what do you think happens?</p>
      <div id="predict-slot"></div>
    </section>` : ''}

    <section class="lesson-block">
      <h2>Interact</h2>
      <div id="interact-slot"></div>
    </section>

    <section class="lesson-block">
      <h2>Practice</h2>
      <p class="practice-task">${section.practice.task}</p>
      <div class="btn-row">
        <button type="button" class="btn" id="hint-btn">SHOW HINT</button>
        <button type="button" class="btn" id="answer-btn">SHOW ANSWER</button>
      </div>
      <p class="practice-reveal hidden" id="hint-reveal"></p>
      <pre class="practice-reveal hidden" id="answer-reveal"></pre>
    </section>

    ${quizQs.length ? `
    <section class="lesson-block">
      <h2>Quick Quiz</h2>
      <div id="quiz-slot"></div>
    </section>` : ''}

    <section class="lesson-block section-complete" id="section-complete-block">
      <h2>What You Learned</h2>
      <ul class="recap-list">${section.summary.map((s) => `<li>${s}</li>`).join('')}</ul>
      <div class="complete-card">
        <p class="complete-card__title">Section Complete</p>
        <p>Ready for the next concept?</p>
        <div class="btn-row">
          <button type="button" class="btn" id="mark-complete-btn">${isSectionComplete(section.id) ? 'COMPLETED ✓' : 'MARK COMPLETE'}</button>
          <button type="button" class="btn btn--accent" id="next-section-btn">NEXT SECTION →</button>
        </div>
      </div>
    </section>
  `;

  section.visualize(document.getElementById('visualize-slot'));

  const codeSlot = document.getElementById('code-slot');
  codeSlot.innerHTML = renderCodeBlock(section.id, section.code);
  wireCodeBlock(codeSlot, section.id, section.code);

  if (predictQ.length) {
    renderQuiz(document.getElementById('predict-slot'), predictQ, () => {});
  }

  section.interact(document.getElementById('interact-slot'));

  document.getElementById('hint-btn').addEventListener('click', () => {
    const r = document.getElementById('hint-reveal');
    r.textContent = section.practice.hint;
    r.classList.remove('hidden');
  });
  document.getElementById('answer-btn').addEventListener('click', () => {
    const r = document.getElementById('answer-reveal');
    r.textContent = section.practice.answer;
    r.classList.remove('hidden');
  });

  if (quizQs.length) {
    renderQuiz(document.getElementById('quiz-slot'), quizQs, () => {});
  }

  const completeBtn = document.getElementById('mark-complete-btn');
  completeBtn.addEventListener('click', () => {
    markSectionComplete(section.id);
    completeBtn.textContent = 'COMPLETED ✓';
  });
  document.getElementById('next-section-btn').addEventListener('click', () => {
    const idx = SECTIONS.findIndex((s) => s.id === section.id);
    const next = SECTIONS[idx + 1];
    if (next) {
      markSectionComplete(section.id);
      showView('lesson');
      renderSection(next.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  window.scrollTo({ top: content.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
}

/* ---------- sidebar + mission map ---------------------------- */

function renderSidebar() {
  const sidebar = document.getElementById('lesson-sidebar');
  if (!sidebar) return;
  const last = loadProgress().lastSection;
  sidebar.innerHTML = `
    <p class="sidebar-title">Learning Path</p>
    <nav class="sidebar-nav">
      ${SECTIONS.map((s) => {
        const done = isSectionComplete(s.id);
        const isCurrent = s.id === last;
        const mark = done ? '✓' : (isCurrent ? '→' : '○');
        return `<button type="button" class="sidebar-link ${done ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}" data-goto="${s.id}">
          <span class="sidebar-link__mark">${s.isFinal ? '★' : mark}</span>
          <span>Section ${String(s.num).padStart(2, '0')}<br><strong>${s.title}</strong></span>
        </button>`;
      }).join('')}
    </nav>`;
  sidebar.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => renderSection(btn.dataset.goto));
  });
}

function renderMissionMap() {
  const map = document.getElementById('mission-map');
  if (!map) return;
  map.innerHTML = SECTIONS.map((s) => {
    const done = isSectionComplete(s.id);
    return `
      <button type="button" class="mission-card ${done ? 'is-done' : ''} ${s.isFinal ? 'mission-card--final' : ''}" data-goto="${s.id}">
        <span class="mission-card__num">${s.isFinal ? '★' : 'M' + String(s.num).padStart(2, '0')}</span>
        <span class="mission-card__title">${s.title}</span>
        <span class="mission-card__meta">${s.difficulty} · ${s.minutes} min · 50 XP</span>
        <span class="mission-card__status">${done ? 'Completed' : 'Open'}</span>
      </button>`;
  }).join('');
  map.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showView('lesson');
      renderSection(btn.dataset.goto);
    });
  });
}

/* ---------- view switching (Home / Missions / Playground / Cheat Sheet) */

function showView(view) {
  document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
  document.getElementById('view-' + view).classList.remove('hidden');
  document.querySelectorAll('.main-nav button').forEach((b) => b.classList.toggle('is-active', b.dataset.view === view));
  document.getElementById('main-nav').classList.remove('is-open');
  document.getElementById('nav-toggle').setAttribute('aria-expanded', 'false');
}

/* ---------- cheat sheet -------------------------------------- */

const CHEAT_SHEET = [
  { cmd: 'import pandas as pd', does: 'Loads Pandas into your script.', example: 'import pandas as pd', output: '(pandas is now available as pd)' },
  { cmd: 'pd.Series(data)', does: 'Builds a one-dimensional labeled array.', example: "pd.Series(['g','e','e','k','s'])", output: '0  g\n1  e\n2  e\n3  k\n4  s' },
  { cmd: 'pd.DataFrame(data)', does: 'Builds a two-dimensional table.', example: 'pd.DataFrame(list_of_rows)', output: 'a table with rows and columns' },
  { cmd: 'pd.read_csv(path)', does: 'Loads a CSV file into a DataFrame.', example: 'pd.read_csv("data.csv")', output: 'the file, as a DataFrame' },
  { cmd: 'df.head()', does: 'Previews the first 5 rows.', example: 'df.head()', output: 'first 5 rows of df' },
  { cmd: 'df.info()', does: 'Summarizes columns, types, non-null counts.', example: 'df.info()', output: 'structural summary' },
  { cmd: 'df.isnull()', does: 'Flags missing cells as True.', example: 'df.isnull()', output: 'a table of True/False' },
  { cmd: 'df.fillna(value)', does: 'Replaces missing cells with a value.', example: 'df.fillna(0)', output: 'df, with gaps filled' },
  { cmd: "df['col']", does: 'Selects one column as a Series.', example: "df['Age']", output: 'the Age column' },
  { cmd: "df[df['col'] > x]", does: 'Filters rows matching a condition.', example: "df[df['Age'] > 25]", output: 'only matching rows' },
  { cmd: "df.groupby('col')", does: 'Splits rows into groups by value.', example: "df.groupby('Category')['Sales'].sum()", output: 'one total per category' },
];

function renderCheatSheet() {
  const grid = document.getElementById('cheatsheet-grid');
  if (!grid) return;
  grid.innerHTML = CHEAT_SHEET.map((c, i) => `
    <button type="button" class="cheat-card" data-index="${i}">
      <code>${escapeHtml(c.cmd)}</code>
    </button>`).join('');
  const detail = document.getElementById('cheatsheet-detail');
  grid.querySelectorAll('.cheat-card').forEach((card) => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.cheat-card').forEach((c) => c.classList.remove('is-active'));
      card.classList.add('is-active');
      const c = CHEAT_SHEET[Number(card.dataset.index)];
      detail.innerHTML = `
        <p class="cheat-detail__cmd"><code>${escapeHtml(c.cmd)}</code></p>
        <p><strong>What it does:</strong> ${c.does}</p>
        <p><strong>Example:</strong></p>
        <pre>${escapeHtml(c.example)}</pre>
        <p><strong>Expected output:</strong></p>
        <pre>${escapeHtml(c.output)}</pre>`;
    });
  });
}

/* ---------- code playground / simulator ----------------------- */

function setupPlayground() {
  const runBtn = document.getElementById('play-run');
  const resetBtn = document.getElementById('play-reset');
  const input = document.getElementById('play-input');
  const output = document.getElementById('play-output');
  const defaultCode = "df.head()";
  input.value = defaultCode;

  runBtn.addEventListener('click', () => {
    const lines = input.value.split('\n').map((l) => l.trim()).filter(Boolean);
    const results = lines.map((l) => `>>> ${l}\n${simulatePandas(l)}`);
    output.textContent = results.join('\n\n');
  });
  resetBtn.addEventListener('click', () => {
    input.value = defaultCode;
    output.textContent = 'Output will appear here after you press RUN.';
  });
}

/* ---------- theme toggle --------------------------------------- */

function setupTheme() {
  const btn = document.getElementById('theme-toggle');
  const saved = (() => { try { return localStorage.getItem('pandasDataLab.theme'); } catch (e) { return null; } })();
  if (saved === 'light') document.documentElement.classList.add('theme-light');
  btn.textContent = document.documentElement.classList.contains('theme-light') ? '☀' : '☾';
  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('theme-light');
    const isLight = document.documentElement.classList.contains('theme-light');
    btn.textContent = isLight ? '☀' : '☾';
    try { localStorage.setItem('pandasDataLab.theme', isLight ? 'light' : 'dark'); } catch (e) {}
  });
}

/* ---------- boot ------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  setupTheme();

  document.querySelectorAll('.main-nav button').forEach((b) => {
    b.addEventListener('click', () => showView(b.dataset.view));
  });
  document.getElementById('nav-toggle').addEventListener('click', () => {
    const nav = document.getElementById('main-nav');
    const open = nav.classList.toggle('is-open');
    document.getElementById('nav-toggle').setAttribute('aria-expanded', String(open));
  });

  document.getElementById('start-learning-btn').addEventListener('click', () => {
    const last = loadProgress().lastSection;
    const target = SECTIONS.find((s) => s.id === last) ? last : 'intro';
    showView('lesson');
    renderSection(target);
  });
  document.getElementById('view-missions-btn').addEventListener('click', () => showView('missions'));

  document.getElementById('continue-btn').addEventListener('click', () => {
    const last = loadProgress().lastSection;
    const target = SECTIONS.find((s) => s.id === last) ? last : 'intro';
    showView('lesson');
    renderSection(target);
  });

  renderCheatSheet();
  setupPlayground();
  refreshProgressUI();

  const last = loadProgress().lastSection;
  const continueLabel = document.getElementById('continue-label');
  const lastSectionDef = SECTIONS.find((s) => s.id === last);
  continueLabel.textContent = lastSectionDef ? `Section ${String(lastSectionDef.num).padStart(2, '0')} — ${lastSectionDef.title}` : 'Section 01 — Introduction to Pandas';

  showView('home');
});
