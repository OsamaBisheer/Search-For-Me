import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  faCoffee, faHome, faDollarSign, faBook, faUser, faChartPie, faPlus, faDownload, faAngleDoubleLeft,
  faCog, faLink, faBars, faTimes, faCaretDown, faSearch, faAngleUp, faAngleDown, faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faLinkedinIn, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faQuestionCircle, faEdit } from '@fortawesome/free-regular-svg-icons';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  employees: Array<Employee>;
  private subscribe: Subscription;
  private countObservable: Observable<Object>;
  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    //this.employees = this.employeeService.getEmployees();
    this.countObservable = this.employeeService.getEmployeesUsingHttp()
      .pipe(map(employeesObject =>
        ((employeesObject as any)
          .data.employees as Array<Employee>)));

    this.countObservable.subscribe(employeesObject =>
      this.employees = (employeesObject as any)
        .data.employees as Array<Employee>);
  }


  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

}
