import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ArcElement, BarController, BarElement, CategoryScale, Chart, Decimation, Filler, Legend, LinearScale, PieController, Title, Tooltip } from 'chart.js';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import * as echarts from 'echarts';
import { FormControl } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import * as html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { CustomDialogComponent } from 'src/app/_dialogs/custom-dialog/custom-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-main-report',
  templateUrl: './main-report.component.html',
  styleUrls: ['./main-report.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainReportComponent {
  showAllTable = false;
  showStdTable = false;
  showStdReportTable = false;
  showChart: boolean = true;
  totalEmployees = 0;
  //manningDisplayColumns = ["id","directorate", "location", "discipline", "department", "functions", "sub_functions", "grade_E9","existingGrade_E9", "grade_E8","existingGrade_E8", "grade_E7","existingGrade_E7", "grade_E6","existingGrade_E6", "grade_E54","existingGrade_E54", "grade_E32","existingGrade_E32", "grade_E1S5","existingGrade_E1S5", "grade_S40","existingGrade_S40", "existing", "created_on", "updated_on", "Surplus_Deficit", "remarks", "network", "ed_region", "type"]
  manningDisplayColumns = ["id","directorate", "location", "discipline", "grade_E9", "criticalGrade_E9", "existingGrade_E9", "grade_E8", "criticalGrade_E8", "existingGrade_E8", "grade_E7", "criticalGrade_E7", "existingGrade_E7", "grade_E6", "criticalGrade_E6", "existingGrade_E6", "grade_E54", "criticalGrade_E54", "existingGrade_E54", "grade_E32", "criticalGrade_E32", "existingGrade_E32", "grade_E1S5", "criticalGrade_E1S5", "existingGrade_E1S5", "grade_S40", "criticalGrade_S40", "existingGrade_S40", "created_on", "updated_on", "type"]
  manningReportDisplayColumns = ["location","discipline","grade","in_count","net_count","out_count"];
  displayedColumnsUpload=["tag","masterdataFile","hardLocationFile","mobilityConstraintsFile","sensitivePositionFile","stdManningFile","compulsaryTransferFile"]
  tpend = "";
  tpstart = "";
  public allDataSearchTerm: string = '';
  numberOfRowsAll: number = 0;
  numberOfRowsInd: number = 0;
  numberofRowsT2: number = 0;
  selectedRow: any;
  dataSourceAll: any = new MatTableDataSource([]);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  columnsToDisplayWithExpand1 = [...this.columnsToDisplay, 'expand'];
  selectedToggleGrade: string = 'All';
  selectedToggleDiscipline: string = 'All';
  responseData: any;
  displayColumnsNewTable = ['id', 'name', 'grade','discipline','presentLocation', 'proposedLocation'];
  displayColumnsAllTable = ['id', 'name', 'grade', 'presentLocation', 'proposedLocation', 'discipline', 'directorate', 'department', 'previousHL',
    'birthDate', 'age', 'changeOfLocation', 'newDirectorate', 'newFunction', 'rks', 'dueForDPC2023', 'deputation',
    'secondment', 'sensitivePosition', 'fieldPostingTransferPromoted',
    'superannuatingby2025', 'quarterlySupby2025', 'empStatus', 'employeeGroup', 'gender',
    'wilTo4HL', 'willingnessChoice', 'tagName', 'oldTPCGroundstillexist', 'tpcPool2022', 'tpc', 'hlChoice1', 'hlChoice2', 'hlChoice3',
    'prsntGradeDt', 'handicap', 'supernDt', 'compulsoryTransferFlag', 'compulsoryTransferLocation', 'compulsoryTransferComments',
    'mobilityConstraintsFlag', 'mobilityConstraintsDetail', 'mobilityConstraintsComments',
    'eligible', 'proposedOptionId01','optionAllR' ,'transfer_comment','optionId01', 'optionId02', 'optionId03','actionFlag', 'placementHistoryYears'];
  displayedColumns = ['location', 'grade', 'discipline', 'inCount', 'outCount', 'netCount'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  displayedColumnsNew = ['id', 'name', 'grade', 'inCount', 'outCount', 'netCount'];
  displayedColumnsGradeAll = ['location', 'grade', 'inCount', 'outCount', 'netCount'];
  expandedElement: any = {};
  dataSource = new MatTableDataSource([]);
  childDataSource: any = [];// Array(10000000).fill(null);
  childDisplayedColumns = ['id', 'name', 'designation', 'department', 'discipline', 'directorate', 'grade'];
  subscription: Subscription = new Subscription;
  selectedTagName: string = '';
  @ViewChild(MatSort)
  sort!: MatSort;
  analyticData: any = [];
  analyticFilterData: any = [];
  manningData: any = [];
  manningReportData: any = [];
  masterDataDetail:any=[];

  searchValue: string="";
  tagName:any=""
  masterdataFile:any=""
  hardLocationFile:any=""
  mobilityConstraintsFile:any=""
  sensitivePositionFile:any=""
  stdManningFile:any=""
  compulsaryTransferFile:any=""

  year:any=""
  month :any=""
  day :any=""
  hours :any=""
  minutes:any=""
  seconds:any=""
  searchedName:string = "";

  searchedId:string = "";
  year1:any=""
  month1 :any=""
  day1 :any=""
  hours1 :any=""
  minutes1:any=""
  seconds1:any=""
  // searchedName:string = "";
  vchart: any;
  @ViewChild('chartArea')
  private chartArea!: ElementRef<HTMLCanvasElement>;
  constructor(private dataService: DataService, private userService: UserService, public dialog: MatDialog) {
    Chart.register(BarElement, BarController, ArcElement, LinearScale, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, PieController);
  }
  ngOnInit() {
  }

 

  ngAfterViewInit() {
    this.onTagChange();
    this.dataSource.sort = this.sort;
    this.countLocationGradeAllData.sort = this.sort;
    this.subscription = this.dataService.currentMessage.subscribe((message: any) => {
      if (message.filterType == "tagFilter") {
        this.selectedTagName = message.value;
        this.onTagChange();

      }
    });

  }
  applyFilter() {
    // this.searchedName=this.searchedName.trim().toLowerCase();;
    // this.searchValue = filterValue.trim().toLowerCase();
    this.showAllDataTable();
  }

  ngOnDestroy() {

    if (this.selectedTagName && this.selectedTagName != "-- SELECT --") {
      let filterValues = { filterType: "tagFilter", value: this.selectedTagName, eventType: "singleclick" };
      this.dataService.changeMessage(filterValues);
    } else {
      this.dataService.changeMessage({});
    }
    this.subscription.unsubscribe();
  }
  countLocationGradeAllData: any = new MatTableDataSource([]);
  tableTotal = { grade: '', discipline: '', inbound: 0, outbound: 0, netbound: 0 }
  locations: any = []; inBounds: any = []; outBounds: any = []; grades: any = []; disciplines: any = [];
  countArrData: any = [];
  onTagChange() {
    this.numberOfRowsAll = 0;
    this.numberOfRowsInd = 0;
    this.tableTotal = { grade: 'All', discipline: 'All', inbound: 0, outbound: 0, netbound: 0 };
    this.locations = []; this.inBounds = []; this.outBounds = [];
    if (this.selectedTagName && this.selectedTagName != "-- SELECT --") {
      /*
      this.userService.getReports({tagName:this.selectedTagName}).subscribe((data: any) => {
        this.responseData = data.data;
        console.log('responsedata', this.responseData);
        this.numberOfRowsInd=this.responseData.length;
        this.dataSource = new MatTableDataSource(data.data);
        this.dataSource.sort = this.sort;
        this.prepareData();
      });
      */
      this.userService.getStdManning(this.selectedTagName).subscribe((data: any) => {
        this.manningData = data.data || [];
        console.log("Manning data: ", this.manningData);
      });
      this.userService.getManningReports(this.selectedTagName).subscribe((data: any) => {
        this.manningReportData = data.data || [];
        console.log("Report Manning data: ", this.manningReportData);
      });
      this.userService.getTPWholeState(this.selectedTagName).subscribe((data: any) => {
        // Assuming tpend and tpstart are timestamps in milliseconds
        this.masterDataDetail=data.data;
        this.tagName=data.data.tagName;
        this.masterdataFile=data.data.masterdataFile;
        this.hardLocationFile=data.data.hardLocationFile;
        this.mobilityConstraintsFile=data.data.mobilityConstraintsFile;
        this.sensitivePositionFile=data.data.sensitivePositionFile;
        this.stdManningFile=data.data.stdManningFile;
        this.compulsaryTransferFile=data.data.compulsaryTransferFile;
        // console.log("SDFDFDF:",this.masterDataDetail.tagName,this.masterDataDetail.masterdataFile);
        const convertTimestampToDateTime = (timestamp: number) => {
          const date = new Date(timestamp);
          return date.toLocaleString(); // Adjust the format as needed
        };
      
        
        // this.tpend = convertTimestampToDateTime(data.data.tpend);
        this.tpend = data.data.tpend;

        const dateObject = new Date(this.tpend);

        // Extract date components
        this.year = dateObject.getFullYear();
        this.month = dateObject.getMonth() + 1; // Month is zero-based, so we add 1
        this.day = dateObject.getDate();

        // Extract time components
        this.hours = dateObject.getHours()-5;
        this.minutes = dateObject.getMinutes()-30;
        this.seconds = dateObject.getSeconds();

        this.tpstart = data.data.tpstart;

        const dateObject1 = new Date(this.tpstart);

        // Extract date components
        this.year1 = dateObject.getFullYear();
        this.month1 = dateObject.getMonth() + 1; // Month is zero-based, so we add 1
        this.day1 = dateObject.getDate();

        // Extract time components
        this.hours1 = dateObject.getHours()-5;
        this.minutes1 = dateObject.getMinutes()-30;
        this.seconds1 = dateObject.getSeconds();
        // this.tpstart = convertTimestampToDateTime(data.data.tpstart);
        
        this.countAfterFilter = data.data.countAfterFilter;
        this.countAfterRule = data.data.countAfterRule;
      
        //console.log("TPC data", data.data);
      });
      
      


      this.userService.getMasterData({ tagName: this.selectedTagName }).subscribe((data: any) => {
        this.analyticData = data.data.content || [];
        this.totalEmployees = this.analyticData.length;
        // this.analyticFilterData = data.data || []; 
        //console.log('ana', this.analyticData);
        this.prepareData();
        this.analyticTopData();
        let len = this.countArrData.length;
        this.showChart = true;
        if (len == 0) {
          this.showChart = false;
        }



        if (len > 0) {
          this.countArrData.sort((a: any, b: any) => a.location.toLowerCase() < b.location.toLowerCase() ? 1 : -1);
          this.onTableRowClick(this.countLocationGradeAllData.data[0]);
          this.onTableRowClickbelow(this.countLocationGradeAllData.data[0]);
          this.inBoundCountfunc();

        }
        else {
          this.onTableRowClick([]);
          this.onTableRowClickbelow([]);
          this.inBoundCountfunc();
          this.formattedChartData = [];
          this.EmployeeChart();

        }
      });
      

    }

  }

  inBoundCount = 0;
  outBoundCount = 0
  tempinCount = [];
  tempoutCount = [];
  searchedData:any = [];
  inBoundCountfunc() {

    this.inBoundCount = this.tempinCount.length;
    this.inBoundCount = this.numberOfRowsAll - this.inBoundCount;
    this.outBoundCount = this.tempoutCount.length;
    this.outBoundCount = this.numberOfRowsAll - this.outBoundCount;
  }
  // Assuming this method is part of your component class
  async fetchMasterData(): Promise<void> {
    try {
      const data: any = await this.userService.getMasterData({ tagName: this.selectedTagName, name: this.searchedName,id:this.searchedId }).toPromise();
      this.searchedData = data.data.content || [];
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  }
  

// Usage



  prepareData() {
    this.tableTotal = { grade: 'All', discipline: 'All', inbound: 0, outbound: 0, netbound: 0 };
    this.responseData = this.analyticData.filter((ad: any) => ad.proposedLocation != null && ad.proposedLocation != "");

    let map: any = {};
    let disciplineSet = new Set();
    this.responseData.forEach((item: any, index: any) => {
      this.statusArr.push(false);
      this.grades.push(item.grade);
      disciplineSet.add(item.discipline);

      let key = '';
      let location = item.proposedLocation;
      
      if (this.allFilter.grade == 'Individual' && this.allFilter.discipline == 'Individual') {
        key = location + "-" + item.grade + "-" + item.discipline;
      } else if (this.allFilter.grade == 'All' && this.allFilter.discipline == 'Individual') {
        key = location + "-" + item.discipline;
      } else if (this.allFilter.grade == 'Individual' && this.allFilter.discipline == 'All') {
        key = location + "-" + item.grade;
      } else if (this.allFilter.grade == 'All' && this.allFilter.discipline == 'All') {
        key = location;
      }
      let obj = map[key]; // inbound
      if (obj) {
        obj.inCount = obj.inCount + 1;
        obj.netCount = obj.inCount - obj.outCount;
      } else {
        obj = { location: location, inCount: 1, outCount: 0, netCount: 1, grade: (this.allFilter.grade == 'All' ? 'All' : item.grade), discipline: (this.allFilter.discipline == 'All' ? 'All' : item.discipline) };
      }
      this.tableTotal.inbound = this.tableTotal.inbound + 1;
      this.tableTotal.netbound = this.tableTotal.inbound - this.tableTotal.outbound;
      map[key] = obj;
      key = '';
      location = item.presentLocation;
      if (this.allFilter.grade == 'Individual' && this.allFilter.discipline == 'Individual') {
        key = location + "-" + item.grade + "-" + item.discipline;
      } else if (this.allFilter.grade == 'All' && this.allFilter.discipline == 'Individual') {
        key = location + "-" + item.discipline;
      } else if (this.allFilter.grade == 'Individual' && this.allFilter.discipline == 'All') {
        key = location + "-" + item.grade;
      } else if (this.allFilter.grade == 'All' && this.allFilter.discipline == 'All') {
        key = location;
      }
      let obj2 = map[key];
      if (obj2) {
        obj2.outCount = obj2.outCount + 1;
        obj2.netCount = obj2.inCount - obj2.outCount;
      } else {
        obj2 = { location: location, inCount: 0, outCount: 1, netCount: -1, grade: (this.allFilter.grade == 'All' ? 'All' : item.grade), discipline: (this.allFilter.discipline == 'All' ? 'All' : item.discipline) };
      }
      this.tableTotal.outbound = this.tableTotal.outbound + 1;
      this.tableTotal.netbound = this.tableTotal.inbound - this.tableTotal.outbound;
      map[key] = obj2;
    });


    this.grades = [...new Set(this.grades)].sort();
    this.disciplines = [...disciplineSet];
    //console.log('map ', map);
    this.countArrData = [];
    this.numberOfRowsAll = 0;
    for (let [key, value] of Object.entries(map)) {
      this.countArrData.push(value);
      let v = value as any;
      this.locations.push(v.location);
      this.inBounds.push(v.inCount);
      this.outBounds.push(v.outCount);
      this.numberOfRowsAll++;
    }
    console.log('preparedata', this.countArrData);
    this.createChart(this.locations, this.inBounds, this.outBounds);
    this.countLocationGradeAllData = new MatTableDataSource(this.countArrData);
    this.countLocationGradeAllData.sort = this.sort;
    this.tempinCount = this.countLocationGradeAllData.filteredData.filter((ad: any) => ad.inCount === 0) || [];
    this.tempoutCount = this.countLocationGradeAllData.filteredData.filter((ad: any) => ad.outCount === 0) || [];

  }
  showLoader = false;
  statusArr: any = [];
  onExpandRow(event: any, expandedElement: any, element: any, index: number) {
    this.statusArr.fill(false);
    if (expandedElement == null) {
      this.statusArr[index] = false;
    } else {
      //console.log(event, expandedElement, element, index);
      // apliy filter here on this.analyticData based on grade location
      this.statusArr[index] = true;//!this.statusArr[index];
      this.childDataSource = this.analyticData.filter((ad: any) => ad.grade == element.grade && ad.presentLocation == element.location) || [];
    }
  }

  clickedRowData: any = [];
  clickedRowDataDisplayName = "";
  locationRowClick = "";
  onTableRowClick(data: any) {
    this.selectedRow = data;
    this.clickedRowDataDisplayName = data.location + " / " + data.grade;
    this.locationRowClick = data.location;

    var clickedRowDataOut = this.analyticData.filter((ad: any) => ("All" == data.grade || ad.grade == data.grade) && ("All" == data.discipline || ad.discipline == data.discipline) && ad.presentLocation == data.location && ad.proposedLocation != null) || [];
    var clickedRowDataIn = this.analyticData.filter((ad: any) => ("All" == data.grade || ad.grade == data.grade) && ("All" == data.discipline || ad.discipline == data.discipline) && ad.proposedLocation == data.location && ad.proposedLocation != null) || [];
    this.clickedRowData = [...clickedRowDataIn, ...clickedRowDataOut];
    console.log("RowData", this.clickedRowData);
    this.onTableRowClickDetail(this.clickedRowData[0]);
    this.numberofRowsT2 = this.clickedRowData.length;
  }
  clickedRowDatabelow: any = [];
  clickedRowDataBelowDisplayName = "";
  onTableRowClickbelow(data: any) {
    this.selectedRow = data;
    this.clickedRowDataBelowDisplayName = data.location;

    var clickedRowDataOut = this.analyticData.filter((ad: any) => ad.presentLocation == data.location && ad.proposedLocation != null) || [];
    var clickedRowDataIn = this.analyticData.filter((ad: any) => ad.proposedLocation == data.location && ad.proposedLocation != null) || [];
    this.clickedRowDatabelow = [...clickedRowDataIn, ...clickedRowDataOut];
    console.log("RowData", this.clickedRowDatabelow);
    this.onTableRowClickDetail(this.clickedRowDatabelow[0]);
    this.numberofRowsT2 = this.clickedRowDatabelow.length;
  }
  allFilter: any = { grade: "All", discipline: "All" };
  selectedElement: string = "Table";
  onToggleValChange(event: any, type: string) {
    this.selectedElement = type;
    if (this.selectedElement == "Table") {
      this.createChart(this.locations, this.inBounds, this.outBounds);
    }
    if (type == 'grade') {
      this.allFilter.grade = event.value;
      this.prepareData();
      //this.onSearchData();
      
    }
    if (type == 'discipline') {
      this.allFilter.discipline = event.value;
      this.prepareData();
      //  this.onSearchData();
      
    }

  }


  createChart(locationAsLabels: Array<string>, inbounds: Array<any>, outbounds: Array<any>) {
    if (this.vchart) {
      this.vchart.destroy();
    }
    let ctx = this.chartArea.nativeElement.getContext('2d') as any;
    this.vchart = new Chart(ctx, {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: locationAsLabels,
        datasets: [
          {
            label: "In",
            data: inbounds,
            backgroundColor: 'blue'
          },
          {
            label: "Out",
            data: outbounds,
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }
  clickedRowDetail: any = [];
  formattedChartData: any[] = [];
  onTableRowClickDetail(data: any) {
    console.log("DATA: ", data)
    this.clickedRowDetail = data;
    if (this.clickedRowDetail) {
      const placementHistoryString = this.clickedRowDetail.placementHistoryYears;
      this.formattedChartData = this.formatPlacementHistoryData(placementHistoryString);
      this.EmployeeChart();
    }
    console.log("row: ", this.clickedRowDetail);

  }

  formatPlacementHistoryData(placementHistoryString: string): any {
    var i = 0;
    if (!placementHistoryString) { return []; }
    const historyItems = placementHistoryString.split(', ');
    const formattedData: any[] = [];
    // formattedData.push(['score','years','location']);
    historyItems.forEach(item => {
      const [location, value] = item.split(' (');
      const numericValue = parseFloat(value.replace(')', ''));
      formattedData.push([numericValue, numericValue, location + " " + i]);
      i++;
    });
    console.log("formattedData:" + formattedData);
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

    const option: any = {
      dataset: {
        source: this.formattedChartData
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
            formatter: (data: any) => {
              return data.data[1];
            }
          },
        }
      ]
    };

    myChart.setOption(option);
  }

  inputFields: any = { 'location': 0 };
  selectedLocation: any = [];
  selectedGrades: any = [];
  selectedDisciplines: any = [];
  selectAllDisciplines: boolean = false;
  selectAllGrades: boolean = false;
  selectAllLocations: boolean = false;
  countAfterFilter=0;
  countAfterRule=0;
  togglePressed:boolean=false;
  toggleInputFields(inputName: string) {
    this.inputFields[inputName] = !this.inputFields[inputName];
    this.togglePressed=true;
  }

  selectAllLocationsChanged() {
    if (this.selectAllLocations) {
      this.selectedLocation = [...this.locations]; // Select all logic here
    } else {
      this.selectedLocation = [];
    }
    this.onSearchData();
  }
  selectAllGradesChanged() {
    if (this.selectAllGrades) {
      this.selectedGrades = [...this.grades];
    } else {
      this.selectedGrades = [];
    }
    this.onSearchData();
  }
  selectAllDisciplinesChanged() {
    if (this.selectAllDisciplines) {
      this.selectedDisciplines = [...this.disciplines];
    } else {
      this.selectedDisciplines = [];
    }
    this.onSearchData();
  }
  totalTransfer = 0;
  analyticTopData() {
    let arr = this.analyticData.filter((ad: any) => ad.proposedLocation !== null) || [];
    this.totalTransfer = arr.length;
  }

  showLoading: boolean = false;
  onSearchData() {
    let arr: any = [];
    this.numberOfRowsAll = 0;
    this.countArrData.forEach((item: any) => {
      /* if ((this.selectedLocation.length === 0 || this.selectedLocation.indexOf(item.location) > -1) &&(this.selectedGrades.length === 0 || this.selectedGrades.indexOf(item.grade) > -1)) {
       arr.push(item);
     }*/
      if ((this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
        (this.selectedLocation.length == 0 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
        (this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.length == 0 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
        (this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.length == 0) ||
        (this.selectedLocation.length == 0 && this.selectedGrades.length == 0 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
        (this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.length == 0 && this.selectedDisciplines.length == 0) ||
        (this.selectedLocation.length == 0 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.length == 0) ||
        (this.selectedLocation.length == 0 && this.selectedGrades.length == 0 && this.selectedDisciplines.length == 0)
      ) {
        arr.push(item);
      }
    });
    this.countLocationGradeAllData = new MatTableDataSource(arr);
    this.numberOfRowsAll = arr.length;
    if (this.allFilter.grade == 'All') {
      // let arr = this.countArrData.filter((ad:any)=>/* ad.grade==data.grade && */ this.selectedLocation.indexOf(ad.location)>-1)||[];


    }
    console.log(this.selectedGrades);
    if (this.allFilter.grade == 'Individual') {
      // ad.presentLocation||ad.proposedLocation
      // let arr2=this.analyticData.filter((ad:any)=>/* ad.grade==data.grade && */ this.selectedLocation.indexOf(ad.presentLocation)>-1 ||this.selectedLocation.indexOf(ad.proposedLocation)>-1)||[];
      let arr: any = [];
      this.responseData.forEach((item: any) => {
        /* if ((this.selectedLocation.length === 0 || this.selectedLocation.indexOf(item.location) > -1) &&(this.selectedGrades.length === 0 || this.selectedGrades.indexOf(item.grade) > -1)) {
         arr.push(item);
       }*/
        if ((this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
          (this.selectedLocation.length == 0 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
          (this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.length == 0 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
          (this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.length == 0) ||
          (this.selectedLocation.length == 0 && this.selectedGrades.length == 0 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
          (this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.length == 0 && this.selectedDisciplines.length == 0) ||
          (this.selectedLocation.length == 0 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.length == 0)
        ) {
          arr.push(item);
        }
      });
      // arr2 = arr2.filter((ad:any)=>/* ad.grade==data.grade && */ this.selectedLocation.indexOf(ad.location)>-1)||[];
      this.dataSource = new MatTableDataSource(arr);
      this.numberOfRowsInd = arr.length;
    }
    if (this.allFilter.discipline == 'Individual') {
      let disArr: any = [];
      this.responseData.forEach((item: any) => {
        /*
        if ((this.selectedLocation.length === 0 || this.selectedLocation.indexOf(item.location) > -1) || this.selectedDisciplines.indexOf(item.discipline) &&(this.selectedGrades.length === 0 || this.selectedGrades.indexOf(item.grade) > -1 || this.selectedDisciplines.indexOf(item.discipline))) {
          disArr.push(item);
        }*/
        if ((this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
          (this.selectedLocation.length == 0 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
          (this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.length == 0 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
          (this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.length == 0) ||
          (this.selectedLocation.length == 0 && this.selectedGrades.length == 0 && this.selectedDisciplines.indexOf(item.discipline) > -1) ||
          (this.selectedLocation.indexOf(item.location) > -1 && this.selectedGrades.length == 0 && this.selectedDisciplines.length == 0) ||
          (this.selectedLocation.length == 0 && this.selectedGrades.indexOf(item.grade) > -1 && this.selectedDisciplines.length == 0)
        ) {
          disArr.push(item);
        }
        this.dataSource = new MatTableDataSource(disArr);
      });
      this.numberOfRowsInd = disArr.length;

    }
  }

  onToggleValChangeGrade(event: MatButtonToggleChange): void {
    this.selectedToggleGrade = event.value;
    if (this.selectedLocation && this.selectedLocation.length > 0) {
      this.onSearchData();

    }
  }
  onToggleValChangeDiscipline(event: MatButtonToggleChange): void {
    this.selectedToggleGrade = event.value;
  }
  downloadExcelByTableId(tableId: string, fileName: string) {
    let element = document.getElementById(tableId);
    this.userService.exportexcel(element, fileName);
  }

  downloadExcel() {
    // Create a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.downloaddata);

    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook
    XLSX.writeFile(wb, 'TransfereProcessList_table.xlsx');
  }
  generatePDF() {
    const divToCapture = document.getElementById('divToCapture');
    if (divToCapture) {
      (html2canvas as any)(divToCapture).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; // mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('employee-details.pdf');
      });
    } else {
      console.error('Div not found');
    }
  }
  toggleAllTable() {
    this.showAllTable = !this.showAllTable;
    if (this.showAllTable) {
      this.showAllDataTable();

    }
  }
  toggleStdTable(){
    this.showStdTable=!this.showStdTable;
    
  }
  toggleStdReportTable(){
    this.showStdReportTable=!this.showStdReportTable
  }
  downloaddata: any = [];
  data: any = [];
  totalElements: any = 0;
  pageNo = 0; pageSize = 10;
  async showAllDataTable(reload?: boolean) {
    if (reload) {
      this.pageNo = 0;
    }
    let data = [];
    if (this.selectedOption) {
      data = this.analyticData.filter((ad: any) => ad[this.selectedOption] !== null) || [];
      this.downloaddata = data;
      console.log(this.dataSourceAll);
    }

    else {
      data = this.analyticData;
      this.downloaddata = data;
    }
    
    if (this.searchedName || this.searchedId) {
      await this.fetchMasterData();
      data = this.searchedData;
      this.downloaddata = data;
    }
    this.totalElements = data.length;
    let start = (this.pageNo * this.pageSize);
    let end = (this.pageNo * this.pageSize) + this.pageSize;
    this.data = data.slice(start, end);
    this.dataSourceAll = new MatTableDataSource(this.data);
  }
  
  onPageChange(event: any) {
    console.log(event)
    this.pageNo = event.pageIndex;//(event.pageIndex*this.pageSize)+1;
    this.pageSize = event.pageSize;
    this.showAllDataTable();
  }
  options = [
    { value: '', label: 'All Data ' },
    { value: 'proposedLocation', label: 'proposedLocation ' },
    { value: 'dueForDPC2023', label: 'Due_for_DPC_2023 ' },
    { value: 'deputation', label: 'Deputation' },
    { value: 'superannuatingby2025', label: 'Superannuating_by_2025' },
    { value: 'willingnessChoice', label: 'willingnessChoice' },
    { value: 'wilTo4HL', label: 'Wil_to_4HL' },
    { value: 'oldTPCGroundstillexist', label: 'Old_TPC_Ground_still_exist' },
    { value: 'tpcPool2022', label: 'TPC_Pool_2022' },
    { value: 'tpc', label: 'TPC_2023' },
    { value: 'previousHL', label: 'Previous_HL' }, 
    { value: 'optionAllR', label: 'Option All R' },
    { value: 'actionValue', label: 'Actions' }
    // Add more options as needed
    // Add more options as needed
  ];
  selectedOption: string = "";
  isInteractionEnabled: boolean = this.data.enableInteraction;
  
  setFilterValue(status:string) {
    let filters: any = [];
    if (this.selectedTagName && this.selectedTagName != "-- SELECT --") {
      this.userService.getFilters(this.selectedTagName,status).subscribe({
        next: (result: any) => {
          filters = result.data;
        },
        complete: () => {
          let filterValues = { filterType: "searchFilter", value: { subject: 'filter', filters: filters }, eventType: "dblclick", disable: true };
          this.dataService.changeMessage(filterValues);
        },
      });
    }
  }
  getRules(status:string) {
    let rules:any= [];
    let ruleSets:any = [];
    this.userService.getRules(this.selectedTagName,status).subscribe({
      error: (err:any)=>{
        console.log('error ', err);
      },
      next: (result:any)=>{  
        rules = result.data; 
        ruleSets = result.detail;
      },
      complete:()=>{
        let filterValues = { filterType: "popupFilter", value: {subject: 'rule', rules:rules, ruleset:ruleSets }, eventType: "dblclick",disable:true};
        this.dataService.changeMessage(filterValues);
      }
    });
  }
}