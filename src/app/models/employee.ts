import { Position } from "./position";
import { Department } from "./department";
import { EmployeeJobStatus } from "./employee-job-status";

export class Employee {
    id: string;
    fullName_FL: string;
    fullName_SL: string;
    hiringDate: string;
    firstContractingSalary: string;
    position: Position;
    department: Department;
    employeeJobStatuses: Array<EmployeeJobStatus>;
}
