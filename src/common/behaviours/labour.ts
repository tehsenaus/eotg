
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
        byPopulace: {},
    }
}

export function mapWorkDayActionForJob(action: WorkAction, job: Job): WorkAction {
    const employeeActions = job.employees.map(employee => workEmployee(employee, job));

    return {
        ...action,
        employeeCount,
        output,
        salaryPaid: employeeCount * job.salaryPerDay,
    }
}

export function reduceWorkActionForJobEmployee(action: WorkAction, employee: Employee): WorkAction {
    const output = employee.employeeCount * employee.productivity;
    return {
        ...action,
        employeeCount: action.employeeCount + employee.employeeCount,
        output: action.output + output,
        byPopulace: {
            ...action.byPopulace,
            [employee.populaceId]: {
                employeeCount: employee.employeeCount,
                output,
            }
        }
    }
}
