import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

import * as echarts from 'echarts';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { CustomDialogComponent } from 'src/app/_dialogs/custom-dialog/custom-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  dialogOpen=0;
  displayedColumns = ['id', 'name', 'designation', 'department'];
  dataSource:any = [];
  vchart:any;
  vchart2:any;
  piechart:any;
  piechart2:any;
  showAll:boolean=true;
  locationChart:any;
  subscription: Subscription = new Subscription;
  derivedDisplayedColumns = ['id', 'name', 'designation', 'department'];
  constructor(private userService: UserService, private dataService: DataService, private dialog: MatDialog,) {
   
  }

  isRecommended = false;
  ngOnInit() {
    
  }

  ngAfterViewInit() {
     /*
    if(this.selectedTagName=="" || this.selectedTagName=="-- SELECT --") {
      this.userService.openSnackBar("Please pick a file.");
    }
    */
    this.subscription = this.dataService.currentMessage.subscribe((message:any) => {
      this.isRecommended = false;
      if(message.filterType=="tagFilter") {
        this.resetCountObject();
        this.selectedTagName = message.value;
       // this.userService.openSnackBar("Please pick a file.");
       if(this.selectedTagName=="" || this.selectedTagName=="-- SELECT --") {
          this.userService.openSnackBar("Please pick a file.");
       }
        this.getAlldata({  tagName: this.selectedTagName, filterData: this.selectedFilterValue });
      } else if(message.filterType=='toggleFilter') {
        this.clearSearch();
        this.selectedFilterValue = message.value||1;
        this.getAlldata({  tagName: this.selectedTagName, filterData: this.selectedFilterValue});
      } else if(message.filterType=='eligibleFilter') {
        this.clearSearch();
        this.selectedEligibleValue = message.value;
        this.getAlldata({  tagName: this.selectedTagName, filterData: 1, eligiblityCheck: 1});
      }else if(message.filterType=="recommendListFilter") {
        this.selectedEligibleValue = message.value;
        this.getAlldata({ tagName: this.selectedTagName,analytics:1});
      }
      else if(message.filterType=="actionMarkedFilter") {
        this.selectedEligibleValue = message.value;
        this.getAlldata({ tagName: this.selectedTagName, actionCheck: 1});
      }
      else if(message.filterType=="actionFilter") {
        let rules = message.value;
        this.dialogOpen=this.dialogOpen+1;
        if(this.dialogOpen==1){
            this.openDialog(rules, this.selectedTagName);
          }
      } else if(message.filterType=='refreshAppliedFilters') {
        this.selectedFilterValue = 1;
        this.getAlldata({ tagName: this.selectedTagName, filterData: this.selectedFilterValue});
      } 
      else if(message.filterType=='refreshAppliedRules') {
        this.selectedRuleValue = 1;
        this.getAlldata({  tagName: this.selectedTagName, filterData: this.selectedRuleValue, eligiblityCheck: this.selectedRuleValue});
        let filterValues = { filterType: "eligibleFilter", value: this.selectedTagName, eventType: "singleclick"};
        this.dataService.changeMessage(filterValues);
      } 
    });
    
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
  getAlldata(data: any) {
    this.dataSource = [];
    this.userService.getMasterData(data).subscribe({
      error: (err:any)=>{
        console.log('error ', err);
      },
      next: (result:any)=>{
        this.dataSource = result.data.content;  
        this.calculateLeftFooterDataAfterTagChaged();      
      }
    });
  }
  
  clearSearch() {
    this.searchKeyModel = '';
    this.searchIdModel = '';
    this.onMatTabChange(this.selectedTabEvent);
  }
  selectedTagName: string = "";
  selectedFilterValue = 0;
  selectedRuleValue = 0;
  selectedEligibleValue = 0;
  filterData:any = [];
  nweFilterData:any =[];
  tableObj:any = {table1SelectedItem: "",table1SelectedItems: [] ,table1totalcount: 0, table1count: 0 , table1data: [],table1willingChoice: 0,table1mobilityConstraint: {blank:0, yes:0},table1gender: {male:0, female:0}, table1gradecount:{e0toe3:0,e4toe6:0,e7toe9:0}, table1empstatus: {executive:0,nonexecutive:0}, table2SelectedItem: "",table2SelectedItems:[],table2totalcount: 0 ,table2count: 0 , table2data: [],table2willingChoice: 0,table2mobilityConstraint: {blank:0, yes:0},table2gender: {male:0, female:0}, table2gradecount:{e0toe3:0,e4toe6:0,e7toe9:0}, table2empstatus: {executive:0,nonexecutive:0}, table3SelectedItem: "" ,table3totalcount: 0,table3count: 0 , table3data: [],table3willingChoice: 0,table3mobilityConstraint: {blank:0, yes:0},table3gender: {male:0, female:0}, table3gradecount:{e0toe3:0,e4toe6:0,e7toe9:0}, table3empstatus: {executive:0,nonexecutive:0}};
  calculateLeftFooterDataAfterTagChaged() {
    this.filterData = [];
    let filterMap:any = {};
    this.table1data = [];
    let totalCount = 0;
    let tbl1totalWillingChoice = 0;
    let tabl1mobilityConstraint = {blank:0, yes:0};
    let tbl1gender = {male:0, female:0};
    let table1gradecount={e0toe3:0,e4toe6:0,e7toe9:0};
    let table1empstatus= {executive:0,nonexecutive:0};
    this.dataSource.forEach((item:any)=>{
      if((this.allFilter.gender=="All" || this.allFilter.gender==item.gender)  && 
      (this.allFilter.employeestatus=="All" || this.allFilter.employeestatus==item.empStatus) &&
      (this.allFilter.mobilityConstraint=="All" || this.allFilter.mobilityConstraint==item.mobilityConstraint) &&
      (this.allFilter.sensitivePosition=="All" || this.allFilter.sensitivePosition==item.sensitivePosition)) {

        if((this.isRecommended && item.proposedLocation) || !this.isRecommended){
          this.filterData.push(Object.assign(item, {count: 1}));
          let obj = filterMap[item.directorate];
          if(obj) {
            obj.count =  obj.count+1;
            obj.children.push(item);
          } else {
            obj = { directorate: item.directorate, count: 1, children: [item] }
          }
          /*
          if(item.willingnessChoice!="") tbl1totalWillingChoice=tbl1totalWillingChoice+1;
          if(item.mobilityConstraint=="") 
            tabl1mobilityConstraint.blank=tabl1mobilityConstraint.blank+1;
          else
            tabl1mobilityConstraint.yes=tabl1mobilityConstraint.yes+1;
            */
           if(item.grade=='E0'||item.grade=='E1'||item.grade=='E2'||item.grade=='E3') {
              table1gradecount.e0toe3 = table1gradecount.e0toe3 + 1;
           }
           if(item.grade=='E4'||item.grade=='E5'||item.grade=='E6') {
            table1gradecount.e4toe6 = table1gradecount.e4toe6 + 1;
          }
          if(item.grade=='E7'||item.grade=='E8'||item.grade=='E9') {
            table1gradecount.e7toe9 = table1gradecount.e7toe9 + 1;
          }
          if(item.empStatus=="Non Executive") {
            table1empstatus.nonexecutive=table1empstatus.nonexecutive+1;
          } else if(item.empStatus=="Executive") {
             table1empstatus.executive=table1empstatus.executive+1;
          }
          if(item.gender=="Male") 
            tbl1gender.male=tbl1gender.male+1;
          else
            tbl1gender.female=tbl1gender.female+1;
          filterMap[item.directorate] = obj;
          totalCount++;
        }
          
      }          
    });
    for (let [key, value] of Object.entries(filterMap)) {        
      this.table1data.push(value);
    }
    //let selectedDirectorate = this.table1data[0].directorate;
    //console.log('table1empstatus',table1empstatus)
    Object.assign(this.tableObj, { 
      table1SelectedItem: "",table1SelectedItems: [...new Array(totalCount)].map(()=>'') , table1totalcount: totalCount, table1count: totalCount , table1data: this.table1data,
      table1willingChoice: tbl1totalWillingChoice,
      table1mobilityConstraint: tabl1mobilityConstraint,
      table1gender: tbl1gender,
      table1empstatus: table1empstatus,
      table1gradecount: table1gradecount,

      table2count: 0,
      table2SelectedItem: "",table2SelectedItems: [...new Array(totalCount)].map(()=>''),
      table2willingChoice: 0,
      table2mobilityConstraint: {blank:0, yes:0},
      table2empstatus:{executive:0,nonexecutive:0},
      table2gender: {male:0, female:0},
      table2gradecount: {e0toe3:0,e4toe6:0,e7toe9:0},

      table3count: 0,
      table3SelectedItem: "",
      table3willingChoice: 0,
      table3mobilityConstraint: {blank:0, yes:0},
      table3empstatus:{executive:0,nonexecutive:0},
      table3gender: {male:0, female:0},
      table3gradecount: {e0toe3:0,e4toe6:0,e7toe9:0},
    });
    //console.log('new filterdata', this.nweFilterData);
    if(this.tableObj.table1data.length==0){
      this.tableObj.table2data=[];
      this.tableObj.table3data=[];
    }else{
    this.onTable1RowClick(this.tableObj.table1data[0], true);
   // this.tableObj.table2SelectedItem = this.tableObj.table2data[0][this.selectedControl];
    this.onTable2RowClick(this.tableObj.table2data[0], true);
    this.countObject.totalEmployee = this.filterData.length;
    }
  }
  // showAllExecuted=false;
  calculateLeftFooterDataAfterTagChaged2() {
    this.filterData = [];
    // this.filterData = [];
    // let filterMap:any = {};
    this.table2data = [];
    let totalCount = 0;
    let tempvar=true;
    // this.calledFromShowAll2=true;
    Object.assign(this.tableObj, { 
      table2SelectedItem: "",table2SelectedItems: [...new Array(totalCount)].map(()=>''),
      table2willingChoice: 0,
      table2mobilityConstraint: {blank:0, yes:0},
      table2gender: {male:0, female:0},

      table3SelectedItem: "",
      table3willingChoice: 0,
      table3mobilityConstraint: {blank:0, yes:0},
      table3gender: {male:0, female:0},
    });
    this.onTable2RowClick(this.tableObj.table2data[0], true);
    this.tableObj.table1SelectedItems.forEach((item:any,index:number) => {
      let itemIndex=this.tableObj.table1data.findIndex((d:any)=>d.directorate==item);
      if(itemIndex>=0){
        this.onTable1RowClick(this.tableObj.table1data[itemIndex],false,itemIndex);
        tempvar=false;
      }
    });
    if(tempvar){
      this.calculateLeftFooterDataAfterTagChaged();
    }
    
  }
  
  prevSelectedTileElement:any = null;
  table1data:any = [];
  table2data:any = [];
  table3data:any = [];
  
  selectedLocationTile:string="All";
  

  public openDialog(data: any, tagName: string):void{    
    let dialogRef = this.dialog.open(CustomDialogComponent, {
      disableClose: true,
      autoFocus: true,
      data : {
        tagName: tagName, subdata: data,
      },
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('The dialog was closed');
      this.dialogOpen=0
    });
  }
  public recommendChanges() {
    console.log(`Recommending changes for selected tagname >> ${this.selectedTagName}`);
    this.isRecommended = true;
  }
  counts = { filterCount: 0, actionCount: 0, eligibiltyCount: 0} ;
  onFilterChange(value: any) {
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

    this.getMasterData(Object.assign({}, { tagName: this.selectedTagName, filterData: 1}, obj));
    this.counts = { filterCount: 0, actionCount: 0, eligibiltyCount: 0} ;
    this.userService.countMasterdata({filterCheck: 1, actionCheck: 1, eligiblityCheck: 1,tagName: this.selectedTagName}).subscribe({
      next: (result: any)=>{
        this.counts.filterCount = result.data.filterCount;
        this.counts.actionCount = result.data.actionCount;
        this.counts.eligibiltyCount = result.data.eligibiltyCount;
      }
    })
    // this.showSelectedTagData();
   // this.tpStateChange();
  }
  totalElements = 0;
  getMasterData(data: any) {
    this.userService.getMasterData(data).subscribe({
      error: (err:any)=>{
        console.log('error ', err);
      },
      next: (result:any)=>{
        if(data.size) {
          this.dataSource = result.data.content;
          this.totalElements = result.data.totalElements;
        } else {
          this.dataSource = result.data;
          this.totalElements = result.data.length;
        }

      }
    });
  }


  setCountData(data:any) {
    const countMobilityConstraint = data.filter((obj:any) => obj.mobilityConstraint !== "").length;
    const countGender = data.filter((obj:any) => obj.gender !== "").length;
    const countMaleGender = data.filter((obj:any) => obj.gender !== "Male").length;
    const countFemaleGender = data.filter((obj:any) => obj.gender !== "Female").length;

    const countEmpStatus = data.filter((obj:any) => obj.empStatus !== "").length;
    const countGrade = data.filter((obj:any) => obj.grade !== "").length;
    const countWillingChoice = data.filter((obj:any) => obj.mobilityConstraint !== "").length;
    const countHardLocation = data.filter((obj:any) => obj.hlChoice1 !== "").length;
    const countTpc = data.filter((obj:any) => obj.tpc !== "").length;
    this.countObject.willingChoice = countWillingChoice;
    this.countObject.mobilityConstraint = countMobilityConstraint;
    this.countObject.gender = countGender;
    this.countObject.grade = countGrade;
    this.countObject.hardLocation = countHardLocation;
    this.countObject.tpc = countTpc;
  }
  countObject = {totalEmployee:0, willingChoice:0 ,mobilityConstraint: {total:0, blank:0, yes:0}, sensitivePosition:{total:0, blank:0, yes:0}, gender: 0,maleGender:0,femaleGender:0, empStatus: {total:0,nonExecutive:0,executive:0}, grade: 0, hardLocation: 0, tpc:0};
  resetCountObject() {
    this.countObject = {totalEmployee:0, willingChoice:0 ,mobilityConstraint: {total:0, blank:0, yes:0}, sensitivePosition:{total:0, blank:0, yes:0}, gender: 0,maleGender:0,femaleGender:0, empStatus: {total:0,nonExecutive:0,executive:0}, grade: 0, hardLocation: 0, tpc:0};
  }


  subData:any = [];
  selectedDirectorate = "";
  subChartCountObject = {totalEmployee:0, willingChoice:0 ,mobilityConstraint: {total:0, blank:0, yes:0}, sensitivePosition:{total:0, blank:0, yes:0}, gender: 0,maleGender:0,femaleGender:0, empStatus: {total:0,nonExecutive:0,executive:0}, grade: 0, hardLocation: 0, tpc:0};
  resetSubChartCountObject() {
    this.subChartCountObject = {totalEmployee:0, willingChoice:0 ,mobilityConstraint: {total:0, blank:0, yes:0}, sensitivePosition:{total:0, blank:0, yes:0}, gender: 0,maleGender:0,femaleGender:0, empStatus: {total:0,nonExecutive:0,executive:0}, grade: 0, hardLocation: 0, tpc:0};
  }
  lastSelectedTileData:any=[];


 rightSelectedTile:string="";

//selectedLocationTile:string="";
locationChartCountObject = {totalEmployee:0, willingChoice:0 ,mobilityConstraint: {total:0, blank:0, yes:0}, sensitivePosition:{total:0, blank:0, yes:0}, gender: 0,maleGender:0,femaleGender:0, empStatus: {total:0,nonExecutive:0,executive:0}, grade: 0, hardLocation: 0, tpc:0};
resetLocationChartCountObject() {
  this.locationChartCountObject = {totalEmployee:0, willingChoice:0 ,mobilityConstraint: {total:0, blank:0, yes:0}, sensitivePosition:{total:0, blank:0, yes:0}, gender: 0,maleGender:0,femaleGender:0, empStatus: {total:0,nonExecutive:0,executive:0}, grade: 0, hardLocation: 0, tpc:0};
}


GenderFilter:any="All";
ESFilter:any="All";
McFilter:any="All";
SPFilter:any="All";

 allFilter:any = {gender: "All", employeestatus:"All", mobilityConstraint:"All",sensitivePosition:"All"};
 selectedDirectorate2:any='';
 onToggleValChange(event: any, type:string) {

  if(type == 'mobilityConstraint') {    
    this.McFilter=event.value;
    this.allFilter.mobilityConstraint = event.value;
  } 
  if(type == 'gender') {
    this.GenderFilter=event.value;
    this.allFilter.gender = event.value;
  }
  // mobilityConstraint
  if(type == 'employeestatus') {
    this.ESFilter=event.value;
    this.allFilter.employeestatus = event.value;
  }
  if(type == 'mobilityConstraint') {
    this.McFilter=event.value;
    this.allFilter.mobilityConstraint = event.value;
  }
  if(type=='sensitivePosition'){
    this.SPFilter=event.value;
    this.allFilter.sensitivePosition = event.value;
  }
  this.calculateLeftFooterDataAfterTagChaged();
 }
 changedValue=""
 selectedControl="presentLocation"
 selectedControl2="department"
 selectedLocationControl="";
 onSelectionChange1(event:any) {
  
    this.changedValue = `${event.target.value}`;
   if(this.tableObj.table1count>0){
    this.onTable1RowClick(this.tableObj.table1data[0],this.showAll);
     this.tableObj.table2SelectedItem = this.tableObj.table2data[0][this.changedValue];
     this.onTable2RowClick(this.tableObj.table2data[0],this.showAll);
   }
 }
 changedValue2="department"
 onSelectionChange2(event:any) {
  this.changedValue2 = `${event.target.value}`;
  if(this.tableObj.table1count>0){
    this.onTable1RowClick(this.tableObj.table1data[0],this.showAll);
     this.tableObj.table2SelectedItem = this.tableObj.table2data[0][this.changedValue2];
     this.onTable2RowClick(this.tableObj.table2data[0],this.showAll);
   }
}
 selectedDirectorateModel:boolean=false;

 selectedTileModel:boolean=false;
 
 selectedTabEvent = {index:0};
 searchKeyModel:string = "";
 searchIdModel:string = "";
 tableData:any=[];
 searchedData:any=[];
 onMatTabChange(event: any) {
  this.selectedTabEvent = event;
  if (event.index == 0) {
    this.tableData = this.subData.filter((sd: any) => {
      return (
        sd.name.toLowerCase().indexOf(this.searchKeyModel.toLowerCase()) > -1 &&
        sd.id.toString().indexOf(this.searchIdModel.toString()) > -1
      );
    });
  } else if (event.index == 1) {
    this.searchedData = this.dataSource.filter((sd: any) => {
      return (
        sd.name.toLowerCase().indexOf(this.searchKeyModel.toLowerCase()) > -1 &&
        sd.id.toString().indexOf(this.searchIdModel.toString()) > -1
      );
    });
  }
}

 selectedPlacementHistorydata:any={};
 formattedChartData: any[] = [];
 selectedIndex:any="";
  onTableRowClick(data: any,index:number) {
    this.selectedIndex=index;
    this.formattedChartData = [];
    this.selectedPlacementHistorydata = {};
    if(!this.isEmpty(data)) {
      this.selectedPlacementHistorydata = data;
      if(data.children){
        this.selectedPlacementHistorydata = data.children[0];
        }
      if(!this.selectedPlacementHistorydata.placementHistoryYears){
        this.selectedPlacementHistorydata=this.filterData[0];
      }
      const placementHistoryString = this.selectedPlacementHistorydata.placementHistoryYears;
      this.formattedChartData =this.formatPlacementHistoryData(placementHistoryString);
      if(this.selectedPlacementHistorydata.eligible==1 && this.selectedPlacementHistorydata.actionFlag === true && this.selectedPlacementHistorydata.filterFlag== true && this.selectedPlacementHistorydata.proposedLocation==null) {
        this.selectedPlacementHistorydata.proposedLocation="NO SUITABLE MATCH FOUND";
      }
      if( this.selectedPlacementHistorydata.actionValue=== "Ignore") {
        this.selectedPlacementHistorydata.proposedLocation="NOT IN RECOMMENDED LIST";
      }
      if( this.selectedPlacementHistorydata.proposedLocation== null) {
        this.selectedPlacementHistorydata.proposedLocation="NOT IN RECOMMENDED LIST";
      }
    }
    this.EmployeeChart();
  }
  isEmpty(obj:any) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
  }
  
  formatPlacementHistoryData(placementHistoryString: string): any {
    var i=0;
    if(!placementHistoryString){ return [];}
    const historyItems = placementHistoryString.split(', ');
    const formattedData: any[] = [];
    // formattedData.push(['score','years','location']);
    historyItems.forEach(item => {
      const [location, value] = item.split(' (');
      const numericValue = parseFloat(value.replace(')', ''));
      formattedData.push([numericValue, numericValue, location+" "+i]);
      i++;
    });
    console.log("formattedData:"+formattedData);
    let header = ['score', 'years', 'location'];

    // Reverse the formattedData array
    let reversedData = [header, ...formattedData.reverse()];
    console.log(reversedData);
    return reversedData;
  }
  
  @ViewChild('chart', { static: true }) chart!: ElementRef;
  
  EmployeeChart() {
    const chartDom = document.getElementById('productChart');
    const myChart = echarts.init(chartDom);

    const option:any = {
      dataset: {
        source:this.formattedChartData
      },
      grid: { containLabel: true },
      xAxis: { name: 'years' },
      yAxis: { type: 'category' },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: 0,
        max: 20,
        text: ['High Score', 'Low Score'],
        dimension: 0,
        inRange: {
          color: ['#65B581', '#FFCE34', '#FD665F']
        }
      },
      series: [
        {
          type: 'bar',
          encode: {
            x: 'years',
            y: 'location'
          },
          label: {
            show: true,
            position: 'inside',
            formatter: (data:any)=>{
                return data.data[1];
            }
          },
        }
      ]
    };

    myChart.setOption(option, true);
  }
  counter(i: number, factor?: number) {
    if(factor) {
      let f = Math.trunc(i/factor);
      return new Array(f);
    }
    return new Array(i);
  }
  calledFromShowAll2=true;
  DirectorateFilter:any="All"
  directorateMap = new Map();
  table2Map = new Map();
  onTable1RowClick(data:any, showAll?:boolean, selectedIndex?:number) {
    //selectedControl
    console.log('data',data);
    this.DirectorateFilter=data.directorate;
    this.table2data = [];
    this.table3data = [];
    let childData = [];
    let map:any = {};
    let maptable2:any={};
    let mapTable3 = {};
    let totalCount = 0;
    let tbl2totalWillingChoice = 0;
    let tbl2mobilityConstraint = {blank:0, yes:0};
    let tbl2gender = {male:0, female:0};
    let table2gradecount={e0toe3:0,e4toe6:0,e7toe9:0};
    let table2empstatus= {executive:0,nonexecutive:0};
    let tbl3totalWillingChoice = 0;
    let tbl3mobilityConstraint = {blank:0, yes:0};
    let tbl3gender = {male:0, female:0};
    let table3gradecount={e0toe3:0,e4toe6:0,e7toe9:0};
    let table3empstatus= {executive:0,nonexecutive:0};
    if(data) {
      if(showAll) {
        childData = this.filterData; this.tableObj.table1SelectedItem = "";
        this.directorateMap = new Map();
      } else {
        
        this.tableObj.table1SelectedItem = data.directorate;
        if(selectedIndex !== undefined && selectedIndex >= 0) {
          if((this.calledFromShowAll2) && this.tableObj.table1SelectedItems[selectedIndex]==data.directorate ) {
            this.tableObj.table1SelectedItems[selectedIndex] = '';
            this.directorateMap.delete(data.directorate);
          } else {
            this.tableObj.table1SelectedItems[selectedIndex]=data.directorate;
            this.directorateMap.set(data.directorate, data.children);
          }
        } else {
          this.directorateMap = new Map();
         // childData = data.children;
          this.directorateMap.set(data.directorate, data.children);
          
        }
        console.log('1o',this.tableObj.table1SelectedItems)
/*
        for(let x=0;x<this.tableObj.table1SelectedItems.length;x++) {
          if(selectedIndex && this.tableObj.table1SelectedItems[selectedIndex]==data.directorate) {
            this.tableObj.table1SelectedItems[x] = '';
          } else {

          }
        }*/
        //this.tableObj.table1SelectedItems.push(data.directorate);
      }
      this.directorateMap.forEach((item:any, key:any, mapObj:any)=> {
        //console.log(key.toString(), ":"," ", item);
        childData.push(...item);
      });
      
      childData.forEach((item:any, index: number)=>{      
        let obj = map[item[this.selectedControl]];
        if(obj) {
          obj.count = obj.count+1;
          obj.children.push(item);
        } else {
          obj = { [this.selectedControl]: item[this.selectedControl], count:1, children:[item] };
        }
        /*
        if(item.willingnessChoice!="") tbl2totalWillingChoice=tbl2totalWillingChoice+1;
        if(item.mobilityConstraint=="") 
          tbl2mobilityConstraint.blank=tbl2mobilityConstraint.blank+1;
        else
          tbl2mobilityConstraint.yes=tbl2mobilityConstraint.yes+1;
          */
        if(item.grade=='E0'||item.grade=='E1'||item.grade=='E2'||item.grade=='E3') {
            table2gradecount.e0toe3 = table2gradecount.e0toe3 + 1;
         }
         if(item.grade=='E4'||item.grade=='E5'||item.grade=='E6') {
          table2gradecount.e4toe6 = table2gradecount.e4toe6 + 1;
        }
        if(item.grade=='E7'||item.grade=='E8'||item.grade=='E9') {
          table2gradecount.e7toe9 = table2gradecount.e7toe9 + 1;
        }
        if(item.empStatus=="Non Executive") {
          table2empstatus.nonexecutive=table2empstatus.nonexecutive+1;
        } else if(item.empStatus=="Executive") {
           table2empstatus.executive=table2empstatus.executive+1;
        }
        if(item.gender=="Male") 
          tbl2gender.male=tbl2gender.male+1;
        else
          tbl2gender.female=tbl2gender.female+1;
        map[item[this.selectedControl]] = obj;
        totalCount++;
      });
      for (let [key, value] of Object.entries(map)) {        
        this.table2data.push(value);
      }
      this.tableObj.table2totalcount = data.count||0;
      

      childData.forEach((item:any, index: number)=>{      
        let obj2 = maptable2[item[this.changedValue2]];
        if(obj2) {
          obj2.count = obj2.count+1;
          obj2.children.push(item);
        } else {
          obj2 = { [this.changedValue2]: item[this.changedValue2], count:1, children:[item] };
        }
        /*
        if(item.willingnessChoice!="") tbl2totalWillingChoice=tbl2totalWillingChoice+1;
        if(item.mobilityConstraint=="") 
          tbl2mobilityConstraint.blank=tbl2mobilityConstraint.blank+1;
        else
          tbl2mobilityConstraint.yes=tbl2mobilityConstraint.yes+1;
          */
        if(item.grade=='E0'||item.grade=='E1'||item.grade=='E2'||item.grade=='E3') {
            table3gradecount.e0toe3 = table3gradecount.e0toe3 + 1;
         }
         if(item.grade=='E4'||item.grade=='E5'||item.grade=='E6') {
          table3gradecount.e4toe6 = table3gradecount.e4toe6 + 1;
        }
        if(item.grade=='E7'||item.grade=='E8'||item.grade=='E9') {
          table3gradecount.e7toe9 = table3gradecount.e7toe9 + 1;
        }
        if(item.empStatus=="Non Executive") {
          table3empstatus.nonexecutive=table3empstatus.nonexecutive+1;
        } else if(item.empStatus=="Executive") {
           table3empstatus.executive=table3empstatus.executive+1;
        }
        if(item.gender=="Male") 
          tbl3gender.male=tbl3gender.male+1;
        else
          tbl3gender.female=tbl3gender.female+1;
        maptable2[item[this.changedValue2]] = obj2;
      });
      for (let [key, value] of Object.entries(maptable2)) {        
        this.table3data.push(value);
      }
      this.tableObj.table3totalcount = data.count||0;
      
    }


    this.tableObj.table1count = totalCount;
    this.tableObj.table1willingChoice = tbl2totalWillingChoice;
    this.tableObj.table1mobilityConstraint = tbl2mobilityConstraint;
    this.tableObj.table1gender = tbl2gender;
    this.tableObj.table1gradecount = table2gradecount;
    this.tableObj.table1empstatus = table2empstatus;

    this.tableObj.table2count = totalCount;
    this.tableObj.table2data = this.table2data;
    console.log("Table 2: ",this.tableObj.table2data );
    this.tableObj.table2willingChoice = tbl2totalWillingChoice;
    this.tableObj.table2mobilityConstraint = tbl2mobilityConstraint;
    this.tableObj.table2gender = tbl2gender;
    this.tableObj.table2gradecount = table2gradecount;
    this.tableObj.table2empstatus = table2empstatus;
    
    this.tableObj.table3count = totalCount; 
    this.tableObj.table3data = this.table3data;
    // console.log("Table 3:",this.tableObj.table3data);
    this.tableObj.table3willingChoice = tbl3totalWillingChoice;
    this.tableObj.table3mobilityConstraint = tbl3mobilityConstraint;
    this.tableObj.table3gender = tbl3gender;
    this.tableObj.table3gradecount = table3gradecount;
    this.tableObj.table3empstatus = table3empstatus;
    if(totalCount>0){
      this.tableObj.table2SelectedItem = "";//this.tableObj.table2data[0][this.selectedControl];
      // this.onTable2RowClick(this.tableObj.table2data[0], showAll);
    }
    
  }
  DepartmentFilter:any="All";
  onTable2RowClick(data:any, showAll?:boolean,selectedIndex?:number) {
    this.DepartmentFilter=data.department;
    this.table3data = [];
    this.subData = [];
    let map:any = {};
    let totalCount = 0;
    let tbl3totalWillingChoice = 0;
    let tbl3mobilityConstraint = {blank:0, yes:0};
    let tbl3gender = {male:0, female:0};
    let table3gradecount={e0toe3:0,e4toe6:0,e7toe9:0};
    let table3empstatus= {executive:0,nonexecutive:0};
    let childData = [];
    // this.tableObj.table2SelectedItems=[];
    // this.tableObj.table2SelectedItem = "";
    if(data) {
      if(showAll) {
        childData = this.filterData; this.tableObj.table2SelectedItem = "";
        this.table2Map = new Map();
      } else {
        // childData = data.children;
        this.tableObj.table2SelectedItem = data[this.selectedControl];
        // this.tableObj.table1SelectedItem = data.directorate;
        if(selectedIndex !== undefined && selectedIndex >= 0) {
          if(this.tableObj.table2SelectedItems[selectedIndex]==data[this.selectedControl]) {
            this.tableObj.table2SelectedItems[selectedIndex] = '';
            this.table2Map.delete(data[this.selectedControl]);
          } else {
            this.tableObj.table2SelectedItems[selectedIndex]=data[this.selectedControl];
            this.table2Map.set(data[this.selectedControl], data.children);
          }
        } else {
          this.table2Map = new Map();
         // childData = data.children;
          this.table2Map.set(data[this.selectedControl], data.children);
          
        }
        console.log('1o',this.tableObj.table2SelectedItems)
/*
        for(let x=0;x<this.tableObj.table1SelectedItems.length;x++) {
          if(selectedIndex && this.tableObj.table1SelectedItems[selectedIndex]==data.directorate) {
            this.tableObj.table1SelectedItems[x] = '';
          } else {

          }
        }*/
        //this.tableObj.table1SelectedItems.push(data.directorate);
      
      }
      this.table2Map.forEach((item:any, key:any, mapObj:any)=> {
        //console.log(key.toString(), ":"," ", item);
        childData.push(...item);
      });
      
      childData.forEach((item:any, index: number)=>{
        let obj = map[item[this.changedValue2]];
        if(obj) {
          obj.count = obj.count+1;
          obj.children.push(item);
        } else {
          obj = { [this.selectedControl2]: item[this.selectedControl2], count:1, children:[item] };
        }
        /*
        if(item.willingnessChoice!="") tbl3totalWillingChoice=tbl3totalWillingChoice+1;
        if(item.mobilityConstraint=="") 
          tbl3mobilityConstraint.blank=tbl3mobilityConstraint.blank+1;
        else
          tbl3mobilityConstraint.yes=tbl3mobilityConstraint.yes+1;
          */
        if(item.grade=='E0'||item.grade=='E1'||item.grade=='E2'||item.grade=='E3') {
            table3gradecount.e0toe3 = table3gradecount.e0toe3 + 1;
         }
         if(item.grade=='E4'||item.grade=='E5'||item.grade=='E6') {
          table3gradecount.e4toe6 = table3gradecount.e4toe6 + 1;
        }
        if(item.grade=='E7'||item.grade=='E8'||item.grade=='E9') {
          table3gradecount.e7toe9 = table3gradecount.e7toe9 + 1;
        }
        if(item.empStatus=="Non Executive") {
          table3empstatus.nonexecutive=table3empstatus.nonexecutive+1;
        } else if(item.empStatus=="Executive") {
           table3empstatus.executive=table3empstatus.executive+1;
        }
        if(item.gender=="Male") 
          tbl3gender.male=tbl3gender.male+1;
        else
          tbl3gender.female=tbl3gender.female+1;
        map[item[this.changedValue2]] = obj;
        totalCount++;
      });
      for (let [key, value] of Object.entries(map)) {        
        this.table3data.push(value);
      }
    }
    
    this.tableObj.table2count = totalCount;    
    this.tableObj.table2gender = tbl3gender;
    this.tableObj.table2gradecount = table3gradecount;
    this.tableObj.table2empstatus = table3empstatus;

    this.tableObj.table3count = totalCount; 
    this.tableObj.table3data = this.table3data;
    // console.log("Table 3:",this.tableObj.table3data);
    this.tableObj.table3willingChoice = tbl3totalWillingChoice;
    this.tableObj.table3mobilityConstraint = tbl3mobilityConstraint;
    this.tableObj.table3gender = tbl3gender;
    this.tableObj.table3gradecount = table3gradecount;
    this.tableObj.table3empstatus = table3empstatus;
    this.subData = childData;
    this.tableData = childData;
    this.onTableRowClick(data,0);
  }

  onTable3RowClick(data:any, showAll?:boolean) {    
    let map:any = {};
    let totalCount = 0;
    let tbl3totalWillingChoice = 0;
    let tbl3mobilityConstraint = {blank:0, yes:0};
    let tbl3gender = {male:0, female:0};
    let table3gradecount={e0toe3:0,e4toe6:0,e7toe9:0};
    let table3empstatus= {executive:0,nonexecutive:0};
    let childData = [];
    this.tableObj.table3SelectedItem = "";
    if(showAll) {
      childData = this.filterData;
    } else {
      childData = data.children;
      this.tableObj.table3SelectedItem = data[this.changedValue2];
    }
    
    childData.forEach((item:any, index: number)=>{
      let obj = map[item[this.changedValue2]];
      if(obj) {
        obj.count = obj.count+1;
      } else {
        obj = { [this.selectedControl2]: item[this.selectedControl2], count:1 };
      }
      if(item.grade=='E0'||item.grade=='E1'||item.grade=='E2'||item.grade=='E3') {
          table3gradecount.e0toe3 = table3gradecount.e0toe3 + 1;
       }
       if(item.grade=='E4'||item.grade=='E5'||item.grade=='E6') {
        table3gradecount.e4toe6 = table3gradecount.e4toe6 + 1;
      }
      if(item.grade=='E7'||item.grade=='E8'||item.grade=='E9') {
        table3gradecount.e7toe9 = table3gradecount.e7toe9 + 1;
      }
      if(item.empStatus=="Non Executive") {
        table3empstatus.nonexecutive=table3empstatus.nonexecutive+1;
      } else if(item.empStatus=="Executive") {
         table3empstatus.executive=table3empstatus.executive+1;
      }
      if(item.gender=="Male") 
        tbl3gender.male=tbl3gender.male+1;
      else
        tbl3gender.female=tbl3gender.female+1;
      map[item[this.changedValue2]] = obj;
      totalCount++;
    });

    this.tableObj.table3count = totalCount; 
    this.tableObj.table3willingChoice = tbl3totalWillingChoice;
    this.tableObj.table3mobilityConstraint = tbl3mobilityConstraint;
    this.tableObj.table3gender = tbl3gender;
    this.tableObj.table3gradecount = table3gradecount;
    this.tableObj.table3empstatus = table3empstatus;
  }
  atoz:boolean=true;
  oneto10:boolean=true;
  classesatoz:any=[0,0,0];
  classesoneto10:any=[0,0,0]
  onToggleSortBtn(table:string, type:string) {    
    if(type=='alpha') {
      this.atoz = !this.atoz;
      switch(table) {
        case "table1":
          if(this.atoz){
            this.classesatoz[0]=1;
            this.tableObj.table1data.sort((a:any, b:any) => a.directorate.toLowerCase() < b.directorate.toLowerCase() ? -1 : 1);
          }
          else{
            this.classesatoz[0]=0;
            this.tableObj.table1data.sort((a:any, b:any) => a.directorate.toLowerCase() < b.directorate.toLowerCase() ? 1 : -1);
          }
        break;
        case "table2":
          if(this.atoz){
            this.classesatoz[1]=1;
            this.tableObj.table2data.sort((a:any, b:any) => a[this.selectedControl].toLowerCase() < b[this.selectedControl].toLowerCase() ? -1 : 1);
          }
          else{
            this.classesatoz[1]=0;
            this.tableObj.table2data.sort((a:any, b:any) => a[this.selectedControl].toLowerCase() < b[this.selectedControl].toLowerCase() ? 1 : -1);
          }
        break;
        case "table3":
          if(this.atoz){
            this.classesatoz[2]=1;
            this.tableObj.table3data.sort((a:any, b:any) => a[this.selectedControl2].toLowerCase() < b[this.selectedControl2].toLowerCase() ? -1 : 1);
          }
          else{
            this.classesatoz[2]=0;
            this.tableObj.table3data.sort((a:any, b:any) => a[this.selectedControl2].toLowerCase() < b[this.selectedControl2].toLowerCase() ? 1 : -1);
          }
        break;
      }      
    } else if(type == 'numeric') {
      this.oneto10 = !this.oneto10;

      switch(table) {
        case "table1":
          if(this.oneto10){
              this.classesoneto10[0]=1;
              this.tableObj.table1data.sort((a:any, b:any) => a.count-b.count);
          }
            else{
              this.classesoneto10[0]=0;
              this.tableObj.table1data.sort((a:any, b:any) => b.count-a.count);          
            }
        break;
        case "table2":
          if(this.oneto10){
            this.classesoneto10[1]=1;
            this.tableObj.table2data.sort((a:any, b:any) => a.count - b.count);
          }
          else{
            this.classesoneto10[1]=0;
            this.tableObj.table2data.sort((a:any, b:any) => b.count - a.count);
          }
        break;
        case "table3":
          if(this.oneto10){
            this.classesoneto10[2]=1;
            this.tableObj.table3data.sort((a:any, b:any) => a.count - b.count);
          }
          else{
            this.classesoneto10[2]=0;
            this.tableObj.table3data.sort((a:any, b:any) => b.count - a.count);
          }
        break;
      }
    }
  } 
  
  /* gender status mobility constraint sensitive position directorate department*/
  downloadExcelByTableId(tableId:string, fileName:string) {
    let element = document.getElementById(tableId);
    this.userService.exportexcel(element, fileName);
  }
  downloadExcelByTableFilter(tableId:string, fileName:string) {
    let element = document.getElementById(tableId);
    let additionalData = {
      gender: this.GenderFilter,
      Employeestatus: this.ESFilter,
      MobilityConstraint: this.McFilter,
      sensitivePosition: this.SPFilter,
      directorate: this.DirectorateFilter,
      department: this.DepartmentFilter
    };
    this.userService.exportexcelbyFilter(element, fileName,additionalData);
  }
  downloadExcelByTableClass(tableClass:string, fileName:string) {
    let element = document.getElementsByClassName(tableClass);
    this.userService.exportexcel(element, fileName);
  }
  table1ShowAll() {
    this.calculateLeftFooterDataAfterTagChaged();
  }
  table2ShowAll() {
    this.calledFromShowAll2=false;
    this.tableObj.table2SelectedItems=[];
    
    this.calledFromShowAll2=false;
    this.calculateLeftFooterDataAfterTagChaged2();
    this.calledFromShowAll2=true;
  }
}
const generateChild = (arr:any) => {
  return arr.reduce((acc:any, val:any, ind:any, array:any) => {
     const childs:any = [];
     let count = 0;
     array.forEach((el:any, i:any) => {
        if(childs.includes(el.directorate) || el.directorate === val.directorate){
           childs.push(el); count++;
           el.empCountInDirectorate = count;
        };
     });
     return acc.concat({...val, childs});
  }, []);
};
export function hexToHSL(H:any) {
  // Convert hex to RGB first
  let r:any = 0,
    g:any = 0,
    b:any = 0;
  if (H.length == 4) {
    r = '0x' + H[1] + H[1];
    g = '0x' + H[2] + H[2];
    b = '0x' + H[3] + H[3];
  } else if (H.length == 7) {
    r = '0x' + H[1] + H[2];
    g = '0x' + H[3] + H[4];
    b = '0x' + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}
