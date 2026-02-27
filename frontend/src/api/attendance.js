import client from "./client";

export const markAttendance = (data) =>
    client.post("/attendance", data).then((r) => r.data);

export const getAttendance = (employeeId, date = null) => {
    const params = date ? { date } : {};
    return client.get(`/attendance/${employeeId}`, { params }).then((r) => r.data);
};

export const getDashboard = () =>
    client.get("/dashboard").then((r) => r.data);

export const getWeeklyAttendance = () =>
    client.get("/dashboard/weekly").then((r) => r.data);
