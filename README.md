# Pandas Data Lab

**Analyze. Transform. Discover.**

An interactive, self-paced classroom for learning the fundamentals of the Python
Pandas library — built with plain HTML, CSS, and vanilla JavaScript. No build step,
no backend, no database, no account required.

## Running it

Just open `index.html` in a browser, or serve the folder with any static file
server (for example `python -m http.server` from inside this folder). Every
feature — sections, quizzes, the code simulator, the cheat sheet, XP — works
completely offline once the page has loaded.

## Structure

```text
pandas-data-lab/
├── index.html          Page shell: header, hero, dashboard, mission map,
│                        lesson layout, playground, cheat sheet
├── css/
│   └── style.css        The full design system and all component styles
└── js/
    ├── data.js           Every dataset used across the lab (students, sales, etc.)
    ├── quiz.js            Reusable quiz engine + one question bank per section
    ├── simulator.js      JS-based "Pandas simulator" for the code playground
    ├── progress.js        XP, badges, and last-visited-section, via localStorage
    └── app.js              Navigation, the 12 learning sections, and every
                             interactive lab (Series explorer, DataFrame click
                             highlighting, filter builder, data-cleaning lab,
                             groupby lab, final challenge, etc.)
```

## How the learning path works

The site teaches **twelve sections**, one concept at a time:

1. Introduction to Pandas
2. Installation & Import
3. Pandas Series
4. DataFrames
5. Loading CSV Data
6. Exploring Data
7. Missing Data
8. Selecting Data
9. Filtering Data
10. Adding & Removing Columns
11. GroupBy
12. Final Data Analyst Challenge

Every section follows the same rhythm: **Learn → Visualize → Code → Predict →
Interact → Practice → Quick Quiz → What You Learned**. Nothing is ever locked —
a learner can jump straight to Section 09 from the sidebar or the Mission Map
without finishing 01–08 first. `localStorage` is used only as a convenience,
to remember XP/badges and which section to resume — if it's unavailable or
cleared, the site still works perfectly; it just won't remember progress
between visits.

## The Pandas Simulator

Since real Python can't run in a browser, the Playground (and several
in-lesson "Interact" widgets) recognize a fixed set of example commands —
`df.head()`, `df.info()`, `df['Age']`, `df[df['Age'] > 25]`,
`df.isnull().sum()`, `df.fillna(0)`, `df.groupby('Category')['Sales'].sum()`,
and a few more — and return realistic simulated output. It's clearly labeled
as a simulator, not a real interpreter.
