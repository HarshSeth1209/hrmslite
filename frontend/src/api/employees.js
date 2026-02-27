import client from "./client";

export const getEmployees = () => client.get("/employees").then((r) => r.data);

export const createEmployee = (data) =>
    client.post("/employees", data).then((r) => r.data);

export const deleteEmployee = (employeeId) =>
    client.delete(`/employees/${employeeId}`);
