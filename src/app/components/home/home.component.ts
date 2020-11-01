import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import {
  faCoffee, faHome, faDollarSign, faBook, faUser, faChartPie, faPlus, faDownload, faAngleDoubleLeft,
  faCog, faLink, faBars, faTimes, faCaretDown, faSearch, faAngleUp, faAngleDown, faAngleDoubleRight, faFilter
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faLinkedinIn, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faQuestionCircle, faEdit } from '@fortawesome/free-regular-svg-icons';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { Subscription, Observable, OperatorFunction, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogFilterComponent } from './dialog-filter/dialog-filter.component';
import { Filter } from 'src/app/models/filter';
import { DomSanitizer } from '@angular/platform-browser'

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
  //private subscribe: Subscription;
  //private resizeSubscription: Subscription;
  //private loadSubscription: Subscription;
  private allSubscriptions: Array<Subscription>;
  private initialObservable: Observable<Object>;
  private finalObservable: Observable<Object>;
  employeesFiltersOperatorFunctions: Array<OperatorFunction<Object, any>>;
  startIndex: number;
  size: number;
  employeesCount: number;
  lastPage: number;
  sizeOptions: Array<number>;
  private pageinitionOperatorFunction: OperatorFunction<Object, any>

  constructor(private employeeService: EmployeeService, private dialog: MatDialog, private elementRef: ElementRef) {
  }

  ngOnInit(): void {

    this.allSubscriptions = [];

    this.employeesFiltersOperatorFunctions = [];

    this.startIndex = 0;

    this.size = 20;

    this.lastPage = 0;

    this.sizeOptions = [20, 10, 5];

    this.initialObservable = this.employeeService.getEmployeesUsingHttp()
      .pipe(map(employeesObject => ((employeesObject as any).data.employees)));

    this.pageinitionOperatorFunction = this.getPagitionationOperatorFunction();

    this.allSubscriptions.push(fromEvent(window, 'load').subscribe(e => {
      this.moveTableSettings((e.currentTarget as any).innerWidth);
    }));

    this.allSubscriptions.push(fromEvent(window, 'resize').subscribe(e => {
      this.moveTableSettings((e.target as any).innerWidth);
    }));

    this.allSubscriptions.push(this.callCountObservable(this.initialObservable));
  }

  onChangeSize(e: Event) {
    this.size = (e.target as any).value;
    this.resetIndex();
    this.callObservableAfterPagintion();
  }


  callCountObservable(observable: Observable<Object>): Subscription {
    this.allSubscriptions.push(this.getLastPage(observable));

    return observable
      .pipe(this.pageinitionOperatorFunction)
      .subscribe(firstEmployeesRange =>
        this.employees = firstEmployeesRange as Array<Employee>
      );
  }

  getLastPage(observable: Observable<Object>): Subscription {
    return observable.subscribe(employees => {
      this.employeesCount = (employees as any).length;
      this.lastPage = Math.ceil(this.employeesCount / this.size);
    });
  }

  filterDialog(): void {
    const dialogRef = this.dialog.open(DialogFilterComponent, {
      width: '15rem',
    });

    dialogRef.afterClosed().subscribe((filter: Filter) => {

      if (!filter)
        return;

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

      this.elementRef.nativeElement.querySelector("#openFiltersMenu").style.display = "flex";

      this.resetIndex();

      this.callFilters();

      this.openFiltersMenu();
    });
  }

  callFilters(): void {
    let subscribe;
    if (this.employeesFiltersOperatorFunctions.length == 0) {
      subscribe = this.callCountObservable(this.initialObservable);
    }
    else {

      this.finalObservable = this.initialObservable.pipe(this.employeesFiltersOperatorFunctions[0]);

      if (this.employeesFiltersOperatorFunctions.length > 1) {
        for (let index = 0; index < this.employeesFiltersOperatorFunctions.length - 1; index++) {
          this.finalObservable = this.finalObservable
            .pipe(this.employeesFiltersOperatorFunctions[++index]);

        }

      }

      subscribe = this.callCountObservable(this.finalObservable);

    }

    this.allSubscriptions.push(subscribe);

  }

  resetIndex(): void {
    this.startIndex = 0;
  }

  removeFilter(i: number): void {
    this.employeesFiltersOperatorFunctions.splice(i, 1);
    this.resetIndex();
    this.callFilters();
    if (this.employeesFiltersOperatorFunctions.length == 0)
      this.elementRef.nativeElement.querySelector("#openFiltersMenu").style.display = "none";
    else
      this.elementRef.nativeElement.querySelector("#openFiltersMenu").style.display = "flex";
  }

  clearFilters(): void {
    this.elementRef.nativeElement.querySelector("#openFiltersMenu").style.display = "none";
    this.employeesFiltersOperatorFunctions = [];
    this.resetIndex();
    this.callFilters();
    this.closeFiltersMenu();
  }

  next(): void {
    this.startIndex++;
    this.callObservableAfterPagintion();
  }

  previuos(): void {
    this.startIndex--;
    this.callObservableAfterPagintion();
  }

  callObservableAfterPagintion(): void {
    let observable = this.employeesFiltersOperatorFunctions.length > 0 ?
      this.finalObservable : this.initialObservable;

    this.allSubscriptions.push(this.callCountObservable(observable));
  }

  getPagitionationOperatorFunction(): OperatorFunction<Object, any> {
    return map(employees => (employees as Array<Employee>)
      .slice(this.startIndex * this.size, ((this.startIndex + 1) * this.size)));

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

  bindingEvents(): void {
    this.elementRef.nativeElement.querySelector("#select").addEventListener("change",
      this.onChangeSize.bind(this));
    this.elementRef.nativeElement.querySelector("#filterDialog").addEventListener("click",
      this.filterDialog.bind(this));
    this.elementRef.nativeElement.querySelector("#openFiltersMenu").addEventListener("click",
      this.openFiltersMenu.bind(this));
  }

  moveTableSettingsSmallWidth(): void {
    let tableSettingsContent = document.getElementsByClassName("tableSettings")[0].children[0].innerHTML;

    if (tableSettingsContent == "")
      return;

    document.getElementsByClassName("generalSettings")[0].children[3].innerHTML = tableSettingsContent;
    document.getElementsByClassName("tableSettings")[0].children[0].innerHTML = "";

    this.bindingEvents();
    //document.getElementById("filterDialog").addEventListener("click", this.filterDialog);
    // document.getElementById("openFiltersMenu").addEventListener("click", this.openFiltersMenu);

  }

  moveTableSettingsBigWidth(): void {
    let tableSettingsContent = document.getElementsByClassName("generalSettings")[0].children[3].innerHTML;

    if (tableSettingsContent == "")
      return;

    document.getElementsByClassName("tableSettings")[0].children[0].innerHTML = tableSettingsContent;
    document.getElementsByClassName("generalSettings")[0].children[3].innerHTML = "";

    this.bindingEvents();

  }

  moveTableSettings(width): void {
    if (width < 650)
      this.moveTableSettingsSmallWidth();
    else
      this.moveTableSettingsBigWidth();
  }

  ngOnDestroy(): void {
    for (const subscribe of this.allSubscriptions) {
      subscribe.unsubscribe();
    }
  }
}


