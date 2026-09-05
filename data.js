/* ============================================================
   data.js
   Every dataset used across the Data Lab lives here. Keeping
   the data in one file means every section reuses the same
   students / products, so learners get familiar with it.
   ============================================================ */

// A tiny list, used to build the very first Series example.
const SERIES_LETTERS = ['g', 'e', 'e', 'k', 's'];

// A short list of names, used for a second, friendlier Series.
const SERIES_NAMES = ['Arun', 'Rahul', 'Anu', 'Meera'];

// The core "student" DataFrame reused in Missions 03, 06, 08.
const STUDENT_DATA = [
  { Name: 'Arun',  Age: 21, Course: 'Python', Score: 85 },
  { Name: 'Anu',   Age: 22, Course: 'Pandas', Score: 91 },
  { Name: 'Rahul', Age: 20, Course: 'Python', Score: 76 },
  { Name: 'Meera', Age: 23, Course: 'SQL',    Score: 88 },
  { Name: 'Devi',  Age: 26, Course: 'Pandas', Score: 69 },
  { Name: 'Kiran', Age: 24, Course: 'SQL',    Score: 94 },
];

// Same student list, but with a couple of missing scores/ages —
// used only in the Missing Data mission.
const MISSING_DATA = [
  { Name: 'Arun',  Age: 21,   Score: 85 },
  { Name: 'Anu',   Age: null, Score: 91 },
  { Name: 'Rahul', Age: 20,   Score: null },
  { Name: 'Meera', Age: 23,   Score: 88 },
];

// Two test-score columns, used in the "add a column" mission.
const TEST_SCORES = [
  { Student: 'Arun',  Test1: 40, Test2: 45 },
  { Student: 'Anu',   Test1: 42, Test2: 48 },
  { Student: 'Rahul', Test1: 35, Test2: 40 },
];

// A small sales dataset, used in the GroupBy mission.
const SALES_DATA = [
  { Product: 'Laptop', Category: 'Electronics', Sales: 50000 },
  { Product: 'Mouse',  Category: 'Electronics', Sales: 5000 },
  { Product: 'Chair',  Category: 'Furniture',   Sales: 12000 },
  { Product: 'Table',  Category: 'Furniture',   Sales: 20000 },
  { Product: 'Phone',  Category: 'Electronics', Sales: 30000 },
];

// The dataset for the Final Data Analyst Challenge.
const FINAL_DATA = [
  { Name: 'Arun',  Age: 21, Department: 'CS',   Attendance: 92, Assignment: 40, Exam: 85, Status: 'Active' },
  { Name: 'Anu',   Age: 22, Department: 'CS',   Attendance: 88, Assignment: 45, Exam: 91, Status: 'Active' },
  { Name: 'Rahul', Age: 20, Department: 'ECE',  Attendance: 75, Assignment: 30, Exam: 76, Status: 'Active' },
  { Name: 'Meera', Age: 23, Department: 'ECE',  Attendance: 95, Assignment: 47, Exam: 88, Status: 'Active' },
  { Name: 'Devi',  Age: 26, Department: 'CS',   Attendance: 60, Assignment: 20, Exam: 55, Status: 'Inactive' },
  { Name: 'Kiran', Age: 24, Department: 'MECH', Attendance: 90, Assignment: 44, Exam: 94, Status: 'Active' },
];

// Helper: get the column names of a row-array dataset.
function getColumns(dataset) {
  return dataset.length ? Object.keys(dataset[0]) : [];
}
