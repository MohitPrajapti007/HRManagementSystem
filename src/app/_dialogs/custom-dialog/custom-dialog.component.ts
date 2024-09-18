import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css']
})
export class CustomDialogComponent {
  
  dialogContentId: string = `mat-dialog-content-${parseInt(this.dialogRef.id.replace(/\D/g, ''), 10)}`;
  orderForm: FormGroup;
  // items!: FormArray;
  filterForm!: FormGroup;
  actionForm!: FormGroup;
  toppings = new FormControl('');
  departments:any=[];
  directorates:any=[];
  disciplines:any=[];
  designations:any=[];
  functions:any=[];
  subfunctions:any=[];
  empStatus:any=[];
  grades:any=[];
  empGroups:any=[];
  metadata: any = {};
  locations:any = [];
  header = "";
  tpc=0;
  favoriteSeason: string = "";
  actions: any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<CustomDialogComponent>,
    private formBuilder: FormBuilder, private userService: UserService, private dataService: DataService) {
    dialogRef._containerInstance._config.ariaDescribedBy = this.dialogContentId;
    switch (data.subdata.subject) {
      case 'rule': this.header = "All Rules";
        this.myForm = this.formBuilder.group({
          rules: this.formBuilder.array([])
        });

        let dataRules = data.subdata.rules || [];
        let rulesets = data.subdata.ruleset || [];
        this.userService.getRules().subscribe({
          error: (err: any) => {
            console.log('error ', err);
          },
          next: (result: any) => {
            //console.log('rules result ', result);
            let rules = result.data || [];
            for (let i = 0; i < rules.length; i++) {
              let dr = dataRules.find((d: any) => d.id == rules[i].id);
              let rset = rulesets.find((rs: any) => rs.ruleId == rules[i].id) || { ruleValue: null };
              this.addRule(rules[i], (dr && dr.status == 'ACTIVE') || false, rset.ruleValue, rset.ruleOrder);
              
            }
          }
        });
        
        break;
      case 'filter': this.header = "All Filters";
        let appliedFilters = this.data.subdata.filters || [];//this.groupBy(this.data.subdata.filters || [], 'metaDataId');
        let departmentIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "Department"||af.metaDataName.toLowerCase() == "department").map((af: any) => af.metaDataId);
        let directorateIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "Directorate"||af.metaDataName.toLowerCase() == "directorate").map((af: any) => af.metaDataId);
        let disciplineIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "Discipline"||af.metaDataName.toLowerCase() == "discipline").map((af: any) => af.metaDataId);
        let designationIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "Designation"||af.metaDataName.toLowerCase() == "designation").map((af: any) => af.metaDataId);
        let functionIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "EmpFunction"||af.metaDataName.toLowerCase() == "emp_function").map((af: any) => af.metaDataId);
        let subFunctionIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "SubFunction"||af.metaDataName.toLowerCase() == "sub_function").map((af: any) => af.metaDataId);
        let empStatusIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "EmpStatus"||af.metaDataName.toLowerCase() == "emp_status").map((af: any) => af.metaDataId);
        let empGroupIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "EmpGroup"||af.metaDataName.toLowerCase() == "employeegroup").map((af: any) => af.metaDataId);
        let gradeIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "Grade"||af.metaDataName.toLowerCase() == "grade").map((af: any) => af.metaDataId);
        let locationIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "Location"||af.metaDataName.toLowerCase() == "location").map((af: any) => af.metaDataId);
        let genderIds = appliedFilters.filter((af: any) => af.metaDataName.toLowerCase() == "Gender"||af.metaDataName.toLowerCase() == "gender").map((af: any) => af.metaDataId);

        this.filterForm = this.formBuilder.group({
          tagName: [this.data.tagName],
          departmentIds: [departmentIds],
          directorateIds: [directorateIds],
          disciplineIds: [disciplineIds],
          designationIds: [designationIds],
          functionIds: [functionIds],
          subFunctionIds: [subFunctionIds],
          empStatusIds: [empStatusIds],
          empGroupIds: [empGroupIds],
          gradeIds: [gradeIds],
          locationIds: [locationIds],
          genderIds: [genderIds],
        });
        this.userService.getMetadata().subscribe({
          next: (result: any) => {
            //console.log('metadata result ', result);
            this.metadata = result.data;
            this.departments=this.metadata.departments.sort((a: any, b: any) => a.deptName.toLowerCase() > b.deptName.toLowerCase() ? 1 : -1);
            this.directorates=this.metadata.directorates.sort((a: any, b: any) => a.directorate.toLowerCase() > b.directorate.toLowerCase() ? 1 : -1);
            this.disciplines=this.metadata.disciplines.sort((a: any, b: any) => a.discipline.toLowerCase() > b.discipline.toLowerCase() ? 1 : -1);
            this.designations=this.metadata.designations.sort((a: any, b: any) => a.desigName.toLowerCase() > b.desigName.toLowerCase() ? 1 : -1);
            this.functions=this.metadata.functions.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
            this.subfunctions=this.metadata.subfunctions.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
            this.empStatus=this.metadata.empStatus.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
            this.grades=this.metadata.grades.sort((a: any, b: any) => a.grade.toLowerCase() > b.grade.toLowerCase() ? 1 : -1);
            this.empGroups=this.metadata.empGroups.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
            this.locations=this.metadata.locations.sort((a: any, b: any) => a.location.toLowerCase() > b.location.toLowerCase() ? 1 : -1);
          }
        })
        break;
      case 'action': this.header = "All Actions";
      this.userService.getLocations().subscribe({
        next: (result: any) => {
         // console.log('metadata result ', result);
          this.locations = result.data;
          this.locations=this.locations.sort((a:any, b:any) => a.location.toLowerCase() > b.location.toLowerCase() ? 1 : -1);
        }
      })
        let selectedRowIds = (this.data.subdata.selectRows || []).map((r:any)=>r.id);
        let appliedActions = this.data.subdata.appliedActions||[];
        if(appliedActions.length==0) {
          appliedActions.push({actionId: '', comment: ''});
        }
        
        this.actionForm = this.formBuilder.group({
          tagName: [this.data.tagName],
          actionId:[appliedActions[0].actionId],
          comment: [appliedActions[0].comment],
          selectedIds: [selectedRowIds, [Validators.required]],
          specificLocation: [[]]
        });
        this.favoriteSeason = appliedActions[0].actionId;
        //this.actionForm.patchValue({actionId: appliedActions[0].actionId});
       // this.actionForm.controls['actionId'].setValue(appliedActions[0].actionId);
        this.userService.getActions().subscribe({
          next: (result: any) => {
            //console.log('action result ', result);
            this.actions = result.data || [];
          }
        })
        break;
    }
    this.orderForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });



  }
  ngOnInit() {
    this.onValueChanges();
  }
  onValueChanges() {
    this.actionForm?.controls['actionId'].valueChanges.subscribe((value:any)=>{
      let locValue = this.actionForm.controls['specificLocation'].value||[];
      if(value == 3 && (locValue.length==0)) {
        this.actionForm.controls['specificLocation'].setValidators([Validators.required]); 
      } else {
        this.actionForm.controls['specificLocation'].clearValidators();
      }
      this.actionForm.controls['specificLocation'].updateValueAndValidity();
    })
  }
  selectionChange(event:any){
   // console.log(event);
    if(event.value.length>3){
      this.actionForm.controls['specificLocation'].setErrors({Error:true,Message:"Maximum 3 values are allowed"});
    }
    else{
      this.actionForm.controls['specificLocation'].setErrors(null);
    }
  }
  
  selectedLocationsActions:any=[];
  selectedLocationsAction:string="";
  optionChange(event:any){
    //console.log(event);
    if(event.source.selected){
      this.selectedLocationsActions.push(event.source.value);
    }
    else
    {
      const index = this.selectedLocationsActions.indexOf(event.source.value);
      if (index > -1) {
        this.selectedLocationsActions.splice(index, 1); 
      }      
    }
    this.selectedLocationsAction=this.selectedLocationsActions.join(",");
  }
  get ff() {
    return this.filterForm.controls;
  }
  get rules(): FormArray {
    return <FormArray>this.myForm.get('rules');
  }
  addRule(data: any, ruleStatus: boolean, ruleVal: any,ruleOrder:any) {
    this.rules.push(this.formBuilder.group({
      id: [data.id, [Validators.required]],
      description: [data.description, [Validators.required]],
      ruleApply: [ruleStatus, [Validators.required]],
      ruleValue: [ruleVal],
      transferOrderValue:[ruleOrder],
      sensitivePostingValue:[ruleOrder],
      hardLocationServedValue:[ruleOrder],
      rule4Value: [ruleOrder]
    }));
  }
  myForm!: FormGroup;
  ruleMinTransferVal:Number=0;
  ruleNoTransferVal:Number=0;
  onSubmitRule() {
    //console.log('submit rule ', this.myForm.value, this.data.tagName);
    this.ruleMinTransferVal=this.myForm.value.rules[0].ruleValue;
    this.ruleNoTransferVal=this.myForm.value.rules[2].ruleValue;
    if(Number(this.ruleMinTransferVal) < Number(this.ruleNoTransferVal)){
      this.userService.openSnackBar("The value should be less then Minimum number of Years at one location for transfer (ie. "+ this.ruleMinTransferVal+".)");
      return;
    }
    if (this.myForm.invalid) return;
    let v = this.myForm.value;
    this.userService.submitRule(this.data.tagName, v["rules"]).subscribe({
      error: (error: any) => {
        console.log(error);
      },
      next: (result: any) => {
        this.dataService.changeMessage({ filterType: "refreshAppliedRules", value: v, eventType: "" });
        this.dialogRef.close();
        this.userService.openSnackBar("Please run Execute as the rules has been changed");

      }
    });
  }
  error:string='';
  onSubmitFilter() {
    //console.log('submit filter ', this.filterForm.value);
    if (this.filterForm.invalid) return;
    let v = this.filterForm.value;   
    
    this.userService.submitFilters(v).subscribe({
      error: (error: any) => {
        if(error.error.code==500){
          this.error=error.error.status;
        }
        console.log(error);
      },
      next: (result: any) => {
        this.dataService.changeMessage({ filterType: "refreshAppliedFilters", value: v, eventType: ""});
        this.dialogRef.close();
        this.userService.openSnackBar("Please run Execute as the Filters has been changed");

      }
    });
    
  }
  onSubmitAction() {
    console.log('submit action ', this.actionForm.value, this.data.subdata.selectRows);
    
    if (this.actionForm.invalid) return;
    let v = this.actionForm.value;    
    if(v.specificLocation!="0"){
      v.specificLocation=this.selectedLocationsAction;
    }
    console.log(v.specificLocation);
    this.userService.submitActions(v).subscribe({
      error: (error: any) => {
        console.log(error);
      },
      next: (result: any)=>{
        this.dataService.changeMessage({ filterType: "refreshAppliedActions", value: "", eventType: ""});
        this.dialogRef.close();
        this.userService.openSnackBar("Please run Execute as the actions has been changed");

      }
    });
    
  }
  getSelectedValueLabel(controlName: string, id: number) {
    if (controlName === 'departmentIds' && this.metadata.departments) {
      let dept = this.metadata.departments.find((d: any) => d.id === id);
      return dept?.deptName;
    } else if (controlName === 'directorateIds' && this.metadata.directorates) {
      let directorate = this.metadata.directorates.find((d: any) => d.id === id);
      return directorate?.directorate;
    } else if (controlName === 'disciplineIds' && this.metadata.disciplines) {
      let discipline = this.metadata.disciplines.find((d: any) => d.id === id);
      return discipline?.discipline;
    }  else if (controlName === 'designationIds' && this.metadata.designations) {
      let designation = this.metadata.designations.find((d: any) => d.id === id);
      return designation?.desigName;
    } else if (controlName === 'functionIds' && this.metadata.functions) {
      let func = this.metadata.functions.find((f: any) => f.id === id);
      return func?.name;
    } else if (controlName === 'subFunctionIds' && this.metadata.subfunctions) {
      let subFunc = this.metadata.subfunctions.find((sf: any) => sf.id === id);
      return subFunc?.name;
    } else if (controlName === 'empStatusIds' && this.metadata.empStatus) {
      let empStatus = this.metadata.empStatus.find((es: any) => es.id === id);
      return empStatus?.name;
    } else if (controlName === 'empGroupIds' && this.metadata.empGroups) {
      let empGroup = this.metadata.empGroups.find((eg: any) => eg.id === id);
      return empGroup?.name;
    } else if (controlName === 'gradeIds' && this.metadata.grades) {
      let grade = this.metadata.grades.find((g: any) => g.id === id);
      return grade?.grade;
    } else if (controlName === 'locationIds' && this.metadata.locations) {
      let location = this.metadata.locations.find((l: any) => l.id === id);
      return location?.location;
    } else if (controlName === 'genderIds' && this.metadata.genders) {
      let gender = this.metadata.genders.find((g: any) => g.id === id);
      return gender?.name;
    }
    return '';
  }
  
  onToggle(item: any) {
    console.log('item ', item)
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      name: '',
      description: '',
      price: ''
    });
  }
  get items(): FormArray {
    return <FormArray>this.orderForm.get('items');
  }
  addItem(): void {
    // this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  selectAllOptions(formControlName: string, options: any[],selectall:boolean) {
    const formControl = this.ff[formControlName];
    if(selectall){
    const allOptionIds = options.map((opt: any) => opt.id);
    formControl.patchValue(allOptionIds);
    } else {
        formControl.patchValue([]);
      }
    }
  selectAllDepartment=false;
  selectAllDirectorate=false;
  selectAllDiscipline=false;
  selectAllDesignation=false;
  selectAllFunction=false;
  selectAllSubFunction=false;
  selectAllEmpStatus=false;
  selectAllEmpGroup=false;
  selectAllGrade=false;
  selectAllLocation=false;
  selectAllDepartments() {
    this.selectAllDepartment=!this.selectAllDepartment;
    this.selectAllOptions('departmentIds', this.departments,this.selectAllDepartment);
  }
  selectAllDirectorates() {
    this.selectAllDirectorate=!this.selectAllDirectorate;
    this.selectAllOptions('directorateIds', this.directorates,this.selectAllDirectorate);
  }

  // Example usage for Discipline
  selectAllDisciplines() {
    this.selectAllDiscipline=!this.selectAllDiscipline;
    this.selectAllOptions('disciplineIds', this.disciplines,this.selectAllDiscipline);
  }
  selectAllDesignations() {
    this.selectAllDesignation=!this.selectAllDesignation;
    this.selectAllOptions('designationIds', this.designations,this.selectAllDesignation);
  }
  selectAllFunctions() {
    this.selectAllFunction=!this.selectAllFunction;
    this.selectAllOptions('functionIds', this.functions,this.selectAllFunction);
  }
  selectAllSubFunctions() {
    this.selectAllSubFunction=!this.selectAllSubFunction;
    this.selectAllOptions('subFunctionIds', this.subfunctions,this.selectAllSubFunction);
  }
  selectAllempStatus() {
    this.selectAllEmpStatus=!this.selectAllEmpStatus;
    this.selectAllOptions('empStatusIds', this.empStatus,this.selectAllEmpStatus);
  }
  selectAllEmpGroups() {
    this.selectAllEmpGroup=!this.selectAllEmpGroup;
    this.selectAllOptions('empGroupIds', this.empGroups,this.selectAllEmpGroup);
  }

  selectAllGrades() {
    this.selectAllGrade=!this.selectAllGrade;
    this.selectAllOptions('gradeIds', this.grades,this.selectAllGrade);
  }
  selectAllLocations() {
    this.selectAllLocation=!this.selectAllLocation;
    this.selectAllOptions('locationIds', this.locations,this.selectAllLocation);
  }

  selectedValues = [0,0,0,0];
  onSelectChange(event: any, n: number) {
    let value = event.target.value;
    this.selectedValues[n] = value;
  }
  selectedRadioValue=0;
  radioChange(event:any) {
    //console.log(event)
    this.selectedRadioValue = event.value;
  }
  groupBy(collection:any, property:string) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index== -1)
 {
            values.push(val);
            result.push(collection[i]);
        }
    }
    return result;
}


}
