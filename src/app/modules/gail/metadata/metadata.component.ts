import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service'
@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})

export class MetadataComponent {
  public departmentSearchTerm: string = '';
  public designationSearchTerm: string = '';
  public directorateSearchTerm: string = '';
  public disciplineSearchTerm:string='';
  public empGroupSearchTerm:string='';
  public empStatusSearchTerm:string='';
  public functionSearchTerm:string='';
  public genderSearchTerm:string='';
  public gradeSearchTerm:string='';
  public locationsSearchTerm:string='';
  public subfunctionsSearchTerm:string='';
  responseData: any;
  departmentData:any;
  designationData:any;
  directorateData:any;
  disciplineData:any;
  empGroupsData:any;
  empStatusData:any;
  functionsData:any;
  gendersData:any;
  gradesData:any;
  locationsData:any;
  subfunctionsData:any;
  displayedColumns = ['name'];
  displayedColumn = ['name','location_type','contg_loc_name'];
  // dataSource = ELEMENT_DATA;
  
  constructor( private dataService: DataService,private userService: UserService) {
    
    
  }
  ngOnInit() {
    
  
    this.userService.getMetadata().subscribe((data:any)=>{
      this.responseData=data;
      this.departmentData=data.data.departments.sort((a: any, b: any) => a.deptName.toLowerCase() > b.deptName.toLowerCase() ? 1 : -1);
      this.designationData=data.data.designations.sort((a: any, b: any) => a.desigName.toLowerCase() > b.desigName.toLowerCase() ? 1 : -1);
      this.directorateData=data.data.directorates.sort((a: any, b: any) => a.directorate.toLowerCase() > b.directorate.toLowerCase() ? 1 : -1);
      this.disciplineData=data.data.disciplines.sort((a: any, b: any) => a.discipline.toLowerCase() > b.discipline.toLowerCase() ? 1 : -1);
      this.empGroupsData=data.data.empGroups.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      this.empStatusData=data.data.empStatus.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      this.functionsData=data.data.functions.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      // this.gendersData=data.data.genders.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      this.gradesData=data.data.grades.sort((a: any, b: any) => a.grade.toLowerCase() > b.grade.toLowerCase() ? 1 : -1);
      this.locationsData=data.data.locations.sort((a: any, b: any) => a.location.toLowerCase() > b.location.toLowerCase() ? 1 : -1);
      this.subfunctionsData=data.data.subfunctions.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    })
    
  }
  getMetadata(){

  }

  
}

// const ELEMENT_DATA: any[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
//   {position: 11, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 12, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 13, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 14, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 15, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 16, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 17, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 18, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 19, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 20, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];
