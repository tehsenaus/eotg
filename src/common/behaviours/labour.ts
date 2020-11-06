import {sum} from "d3-array";

export interface Job {
    id: string;
    employerId: string;
    employeeClass: string;
    headcount: number;
    salaryPerDay: number;
    employees: Employee [];
}

export interface Employee {
    id: string;
    populaceId: string;
    jobId: string;
    employeeCount: number;
    productivity: number;
}

export const WORK = "WORK";
export const WORK_EMPLOYEE = "WORK_EMPLOYEE";

export interface EmployeeWorkAction {
    type: typeof WORK_EMPLOYEE;
    employeeId: string;
    populaceId: string;
    employeeCount: number;
    output: number;
    salaryPaid: number;
}

export interface WorkAction {
    type: typeof WORK;
    jobId: string;

    employeeCount: number;
    output: number;
    salaryPaid: number;

    employeeActions: EmployeeWorkAction [];
}

export function work(jobId: string): WorkAction {
    return {
        type: WORK,
        jobId,
        employeeCount: 0,
        output: 0,
        salaryPaid: 0,
        employeeActions: [],
    }
}

export function mapWorkDayActionForJob(action: WorkAction, job: Job): WorkAction {
    const employeeActions = job.employees.map(employee => workEmployee(employee, job));

    return {
        ...action,
        employeeCount: sum(employeeActions, d => d.employeeCount),
        output: sum(employeeActions, d => d.output),
        salaryPaid: sum(employeeActions, d => d.salaryPaid),
    }
}

export function workEmployee(employee: Employee, job: Job): EmployeeWorkAction {
    const output = employee.employeeCount * employee.productivity;
    return {
        type: WORK_EMPLOYEE,
        employeeId: employee.id,
        populaceId: employee.populaceId,
        employeeCount: employee.employeeCount,
        output,
        salaryPaid: employee.employeeCount * job.salaryPerDay,
    }
}
