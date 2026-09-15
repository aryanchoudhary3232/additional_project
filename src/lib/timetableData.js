// IIIT Sri City, Chittoor - Monsoon 2026 - UG 2 Timetable Data

export const INSTITUTION_INFO = {
  name: "Indian Institute of Information Technology Sri City, Chittoor",
  subtitle: "An Institute of National Importance under an Act of Parliament",
  session: "Monsoon 2026",
  batch: "UG 2"
};

export const TIME_SLOTS = [
  { id: 1, time: "08:45 AM - 09:45 AM", type: "class" },
  { id: 2, time: "09:45 AM - 10:45 AM", type: "class" },
  { id: "break-1", time: "10:45 AM - 11:00 AM", type: "break", label: "BREAK (10:45 - 11:00 AM)" },
  { id: 3, time: "11:00 AM - 12:00 PM", type: "class" },
  { id: 4, time: "12:00 PM - 01:00 PM", type: "class" },
  { id: "lunch", time: "01:00 PM - 02:00 PM", type: "break", label: "LUNCH BREAK (1:00 - 2:00 PM)" },
  { id: 5, time: "02:15 PM - 03:15 PM", type: "class" },
  { id: 6, time: "03:15 PM - 04:15 PM", type: "class" },
  { id: "break-2", time: "04:15 PM - 04:30 PM", type: "break", label: "BREAK (04:15 - 04:30 PM)" },
  { id: 7, time: "04:30 PM - 05:30 PM", type: "class" },
  { id: 8, time: "05:30 PM - 06:30 PM", type: "class" }
];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const TIMETABLE_DATA = {
  Monday: {
    1: { isFree: false, items: [{ course: "PC2", room: "B05" }, { course: "OOP4", room: "G05" }, { course: "RANAC1", room: "G06" }] },
    2: { isFree: false, items: [{ course: "RANAC2", room: "G04" }, { course: "CS", room: "B03" }, { course: "ADSA1", room: "G06" }] },
    3: { isFree: false, items: [{ course: "DBMS1", room: "G05" }, { course: "CNA", room: "G06" }, { course: "DBMS3", room: "G07" }] },
    4: { isFree: false, items: [{ course: "OS1", room: "G04" }, { course: "OS2", room: "G05" }, { course: "OS3", room: "G06" }, { course: "ML", room: "109" }] },
    5: { isFree: false, items: [{ course: "DBMS2", room: "G04" }, { course: "ADSA3", room: "G05" }, { course: "RANAC4", room: "G09" }] },
    6: { isFree: false, items: [{ course: "RANAC3", room: "G04" }, { course: "ADSA2", room: "G05" }, { course: "OOP4", room: "G07" }] },
    7: { isFree: false, items: [{ course: "OOP2 Lab", room: "103" }, { course: "PC4", room: "B05" }, { course: "PC3 Lab", room: "B06" }] },
    8: { isFree: false, items: [{ course: "PC3 Lab", room: "B06" }, { course: "OOP2 Lab", room: "103" }] }
  },
  Tuesday: {
    1: { isFree: false, items: [{ course: "RANAC3", room: "G05" }, { course: "CNA", room: "G06" }] },
    2: { isFree: false, items: [{ course: "OOP1", room: "G04" }, { course: "CS", room: "G05" }] },
    3: { isFree: false, items: [{ course: "OOP3 Lab", room: "103" }, { course: "DBMS1", room: "G04" }, { course: "OOP2", room: "G05" }] },
    4: { isFree: false, items: [{ course: "OOP3 Lab", room: "103" }, { course: "PC1", room: "B05" }] },
    5: { isFree: false, items: [{ course: "OS1", room: "G04" }, { course: "OS2", room: "G05" }, { course: "OS3", room: "G06" }, { course: "ML", room: "108" }] },
    6: { isFree: false, items: [{ course: "ADSA1", room: "G04" }, { course: "ES LAB", room: "114/102" }, { course: "ADSA3", room: "G05" }, { course: "DBMS2", room: "G06" }] },
    7: { isFree: false, items: [{ course: "RANAC1", room: "G08" }, { course: "ES LAB", room: "114/102" }, { course: "ADSA2 Lab", room: "103" }] },
    8: { isFree: false, items: [{ course: "ADSA2 Lab", room: "103" }] }
  },
  Wednesday: {
    1: { isFree: false, items: [{ course: "ADSA2", room: "G04" }, { course: "CS", room: "G05" }, { course: "DBMS3", room: "G06" }] },
    2: { isFree: false, items: [{ course: "RANAC2", room: "G04" }, { course: "PC4", room: "B05" }] },
    3: { isFree: false, items: [{ course: "ADSA1", room: "G06" }, { course: "ADSA3 LAB", room: "103" }] },
    4: { isFree: false, items: [{ course: "OOP1", room: "G04" }, { course: "RANAC4", room: "G06" }, { course: "ADSA3 LAB", room: "103" }] },
    5: { isFree: false, items: [{ course: "OOP4", room: "G08" }, { course: "OOP3", room: "G06" }, { course: "OOP1 Lab", room: "103" }] },
    6: { isFree: false, items: [{ course: "RANAC2", room: "G04" }, { course: "OOP1 Lab", room: "103" }, { course: "ES", room: "G07" }] },
    7: { isFree: true, note: "UG2 FREE SLOT - Perfect for Doubt Clearing / Extra Sessions!" },
    8: { isFree: true, note: "UG2 FREE SLOT - Perfect for Doubt Clearing / Extra Sessions!" }
  },
  Thursday: {
    1: { isFree: false, items: [{ course: "RANAC1", room: "G09" }, { course: "RANAC4", room: "G06" }, { course: "PC3", room: "B06" }] },
    2: { isFree: false, items: [{ course: "CNA", room: "G06" }, { course: "OOP2", room: "G08" }] },
    3: { isFree: false, items: [{ course: "DBMS1", room: "G06" }, { course: "CNA Lab", room: "114/102" }, { course: "RANAC3", room: "G05" }] },
    4: { isFree: false, items: [{ course: "CNA Lab", room: "114/102" }, { course: "OS1", room: "G04" }, { course: "OS2", room: "G05" }, { course: "OS3", room: "G06" }, { course: "ML", room: "111" }] },
    5: { isFree: false, items: [{ course: "OOP4 Lab", room: "103" }, { course: "OOP3", room: "G05" }, { course: "PC2", room: "B06" }] },
    6: { isFree: false, items: [{ course: "RANAC2", room: "G04" }, { course: "OOP4 Lab", room: "103" }] },
    7: { isFree: false, items: [{ course: "DBMS2 LAB", room: "103" }, { course: "CS", room: "G09" }, { course: "DBMS3", room: "G06" }, { course: "OOP1", room: "G04" }] },
    8: { isFree: false, items: [{ course: "DBMS2 LAB", room: "103" }] }
  },
  Friday: {
    1: { isFree: false, items: [{ course: "RANAC3", room: "G05" }, { course: "PC4 Lab", room: "B05" }, { course: "ADSA1 LAB", room: "103" }] },
    2: { isFree: false, items: [{ course: "ADSA1 LAB", room: "103" }, { course: "PC4 Lab", room: "B05" }, { course: "OS2", room: "G05" }, { course: "OS3", room: "B04" }] },
    3: { isFree: false, items: [{ course: "PC3", room: "B05" }, { course: "OS1", room: "G07" }, { course: "ES", room: "G06" }] },
    4: { isFree: false, items: [{ course: "DBMS2", room: "G06" }, { course: "ADSA3", room: "G08" }] },
    5: { isFree: false, items: [{ course: "RANAC1", room: "G04" }, { course: "ES", room: "G06" }, { course: "ADSA2", room: "G07" }] },
    6: { isFree: false, items: [{ course: "DBMS1 LAB", room: "103" }, { course: "OOP3", room: "G05" }, { course: "OOP2", room: "G06" }, { course: "RANAC4", room: "G04" }] },
    7: { isFree: false, items: [{ course: "DBMS1 LAB", room: "103" }, { course: "DBMS3 LAB", room: "G05" }] },
    8: { isFree: false, items: [{ course: "DBMS3 LAB", room: "G05" }] }
  },
  Saturday: {
    1: { isFree: false, items: [{ course: "PC1 Lab", room: "103" }] },
    2: { isFree: false, items: [{ course: "PC1 Lab", room: "103" }] },
    3: { isFree: true, note: "UG2 FREE SLOT - Perfect for Saturday Doubt Clearing!" },
    4: { isFree: true, note: "UG2 FREE SLOT - Perfect for Saturday Doubt Clearing!" },
    5: { isFree: false, items: [{ course: "PC2 Lab", room: "103" }] },
    6: { isFree: false, items: [{ course: "PC2 Lab", room: "103" }] },
    7: { isFree: true, note: "UG2 FREE SLOT - Weekend Office Hours!" },
    8: { isFree: true, note: "UG2 FREE SLOT - Weekend Office Hours!" }
  }
};
