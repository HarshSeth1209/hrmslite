export const MOCK_EMPLOYEES = [
    { id: 1, employee_id: "EMP001", full_name: "Aarav Sharma", email: "aarav.sharma@hrms.in", department: "Engineering", present_days: 22 },
    { id: 2, employee_id: "EMP002", full_name: "Priya Patel", email: "priya.patel@hrms.in", department: "Engineering", present_days: 20 },
    { id: 3, employee_id: "EMP003", full_name: "Rohan Mehta", email: "rohan.mehta@hrms.in", department: "Engineering", present_days: 19 },
    { id: 4, employee_id: "EMP004", full_name: "Ananya Gupta", email: "ananya.gupta@hrms.in", department: "Engineering", present_days: 21 },
    { id: 5, employee_id: "EMP005", full_name: "Vikram Singh", email: "vikram.singh@hrms.in", department: "Design", present_days: 23 },
    { id: 6, employee_id: "EMP006", full_name: "Neha Reddy", email: "neha.reddy@hrms.in", department: "Design", present_days: 18 },
    { id: 7, employee_id: "EMP007", full_name: "Arjun Nair", email: "arjun.nair@hrms.in", department: "Design", present_days: 20 },
    { id: 8, employee_id: "EMP008", full_name: "Kavya Iyer", email: "kavya.iyer@hrms.in", department: "Marketing", present_days: 17 },
    { id: 9, employee_id: "EMP009", full_name: "Aditya Joshi", email: "aditya.joshi@hrms.in", department: "Marketing", present_days: 22 },
    { id: 10, employee_id: "EMP010", full_name: "Sneha Kulkarni", email: "sneha.kulkarni@hrms.in", department: "Marketing", present_days: 21 },
    { id: 11, employee_id: "EMP011", full_name: "Rahul Verma", email: "rahul.verma@hrms.in", department: "Finance", present_days: 19 },
    { id: 12, employee_id: "EMP012", full_name: "Ishita Bose", email: "ishita.bose@hrms.in", department: "Finance", present_days: 20 },
    { id: 13, employee_id: "EMP013", full_name: "Manish Tiwari", email: "manish.tiwari@hrms.in", department: "Finance", present_days: 18 },
    { id: 14, employee_id: "EMP014", full_name: "Deepika Rao", email: "deepika.rao@hrms.in", department: "HR", present_days: 23 },
    { id: 15, employee_id: "EMP015", full_name: "Karthik Menon", email: "karthik.menon@hrms.in", department: "HR", present_days: 21 },
    { id: 16, employee_id: "EMP016", full_name: "Pooja Deshmukh", email: "pooja.deshmukh@hrms.in", department: "Operations", present_days: 20 },
    { id: 17, employee_id: "EMP017", full_name: "Siddharth Chopra", email: "siddharth.chopra@hrms.in", department: "Operations", present_days: 22 },
    { id: 18, employee_id: "EMP018", full_name: "Meera Krishnan", email: "meera.krishnan@hrms.in", department: "Operations", present_days: 19 },
    { id: 19, employee_id: "EMP019", full_name: "Amit Saxena", email: "amit.saxena@hrms.in", department: "Engineering", present_days: 21 },
    { id: 20, employee_id: "EMP020", full_name: "Divya Thakur", email: "divya.thakur@hrms.in", department: "Design", present_days: 20 },
];

function localDateStr(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export const MOCK_WEEKLY = [
    { date: localDateStr(-6), present: 17, absent: 3 },
    { date: localDateStr(-5), present: 18, absent: 2 },
    { date: localDateStr(-4), present: 16, absent: 4 },
    { date: localDateStr(-3), present: 19, absent: 1 },
    { date: localDateStr(-2), present: 17, absent: 3 },
    { date: localDateStr(-1), present: 18, absent: 2 },
    { date: localDateStr(0),  present: 17, absent: 3 },
];

export const MOCK_SUMMARY = {
    total_employees: MOCK_EMPLOYEES.length,
    present_today: 17,
    absent_today: 3,
    unmarked_today: 0,
    total_attendance_records: MOCK_EMPLOYEES.reduce((sum, e) => sum + e.present_days, 0),
};
