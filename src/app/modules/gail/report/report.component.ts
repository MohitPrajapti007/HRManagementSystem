import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MasterData } from '../../shared/objects/MasterData';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/_dialogs/alert-dialog/alert-dialog.component';
import { DataService } from 'src/app/services/data.service';
import { CustomDialogComponent } from 'src/app/_dialogs/custom-dialog/custom-dialog.component';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { EmployeeDetailDialogComponent } from 'src/app/_dialogs/employee-detail-dialog/employee-detail-dialog.component';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})


export class ReportComponent {
  displayedColumns = ['indicator', 'select','id', 'name', 'designation', 'department', 'discipline', 'directorate','functionGroup', 'grade', 'noOfYears', 
  'empStatus', 'employeeGroup', 'gender', 'birthDate', 'age','changeOfLocation','newDirectorate',
  'presentLocation','proposedLocation', 'Employee', 'transfer_comment','placementHistoryYears','newFunction', 'rks','dueForDPC2023','deputation',
  'secondment', 'sensitivePosition','fieldPostingTransferPromoted',
  'superannuatingby2025','quarterlySupby2025', 'mobilityConstraint', 'previousHL', 'tagName', 
  'wilTo4HL', 'willingnessChoice','oldTPCGroundstillexist','tpcPool2022','tpc','hlChoice1','hlChoice2','hlChoice3',
  'prsntGradeDt','handicap','supernDt', 'compulsoryTransferLocation', 'compulsoryTransferComments',
  'mobilityConstraintsFlag', 'mobilityConstraintsDetail', 'mobilityConstraintsComments',
  'eligible','proposedOptionId01','optionId01','optionId02','optionId03','actionFlag','actionComment','filterFlag'];
  dataSourceMaster:MasterData[] = [];
  dataSource:MasterData[] = [];
  tagNames:string[] = ['-- SELECT --'];
  selectedTagName:string ='';
  filterTypeValue:string='';
  dialogOpen=0;
  selectedFilterValue = 0;
  selectedEligibleValue = 0;
  totalElements = 0;
  pageSize = 100;
  pageNo = 0;
  analyticss=0;
  actionCheck=0;
  subscription: Subscription = new Subscription;
  counts:any = { filterCount: 0, actionCount: 0, filteredCount: 0, eligibiltyCount: 0, recommendedCount: 0} 
  searchName:string="";
  searchId:string="";
  isRecommended:boolean = false;
  constructor(private userService: UserService,private dialog: MatDialog, private dataService: DataService) {

  }
  ngOnInit() {


    
  }
  ngAfterViewInit() {
    
    this.subscription = this.dataService.currentMessage.subscribe((message:any) => {
      this.filterTypeValue=message.filterType;
      // console.log(this.filterTypeValue);
     // console.log("retrieved ", message); this.selectedEligibleValue = 0;
      if(message.filterType=="yearsFilter") {
        this.yearsFilter(message.value);
      } else if(message.filterType=="deptFilter") {
        this.depttFilter(message.value);
      }else if(message.filterType=="tagFilter") {
       this.selectedTagName = message.value;
       this.onTagChange();
      }
      else if(message.filterType=='toggleFilter') {
        this.selectedFilterValue = message.value;
        this.selectedEligibleValue = 0;
        this.isRecommended=false;
        this.actionCheck=0;
        this.analyticss=0;
        this.pageNo=0;
        this.getMasterData({ page: this.pageNo, size: this.pageSize, tagName: this.selectedTagName, filterData: this.selectedFilterValue});
     //   this.initLeftChart();
      } else if(message.filterType=='eligibleFilter') { 
        this.selectedFilterValue = 1;
        this.selectedEligibleValue = 1;
        this.isRecommended=false;
        this.actionCheck=0;
        this.analyticss=0;
        this.pageNo=0;
        this.getMasterData({ page: this.pageNo, size: this.pageSize, tagName: this.selectedTagName,filterData: this.selectedEligibleValue, eligiblityCheck: this.selectedEligibleValue});
      } 
      // else if(message.filterType=="popupFilter") {
      //   // this.depttFilter(message.value);
      //    let rules = message.value;
      //    this.openDialog(rules, this.selectedTagName);
      // }
       else if(message.filterType=="recommendFilter") {
        this.recommendChanges();
      } else if(message.filterType=="recommendListFilter") {
        this.selectedFilterValue = 0;
        this.selectedEligibleValue = 0;
        this.actionCheck=0;
        this.isRecommended=true;
        this.pageNo=0;
        this.analyticss=1;
          this.getMasterData({ page: this.pageNo, size: this.pageSize,tagName: this.selectedTagName,analytics:1});
      }
      //  else if(message.filterType=="searchFilter") {
      //   let rules = message.value;
      //   this.openDialog(rules, this.selectedTagName);
      // } 
      else if(message.filterType=="actionMarkedFilter") {
        this.selectedFilterValue = 0;
        this.selectedEligibleValue = 0;
        this.isRecommended=false;
        this.analyticss=0;
        this.actionCheck=1;
        this.pageNo=0;
          this.getMasterData({ page: this.pageNo, size: this.pageSize, tagName: this.selectedTagName, actionCheck: this.actionCheck});
      }
      else if(message.filterType=="actionFilter") {
        let rules = message.value;
        this.dialogOpen=this.dialogOpen+1;
        if(this.dialogOpen==1){
            this.openDialog(rules, this.selectedTagName);
          }
      } else if(message.filterType=="refreshAppliedActions") { 
        this.selection.clear();
        this.onActionChange(message.value);
      } else if(message.filterType=="refreshAppliedFilters") { 
        this.onFilterChange(message.value);
      }
      if(this.filterTypeValue=="refreshAppliedRules"){
        this.pageNo=0;
        this.getMasterData({ page: this.pageNo, size: this.pageSize, tagName: this.selectedTagName,filterData: 1, eligiblityCheck: 1});
        let filterValues = { filterType: "eligibleFilter", value: this.selectedTagName, eventType: "singleclick"};
        this.dataService.changeMessage(filterValues);
      }
    });
  }
  onTagChange() {
    this.counter = 0;
    if(this.repeatProcess)
      clearInterval(this.repeatProcess);
    this.getMasterData({ page: this.pageNo, size: this.pageSize, tagName: this.selectedTagName});
    this.showSelectedTagData();
    this.tpStateChange();
  }

  // Method called after user saves filters
  onFilterChange(value: any) {
    console.log('onFilterChange', value);
    this.counter = 0;
    if(this.repeatProcess)
      clearInterval(this.repeatProcess);
    let obj:any = { departmentFlag: (value.departmentIds.length>0?1:0),
      directorateFlag: (value.directorateIds.length>0?1:0),
      desciplineFlag: (value.disciplineIds.length>0?1:0),
      designationFlag: (value.designationIds.length>0?1:0),
      functionFlag: (value.functionIds.length>0?1:0),
      subfunctionFlag: (value.subFunctionIds.length>0?1:0),
      empstatusFlag: (value.empStatusIds.length>0?1:0),
      empgroupFlag: (value.empGroupIds.length>0?1:0),
      gradeFlag: (value.gradeIds.length>0?1:0),
      locationFlag: (value.locationIds.length>0?1:0),
      genderFlag: (value.genderIds.length>0?1:0)
    };
    console.log(obj);
    if(this.filterTypeValue=="refreshAppliedFilters"){
      this.pageNo=0;
      this.getMasterData(Object.assign({}, { page: this.pageNo, size: this.pageSize, tagName: this.selectedTagName, filterData: 1}, obj));
      
    }
    
    // this.showSelectedTagData();
   // this.tpStateChange();
  }

  onActionChange(value: any) {
    console.log('onActionChange', value);
    this.counter = 0;
    if(this.repeatProcess)
      clearInterval(this.repeatProcess);

    // this.showSelectedTagData();
   // this.tpStateChange();
  }

  ngOnDestroy() {
    if(this.selectedTagName && this.selectedTagName!="-- SELECT --") {
      let filterValues = { filterType: "tagFilter", value: this.selectedTagName, eventType: "singleclick"};
      this.dataService.changeMessage(filterValues);
    } else {
      this.dataService.changeMessage({});
    }    
    this.subscription.unsubscribe();
  }
  openEmployeeDetailDialog(rowData: any): void {
    const dialogRef = this.dialog.open(EmployeeDetailDialogComponent, {
      data: rowData
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Handle dialog closed event if needed
    });
  }

  getMasterData(data: any) {
    this.counts = { filterCount: 0, actionCount: 0, filteredCount: 0, eligibiltyCount: 0, allEligibilityCount: 0, recommendedCount: 0} ;
    this.userService.getMasterData(data).subscribe({
      error: (err:any)=>{
        console.log('error ', err);
      },
      next: (result:any)=>{
        //console.log('result ', result);
        this.dataSource = result.data.content;
        this.totalElements = result.data.totalElements;
      //  this.dataSourceMaster = result.data.content;
       // this.showSelectedTagData('-- SELECT --');
      }
    });
    this.userService.countMasterdata({filterCheck: 1, actionCheck: 1, eligiblityCheck: 1,analytics:1, tagName: this.selectedTagName}).subscribe({
      next: (result: any)=>{
        this.counts.filterCount = result.data.filterCount;
        this.counts.actionCount = result.data.actionCount;
        this.counts.filteredCount = result.data.filteredCount;
        this.counts.eligibiltyCount = result.data.eligibiltyCount;
        this.counts.allEligibilityCount = result.data.allEligibilityCount;
        this.counts.recommendedCount = result.data.recommendCount;
      }
    })
  }
  onPageChange(event: any) {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getMasterData({ page: this.pageNo, size: this.pageSize, tagName: this.selectedTagName,eligiblityCheck: this.selectedEligibleValue, filterData: this.selectedFilterValue, actionCheck: this.actionCheck, analytics: (this.isRecommended?1:0)});
  }
  public yearsFilter(years:number):void {
    console.log(`Filtering data for No > ${years}`);
    // this.dataSource = this.dataSourceMaster.filter(d => Number(d.noOfYears) > years); //.sort((a,b)=>Number(b.noOfYears)-Number(a.noOfYears));
    this.dataSource.forEach(d => {
      if (Number(d.noOfYears) > years) {
        d.highlighted = true;
      }
    });
    // this.dataSource = this.dataSource.concat(this.dataSourceMaster.filter(d => Number(d.noOfYears) <= years));
  }

  public depttFilter(name:string):void{
    console.log(`Filtering data for name > ${name}`);
    this.dataSource.forEach(d => {
      if (d.department === name) {
        d.highlighted = true;
      }
    });
  }

  showSelectedTagData() {
    this.dataSource = this.dataSourceMaster.filter(d => d.tagName === this.selectedTagName);
  }

  public recommendChanges() {
    console.log(`Recommending changes for selected tagname >> ${this.selectedTagName}`);
    let inputParams = { tagName: this.selectedTagName };
    this.userService.getRecommendedChanges(inputParams).subscribe({
      error: (err:any)=>{
        console.log('error ', err);
      },
      next: (result:any)=>{
        //console.log('result ', result);
        // this.isLoading = false;
        // if (result.data !== undefined && result.data.size > 0) {
        //   this.dataSource = result.data;
        // }
        
      }
    });
    let filterValues = { filterType: "tpStateChangeFilter", value: this.selectedTagName, eventType: "singleclick"};
    this.dataService.changeMessage(filterValues);
  }
  tpStatus: string = "";
  repeatProcess:any;
  counter =0 ;
  tpStateChange() {   
    if(this.selectedTagName=="-- SELECT --") return;
    let inputParams = { tagName: this.selectedTagName };
    
    this.repeatProcess =  setInterval(() => {
      if(this.counter>=10){
        clearInterval(this.repeatProcess);
        this.counter = 0;
      }
      if(this.tpStatus != "Completed" && this.tpStatus != "Error") {
        this.counter=this.counter+1;
        this.userService.getTPState(inputParams).subscribe({
          error: (err:any)=>{
            console.log('error ', err);
          },
          next: (result:any)=>{
         //   console.log('tpresult ', result);
            let mdd = result.data;
            if(mdd && mdd.tpstate) {
              switch(mdd.tpstate) {
                case 1: 
                  this.tpStatus = "Started";
                  break;
                  case 4: 
                  this.tpStatus = "Finding Options";
                  break;
                  case 5: 
                  this.tpStatus = "Writing to DB";
                  break;
                  case 10: 
                  this.tpStatus = "Completed";
                  break;
                  case -1: 
                  this.tpStatus = "Error";
                  break;
              }
            } else {
              this.tpStatus = "Completed";
            }
    
          }
        });
      }      
    }, 500);

      
  }
  
  public openDialog(data: any, tagName: string):void{    
    let dialogRef = this.dialog.open(CustomDialogComponent, {
      disableClose: true,
      autoFocus: true,
      data : {
        tagName: tagName, subdata: data,
      },
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogOpen=0;
    });
  }
  selection = new SelectionModel<any>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    
    row.highlighted = this.selection.isSelected(row);
    let filterValues = { filterType: "checkBoxFilter", value: {subject: 'action', selectedValues: this.selection.selected }, eventType: "dblclick"};
    this.dataService.changeMessage(filterValues);
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  onSearchData() {
    this.getMasterData({ page: this.pageNo, size: this.pageSize, tagName: this.selectedTagName, name: this.searchName,id:this.searchId,eligiblityCheck: this.selectedEligibleValue,actionCheck: this.actionCheck,filterData: this.selectedFilterValue,analytics:this.analyticss});
    console.log(this.searchName);
  }
  inputFields:any = {'name': 0};
  toggleInputFields(inputName: string) {
    this.inputFields[inputName] = !this.inputFields[inputName];
  }

  onPreDelete(id: number, tagName:string, actionName:string) {
    console.log(id, tagName);
    this.userService.deleteActions(id, tagName, actionName).subscribe({
      next: (result:any)=>{
        if(result.code==200) {
          // this.getMasterData({ page: this.pageNo, size: this.pageSize, tagName: this.selectedTagName, name: this.searchName});
          this.getMasterData({ page: this.pageNo, size: this.pageSize, tagName: this.selectedTagName, actionCheck: 1});
          this.userService.openSnackBar("Action "+actionName+ " has been removed.");
        }
      }
    })
  }
  downloadExcelByTableClass(tableClass:string, fileName:string) {
    let element = document.getElementsByClassName(tableClass)[0];
    this.userService.exportexcel(element, fileName);
  }
}