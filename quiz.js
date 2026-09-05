/* ============================================================
   quiz.js
   A small, reusable engine for rendering multiple-choice /
   true-false / "predict the output" questions and grading them
   instantly. Every mission's Predict step and Quick Quiz step
   both call renderQuiz() with their own question list.
   ============================================================ */

/**
 * @param {HTMLElement} container - element to render into
 * @param {Array}       questions - [{ prompt, options: [{id,text}], correctId, explanation }]
 * @param {Function}    onFinish  - called with (correctCount, total) once every question is answered
 */
function renderQuiz(container, questions, onFinish) {
  let answered = 0;
  let correctCount = 0;

  container.innerHTML = '';

  questions.forEach((q, qIndex) => {
    const qEl = document.createElement('div');
    qEl.className = 'quiz-question';
    qEl.innerHTML = `
      <p class="quiz-prompt">${q.prompt}</p>
      <div class="quiz-options" role="group" aria-label="Answer options"></div>
      <p class="quiz-feedback" aria-live="polite"></p>
    `;
    const optionsWrap = qEl.querySelector('.quiz-options');
    const feedbackEl = qEl.querySelector('.quiz-feedback');

    q.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        if (qEl.dataset.locked === 'true') return;
        qEl.dataset.locked = 'true';

        const isCorrect = opt.id === q.correctId;
        btn.classList.add(isCorrect ? 'quiz-option--correct' : 'quiz-option--wrong');
        [...optionsWrap.children].forEach((sib) => {
          sib.disabled = true;
          if (sib !== btn && sib.textContent === q.options.find((o) => o.id === q.correctId).text) {
            sib.classList.add('quiz-option--correct');
          }
        });

        feedbackEl.innerHTML =
          `<span class="quiz-feedback__tag">${isCorrect ? 'Correct' : 'Not quite'}</span> ${q.explanation}`;
        feedbackEl.classList.add(isCorrect ? 'is-correct' : 'is-wrong');

        recordQuizAnswer(isCorrect);
        answered += 1;
        if (isCorrect) correctCount += 1;

        if (answered === questions.length && typeof onFinish === 'function') {
          onFinish(correctCount, questions.length);
        }
      });
      optionsWrap.appendChild(btn);
    });

    container.appendChild(qEl);
  });
}

/* ---- Question banks, one array per section id ------------- */
const QUIZ_BANKS = {
  intro: [
    {
      prompt: 'What is Pandas mainly used for?',
      options: [
        { id: 'a', text: 'Creating games' },
        { id: 'b', text: 'Data manipulation and analysis' },
        { id: 'c', text: 'Designing websites' },
        { id: 'd', text: 'Operating systems' },
      ],
      correctId: 'b',
      explanation: 'Pandas gives you fast, flexible tools for working with tabular data — much like a spreadsheet, but in code.',
    },
    {
      prompt: 'True or false: Pandas can only be used with data already stored in a database.',
      options: [
        { id: 'a', text: 'True' },
        { id: 'b', text: 'False' },
      ],
      correctId: 'b',
      explanation: 'Pandas reads from CSV files, Excel files, databases, and even plain Python lists — a database is never required.',
    },
  ],
  install: [
    {
      prompt: 'Which command installs Pandas?',
      options: [
        { id: 'a', text: 'pip install pandas' },
        { id: 'b', text: 'npm install pandas' },
        { id: 'c', text: 'pandas --setup' },
        { id: 'd', text: 'install pandas.py' },
      ],
      correctId: 'a',
      explanation: 'Pandas is a Python package, so it is installed with pip, Python\'s package manager.',
    },
    {
      prompt: 'What does "import pandas as pd" do?',
      options: [
        { id: 'a', text: 'Deletes Pandas after use' },
        { id: 'b', text: 'Loads Pandas and gives it the short name pd' },
        { id: 'c', text: 'Installs Pandas for the first time' },
        { id: 'd', text: 'Creates a new DataFrame named pd' },
      ],
      correctId: 'b',
      explanation: '"pd" is just an alias — a shorter name so you don\'t have to type "pandas" every time.',
    },
  ],
  series: [
    {
      prompt: 'What do you think this code produces?\n\ns = pd.Series(["g","e","e","k","s"])\nprint(s)',
      options: [
        { id: 'a', text: 'A plain Python list' },
        { id: 'b', text: 'A one-dimensional labeled Series' },
        { id: 'c', text: 'A two-dimensional DataFrame' },
        { id: 'd', text: 'A syntax error' },
      ],
      correctId: 'b',
      explanation: 'pd.Series() always builds a one-dimensional array with an index attached — even from a plain list.',
    },
    {
      prompt: 'Which command creates a Pandas Series?',
      options: [
        { id: 'a', text: 'pd.array()' },
        { id: 'b', text: 'pd.column()' },
        { id: 'c', text: 'pd.Series()' },
        { id: 'd', text: 'pd.DataFrame()' },
      ],
      correctId: 'c',
      explanation: 'pd.Series() is the constructor for a one-dimensional labeled array.',
    },
  ],
  dataframe: [
    {
      prompt: 'Which column contains the students\' scores in the table above?',
      options: [
        { id: 'a', text: 'Name' },
        { id: 'b', text: 'Course' },
        { id: 'c', text: 'Score' },
        { id: 'd', text: 'Age' },
      ],
      correctId: 'c',
      explanation: 'The "Score" column holds each student\'s numeric result.',
    },
    {
      prompt: 'A DataFrame is best described as:',
      options: [
        { id: 'a', text: 'A single column of labeled values' },
        { id: 'b', text: 'A two-dimensional table of rows and columns' },
        { id: 'c', text: 'A type of Python loop' },
        { id: 'd', text: 'A chart library' },
      ],
      correctId: 'b',
      explanation: 'A DataFrame stacks many columns (often many Series) together into one table.',
    },
  ],
  explore: [
    {
      prompt: 'What does df.head() do by default?',
      options: [
        { id: 'a', text: 'Shows the first 5 rows' },
        { id: 'b', text: 'Deletes the first 5 rows' },
        { id: 'c', text: 'Shows column data types only' },
        { id: 'd', text: 'Sorts the DataFrame' },
      ],
      correctId: 'a',
      explanation: 'head() previews the first 5 rows by default, which is handy for a quick sanity check.',
    },
    {
      prompt: 'Which command tells you column names, counts, and data types all at once?',
      options: [
        { id: 'a', text: 'df.head()' },
        { id: 'b', text: 'df.info()' },
        { id: 'c', text: 'df.describe_columns()' },
        { id: 'd', text: 'df.types()' },
      ],
      correctId: 'b',
      explanation: 'info() gives a structural summary: row count, column names, non-null counts, and dtypes.',
    },
  ],
  missing: [
    {
      prompt: 'What does df.isnull().sum() return?',
      options: [
        { id: 'a', text: 'The total of every numeric column' },
        { id: 'b', text: 'The count of missing values per column' },
        { id: 'c', text: 'A copy of the DataFrame with no missing values' },
        { id: 'd', text: 'The number of rows in the DataFrame' },
      ],
      correctId: 'b',
      explanation: 'isnull() flags each missing cell as True, and sum() adds those up per column.',
    },
    {
      prompt: 'What does df.fillna(0) do?',
      options: [
        { id: 'a', text: 'Deletes rows with missing values' },
        { id: 'b', text: 'Replaces missing values with 0' },
        { id: 'c', text: 'Replaces every value with 0' },
        { id: 'd', text: 'Counts missing values' },
      ],
      correctId: 'b',
      explanation: 'fillna(0) only touches the missing cells — everything else in the DataFrame stays the same.',
    },
  ],
  loadcsv: [
    {
      prompt: 'Which command loads a CSV file into a DataFrame?',
      options: [
        { id: 'a', text: 'pd.open_csv("data.csv")' },
        { id: 'b', text: 'pd.read_csv("data.csv")' },
        { id: 'c', text: 'pd.csv("data.csv")' },
        { id: 'd', text: 'pd.load("data.csv")' },
      ],
      correctId: 'b',
      explanation: 'read_csv() reads a CSV file from disk (or a URL) and returns it as a DataFrame.',
    },
    {
      prompt: 'True or false: read_csv() can only read files that are already sorted.',
      options: [
        { id: 'a', text: 'True' },
        { id: 'b', text: 'False' },
      ],
      correctId: 'b',
      explanation: 'read_csv() loads the file exactly as it is — sorting is a separate step you do afterwards, if needed.',
    },
  ],
  selecting: [
    {
      prompt: "What does df['Age'] return?",
      options: [
        { id: 'a', text: 'The whole DataFrame' },
        { id: 'b', text: 'Just the Age column, as a Series' },
        { id: 'c', text: 'Only the first row' },
        { id: 'd', text: 'An error, because Age must be quoted differently' },
      ],
      correctId: 'b',
      explanation: "Square-bracket column selection returns a single column as a Series.",
    },
  ],
  filtering: [
    {
      prompt: "What will df[df['Age'] > 22] return?",
      options: [
        { id: 'a', text: 'Only rows where Age is greater than 22' },
        { id: 'b', text: 'Only the Age column' },
        { id: 'c', text: 'Every row, sorted by Age' },
        { id: 'd', text: 'An error' },
      ],
      correctId: 'a',
      explanation: 'The condition inside the brackets builds a True/False mask, and only the True rows are kept.',
    },
    {
      prompt: 'Find the mistake: df[df["Age" > 22]]',
      options: [
        { id: 'a', text: 'Nothing is wrong' },
        { id: 'b', text: 'The comparison is inside the wrong brackets — it compares a column NAME, not its values' },
        { id: 'c', text: '22 should be in quotes' },
        { id: 'd', text: 'df should be capitalized' },
      ],
      correctId: 'b',
      explanation: 'The condition needs to compare df["Age"] (the column of values), not the string "Age" itself.',
    },
  ],
  columns: [
    {
      prompt: "What does df['total'] = df['Test1'] + df['Test2'] do?",
      options: [
        { id: 'a', text: 'Overwrites Test1 with Test2' },
        { id: 'b', text: 'Creates a new "total" column that adds the two columns row by row' },
        { id: 'c', text: 'Deletes both columns' },
        { id: 'd', text: 'Throws an error, since columns can\'t be added' },
      ],
      correctId: 'b',
      explanation: 'Pandas adds columns element-by-element and stores the result in a brand-new column.',
    },
  ],
  groupby: [
    {
      prompt: "What does df.groupby('Category')['Sales'].sum() calculate?",
      options: [
        { id: 'a', text: 'The total sales for the whole DataFrame' },
        { id: 'b', text: 'The total sales for each category' },
        { id: 'c', text: 'The average price per product' },
        { id: 'd', text: 'The number of categories only' },
      ],
      correctId: 'b',
      explanation: 'groupby splits rows into groups by the given column, then sum() totals Sales within each group.',
    },
    {
      prompt: 'Which of these is NOT something you can compute after a groupby?',
      options: [
        { id: 'a', text: 'sum()' },
        { id: 'b', text: 'count()' },
        { id: 'c', text: 'mean()' },
        { id: 'd', text: 'import()' },
      ],
      correctId: 'd',
      explanation: 'import() isn\'t an aggregation — sum, count, and mean are common groupby aggregations.',
    },
  ],
  final: [
    {
      prompt: 'A colleague asks for "average exam score per department." Which combination of tools gets you there?',
      options: [
        { id: 'a', text: 'df.head() then df.info()' },
        { id: 'b', text: "df.groupby('Department')['Exam'].mean()" },
        { id: 'c', text: "df['Department'] + df['Exam']" },
        { id: 'd', text: 'df.fillna(0)' },
      ],
      correctId: 'b',
      explanation: 'groupby splits rows by Department, then mean() averages the Exam column within each group.',
    },
  ],
};
