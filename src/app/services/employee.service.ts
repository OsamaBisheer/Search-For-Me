import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import EmployeeObject from '../../assets/Employees.json';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  getEmployees(): Array<Employee> {
    return EmployeeObject.data.employees;
  }

  getEmployeesUsingHttp() {
    return this.http.get('http://localhost:4200/assets/Employees.json');
  }
}
