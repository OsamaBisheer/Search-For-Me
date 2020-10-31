import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Filter } from "../../../models/filter";

@Component({
  selector: 'app-dialog-filter',
  templateUrl: './dialog-filter.component.html',
  styleUrls: ['./dialog-filter.component.css']
})
export class DialogFilterComponent implements OnInit {

  filterTypes: Array<string>;

  filterConditions: Array<string>;

  filter: Filter;

  constructor(
    public dialogRef: MatDialogRef<DialogFilterComponent>) { }

  ngOnInit(): void {
    this.filterTypes = ["Name", "Salary", "Date"];

    this.filterConditions = ["Before", "After", "Between"];

    this.filter = new Filter();

    this.filter.filterType = "Name";

    this.filter.filterCondition = "Before";

  }

}
