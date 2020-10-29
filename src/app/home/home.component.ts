import { Component, OnInit } from '@angular/core';
import {
  faCoffee, faHome, faDollarSign, faBook, faUser, faChartPie, faPlus, faDownload, faAngleDoubleLeft,
  faCog, faLink, faBars, faTimes, faCaretDown, faSearch, faAngleUp, faAngleDown, faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faLinkedinIn, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faQuestionCircle, faEdit } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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

  constructor() { }

  ngOnInit(): void {
  }

}
