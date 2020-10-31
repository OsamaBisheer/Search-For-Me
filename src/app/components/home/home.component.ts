import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  faCoffee, faHome, faDollarSign, faBook, faUser, faChartPie, faPlus, faDownload, faAngleDoubleLeft,
  faCog, faLink, faBars, faTimes, faCaretDown, faSearch, faAngleUp, faAngleDown, faAngleDoubleRight, faFilter
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faLinkedinIn, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faQuestionCircle, faEdit } from '@fortawesome/free-regular-svg-icons';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { Subscription, Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogFilterComponent } from './dialog-filter/dialog-filter.component';
import { Filter } from 'src/app/models/filter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  faTimes = faTimes;
  faCoffee = faCoffee;
  faHome = faHome;
  faDollarSign = faDollarSign;
  faBook = faBook;
  faUser = faUser;
  faLink = faLink;
  faChartPie = faChartPie;
  faCog = faCog;
  faTwitter = faTwitter;
  faLinkedin = faLinkedinIn;
  faFacebook = faFacebookF;
  faBars = faBars;
  faEnvelope = faEnvelope;
  faQuestionCircle = faQuestionCircle;
  faCaretDown = faCaretDown;
  faSearch = faSearch;
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;
  faPlus = faPlus;
  faDownload = faDownload;
  faEdit = faEdit;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faFilter = faFilter;
  employees: Array<Employee>;
  private subscribe: Subscription;
  private countObservable: Observable<Array<Employee>>;
  employeesFiltersOperatorFunctions: Array<OperatorFunction<Object, any>>;
  constructor(private employeeService: EmployeeService, private dialog: MatDialog) { }

  ngOnInit(): void {
    //this.employees = this.employeeService.getEmployees();
    this.employeesFiltersOperatorFunctions = [];

    this.employeesFiltersOperatorFunctions.length = 23;

    this.countObservable = this.employeeService.getEmployeesUsingHttp()
      .pipe(map(employeesObject =>
        ((employeesObject as any)
          .data.employees).slice(0, 19)));

    this.subscribe = this.countObservable
      .subscribe(firstEmployeesRange => this.employees = firstEmployeesRange as Array<Employee>);
  }


  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  filterDialog(): void {
    const dialogRef = this.dialog.open(DialogFilterComponent, {
      width: '15rem',
    });

    dialogRef.afterClosed().subscribe((filter: Filter) => {
      switch (filter.filterType) {
        case "Name":
          {
            this.employeesFiltersOperatorFunctions.push(
              map((employees: Array<Employee>) =>
                employees.filter(employee => employee.fullName_FL == filter.name)));

            break;
          }
        case "Salary":
          {
            switch (filter.filterCondition) {
              case "Before":
                {
                  this.employeesFiltersOperatorFunctions.push(
                    map((employees: Array<Employee>) =>
                      employees.filter(employee => parseFloat(employee.firstContractingSalary) < parseFloat(filter.firstValue))));

                  break;

                }
              case "After":
                {
                  this.employeesFiltersOperatorFunctions.push(
                    map((employees: Array<Employee>) =>
                      employees.filter(employee => parseFloat(employee.firstContractingSalary) > parseFloat(filter.firstValue))));

                  break;

                }
              case "Between":
                {
                  this.employeesFiltersOperatorFunctions.push(
                    map((employees: Array<Employee>) =>
                      employees.filter(employee => parseFloat(employee.firstContractingSalary) >= parseFloat(filter.firstValue) &&
                        parseFloat(employee.firstContractingSalary) <= parseFloat(filter.secondValue))));

                  break;

                }
            }
            break;
          }
        case "Date":
          {
            switch (filter.filterCondition) {
              case "Before":
                {
                  this.employeesFiltersOperatorFunctions.push(
                    map((employees: Array<Employee>) =>
                      employees.filter(employee => new Date(employee.hiringDate) < new Date(filter.firstValue))));

                  break;

                }
              case "After":
                {
                  this.employeesFiltersOperatorFunctions.push(
                    map((employees: Array<Employee>) =>
                      employees.filter(employee => new Date(employee.hiringDate) > new Date(filter.firstValue))));

                  break;

                }
              case "Between":
                {
                  this.employeesFiltersOperatorFunctions.push(
                    map((employees: Array<Employee>) =>
                      employees.filter(employee => new Date(employee.hiringDate) >= new Date(filter.firstValue) &&
                        new Date(employee.hiringDate) <= new Date(filter.secondValue))));


                  break;

                }
            }
            break;
          }
      }

      this.callFilters();

      this.openFiltersMenu();
    });
  }

  callFilters(): void {
    console.log(this.employeesFiltersOperatorFunctions);
    if (this.employeesFiltersOperatorFunctions.length == 0) {
      this.subscribe = this.countObservable
        .subscribe(firstEmployeesRange => this.employees = firstEmployeesRange as Array<Employee>);
    }
    else {
      let finalObservable = this.countObservable.pipe(this.employeesFiltersOperatorFunctions[0]);

      if (this.employeesFiltersOperatorFunctions.length > 1) {
        for (let index = 0; index < this.employeesFiltersOperatorFunctions.length - 1; index++) {
          finalObservable = finalObservable
            .pipe(this.employeesFiltersOperatorFunctions[++index]);

        }

      }
      this.subscribe = finalObservable
        .subscribe(firstEmployeesRange => this.employees = firstEmployeesRange as Array<Employee>);

    }

  }

  removeFilter(i: number) {
    this.employeesFiltersOperatorFunctions.splice(i, 1);
    this.callFilters();
  }

  clearFilters(): void {
    this.employeesFiltersOperatorFunctions = [];
    this.callFilters();
    this.closeFiltersMenu();
  }


  openMenu(): void {
    const lists = document.getElementsByClassName("nav-list");
    (lists[0] as any).style.left = "0";
  }

  closeMenu(): void {
    const lists = document.getElementsByClassName("nav-list");
    (lists[0] as any).style.left = "-14rem";
  }

  openFiltersMenu(): void {
    const lists = document.getElementsByClassName("nav-list");
    (lists[1] as any).style.right = "0";
  }

  closeFiltersMenu(): void {
    const lists = document.getElementsByClassName("nav-list");
    (lists[1] as any).style.right = "-14rem";
  }



}


