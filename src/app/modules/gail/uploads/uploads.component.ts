import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent {
  context = environment.config.context;
  currentFile?: File;
  progress = 0
  message = '';
  selectedTagName:string ='';
  fileName = 'Select File';
  fileInfos?: Observable<any>;
  myForm:FormGroup;
  oldFileForm:FormGroup;
  constructor(private formBuilder: FormBuilder, private dataService: DataService, private userService: UserService) {
    this.myForm = this.formBuilder.group({
      detail: ['', [Validators.required]],
      empDetailFile: [this.fileAttr, [Validators.required]],
      locDetailFile: [this.fileAttr],
      mobilityConstraintsDetailFile: [this.fileAttr],
      sensitivePositionFile: [this.fileAttr],
      tpcFile: [this.fileAttr],
      plManningFile: [this.fileAttr],
      mutualTransFile: [this.fileAttr],  
    });
    this.oldFileForm = this.formBuilder.group({
      detail: ['', [Validators.required]],
      gradeFile: [this.fileAttr, []],
      locationFile: [this.fileAttr],
      comment: []
    });
    
  }
  uploadNewFile=true;
  // updateOldFile=true;
  subscription: Subscription = new Subscription;
  ngOnInit(){

    this.subscription = this.dataService.currentMessage.subscribe((message:any) => {
      if(message.filterType=="tagFilter") {
        this.selectedTagName = message.value;
      }
      if(message.filterType=="uploadNewFileFilter") {
       // this.userService.openSnackBar("Please pick a file.");
       this.selectedTagName = message.value;
       this.uploadNewFile=true;
      }
      else if(message.filterType=="updateOldFileFilter"){
        this.selectedTagName = message.value;
        this.uploadNewFile=false;
      }
    });

    let filterValues = { filterType: "uploadNewFileFilter", value: this.selectedTagName, eventType: "singleclick"};
    this.dataService.changeMessage(filterValues);
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
  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    } else {
      this.fileName = 'Select File';
    }
  }

  get f() {
    return this.myForm.controls;
  }
  get of() {
    return this.oldFileForm.controls;
  }
  errorHandling(controlName:string, required:string) {
    return this.f[controlName].hasError(required);
  }
  errorHandlingOf(controlName:string, required:string) {
    return this.of[controlName].hasError(required);
  }
  @ViewChild('empfileInput') empfileInput: ElementRef | any;
  @ViewChild('locfileInput') locfileInput: ElementRef | any;
  @ViewChild('mobilityConstraintsDetailFileInput') mobilityConstraintsDetailFileInput: ElementRef | any;
  @ViewChild('sensitivePositionFileInput') sensitivePositionFileInput: ElementRef | any;
  @ViewChild('tpcFileInput') tpcFileInput: ElementRef | any;
  @ViewChild('plManningFileInput') plManningFileInput: ElementRef | any;

  @ViewChild('gradeFileInput') gradefileInput: ElementRef | any;
  @ViewChild('locationFileInput') locationfileInput: ElementRef | any;
  @ViewChild('mutualTransfileInput') mtfileInput: ElementRef | any;
  fileAttr = 'Choose File';
  file1:any;
  file2:any;
  file3:any;
  fileSensitivePosition:any;
  fileTpc:any;
  filePlManning: any;

  fileGrade: any;
  fileLocation: any;
  fileMutualTrans: any;

  uploadFileEvt(event: any, fileno: string) {
    let files = event.target.files;
    if (files && files.length>0) {
      switch(fileno) {
        case '1': this.file1 = files[0]; this.f['empDetailFile'].setValue(files[0].name);break;
        case '2': this.file2 = files[0]; this.f['locDetailFile'].setValue(files[0].name);break;
        case '3': this.file3 = files[0]; this.f['mobilityConstraintsDetailFile'].setValue(files[0].name);break;
        case '4': this.fileSensitivePosition = files[0]; this.f['sensitivePositionFile'].setValue(files[0].name);break;
        case '5': this.fileTpc = files[0]; this.f['tpcFile'].setValue(files[0].name);break;
        case '6': this.filePlManning = files[0]; this.f['plManningFile'].setValue(files[0].name); break;
        case '7': this.fileGrade = files[0]; this.of['gradeFile'].setValue(files[0].name); break;
        case '8': this.fileLocation = files[0]; this.of['locationFile'].setValue(files[0].name); break;
        case '9': this.fileMutualTrans = files[0]; this.f['mutualTransFile'].setValue(files[0].name); break;
      }
      
    } else {
      switch(fileno) {
        case '1': this.file1 = null; this.f['empDetailFile'].setValue(this.fileAttr);break;
        case '2': this.file2 = null; this.f['locDetailFile'].setValue(this.fileAttr);break;
        case '3': this.file3 = null; this.f['mobilityConstraintsDetailFile'].setValue(this.fileAttr);break;
        case '4': this.fileSensitivePosition = null; this.f['sensitivePositionFile'].setValue(this.fileAttr);break;
        case '5': this.fileTpc = null; this.f['tpcFile'].setValue(this.fileAttr);break;
        case '6': this.filePlManning = null; this.f['plManningFile'].setValue(this.fileAttr); break;
        case '7': this.fileGrade = null; this.of['gradeFile'].setValue(this.fileAttr);break;
        case '8': this.fileLocation = null; this.of['locationFile'].setValue(this.fileAttr); break;
        case '9': this.fileMutualTrans = null; this.f['mutualTransFile'].setValue(this.fileAttr); break;
      }
      
    }
  }

  resetform() {
    this.myForm.reset();
    this.file1 = null; this.f['empDetailFile'].setValue(this.fileAttr);
    this.file2 = null; this.f['locDetailFile'].setValue(this.fileAttr);
    this.file3 = null; this.f['mobilityConstraintsDetailFile'].setValue(this.fileAttr);
    this.fileSensitivePosition = null; this.f['sensitivePositionFile'].setValue(this.fileAttr);
    this.fileTpc = null; this.f['tpcFile'].setValue(this.fileAttr);
    this.filePlManning = null; this.f['plManningFile'].setValue(this.fileAttr);
    this.fileMutualTrans = null; this.f['mutualTransFile'].setValue(this.fileAttr);
    this.empfileInput.nativeElement.value = '';
    this.locfileInput.nativeElement.value = '';
    this.mobilityConstraintsDetailFileInput.nativeElement.value = '';
    this.sensitivePositionFileInput.nativeElement.value = '';
    this.tpcFileInput.nativeElement.value = '';
    this.plManningFileInput.nativeElement.value = '';
    this.mtfileInput.nativeElement.value = '';
  }

  resetOldFileform() {
    this.oldFileForm.reset();
    this.fileGrade = null; this.of['gradeFile'].setValue(this.fileAttr);
    this.fileLocation = null; this.of['locationFile'].setValue(this.fileAttr);

    this.gradefileInput.nativeElement.value = '';
    this.locationfileInput.nativeElement.value = '';
    this.showTable = false;
  }

  submitForm(formValue: any) {
    //console.log(formValue);  
    if(!this.file1)  {
      this.f['empDetailFile'].setErrors({required:true}); return;
    }
    if(this.myForm.invalid) {
      return;
    }

    this.userService.uploadContents(formValue.detail , this.file1, this.file2, this.file3, this.fileSensitivePosition, this.fileTpc,this.filePlManning, this.fileMutualTrans ).subscribe({
      error: (error:any)=>{
        //console.log('error ', error);
        if(error.status == 400 || error.status == 500) {    
          let enc = new TextDecoder("utf-8");
          let arr = new Uint8Array(error.error);  
          let decodeStr = enc.decode(arr);
          try {
            let obj = JSON.parse(decodeStr) as any;    
            this.userService.openSnackBar(obj.message);
          } catch (error) {
            //console.log('parseerror ', error);
            if(arr && arr.length>0){
              this.extractZip(arr);              
            }
            this.userService.openSnackBar("Error occured in upload process");
          }
          
        }
      },
      next: (result:any)=>{
       // console.log('detail ', result);
        if(result == null){
          this.userService.openSnackBar("Try again file is not supporting format");
          //console.log("Try again file is not supporting format");
        }else{
          this.extractZip(result);
          this.dataService.changeMessage({ filterType: "uploadFilter", value: formValue.detail, eventType: ""});
        }  
        this.message = "Upload process has been completed";
        this.userService.openSnackBar("Upload process has been completed");
      },
      complete: ()=>{
        this.resetform();
      }
    });

  }

  submitOldFileForm(formValue: any) {
    if(this.selectedTagName=="" || this.selectedTagName==null || this.selectedTagName==undefined || this.selectedTagName=="-- SELECT --") {
      this.userService.openSnackBar("Please select tag name");
      return;
    }
    if(!this.fileGrade && !this.fileLocation)  {
      this.of['locationFile'].setErrors({required:true}); return;
    }
    if(this.oldFileForm.invalid) {
      return;
    }
    this.userService.uploadContents2( this.selectedTagName, formValue.detail , this.fileGrade, this.fileLocation, formValue.comment ).subscribe({
      error: (error:any)=>{
        //console.log('error ', error);
        if(error.status == 400 || error.status == 500) {    
          let enc = new TextDecoder("utf-8");
          let arr = new Uint8Array(error.error);  
          let decodeStr = enc.decode(arr);
          try {
            let obj = JSON.parse(decodeStr) as any;    
            this.userService.openSnackBar(obj.message);
          } catch (error) {
            //console.log('parseerror ', error);
            if(arr && arr.length>0){
              this.extractZip(arr);              
            }
            this.userService.openSnackBar("Error occured in upload process");
          }
          
        }
      },
      next: (result:any)=>{
       // console.log('detail ', result);
        if(result == null){
          this.userService.openSnackBar("Try again file is not supporting format");
        }else{
          this.extractZip(result);
          this.dataService.changeMessage({ filterType: "uploadFilter", value: formValue.detail, eventType: ""});
        }  
        this.message = "Upload process has been completed";
        this.userService.openSnackBar("Upload process has been completed");
      },
      complete: ()=>{
        this.resetOldFileform();
      }
    });
  }//['EmpNo', 'Employee Name', 'New Grade', 'Reference Name', 'File Name', 'Comment', 'Created On'];
  gradeDefinedColumns:any=['empId', 'empName', 'newGrade', 'referenceName', 'fileName', 'comment', 'createdOn'];
  gradeColumnName:any = {
    'empId': 'Emp No', 'empName': 'Employee Name', 'newGrade': 'New Grade', 'referenceName':'Reference Name', 'fileName': 'File Name', 'comment': 'Comment', 'createdOn': 'Created On'
  }
  gradeColumnsToDisplay:any=['empId', 'empName', 'newGrade', 'referenceName', 'fileName', 'comment', 'createdOn'];
  gradeDataSource: any = new MatTableDataSource([]);
  locationDefinedColumns:any=['empId', 'empName', 'presentGrade','presentLocation','transferedLocation', 'newFunctionName', 'referenceName','remarks','fileName','comment','createdOn'];
  locationColumnsToDisplay:any=['empId', 'empName', 'presentGrade','presentLocation','transferedLocation', 'newFunctionName', 'referenceName','remarks','fileName','comment','createdOn'];
  locationColumnName:any = {
    'empId': 'Emp No', 'empName': 'Employee Name', 'presentGrade':'Present Grade','presentLocation':'Present Location','transferedLocation':'Transfered Location', 'newFunctionName':'New FunctionName', 'referenceName':'Reference Name','remarks': 'Remarks', 'fileName': 'File Name', 'comment': 'Comment', 'createdOn': 'Created On'
  }
  locationDataSource: any = new MatTableDataSource([]);

  showTable:boolean = false;
  gradeReferences:any = [];
  locationReferences:any = [];
  resultdata:any = [];
  showFileHistoryOnTabClick(tab:any) {
    this.gradeDefaultValue = "";
    this.locationDefaultValue = "";
    let data:any = {};
    if(tab.index==0) {
      data.grade = this.selectedTagName;
    } else if(tab.index==1) {
      data.location = this.selectedTagName;
    }
    if(tab.index==0||tab.index==1){
      this.resultdata = [];
      this.userService.getUploadedOldFileData(data).subscribe({
        next: (result:any)=>{          
          this.resultdata = result.data;
        },
        complete: ()=>{
          if(tab.index==0) {
            this.gradeReferences = this.resultdata.map((r:any)=>r.referenceName).filter((value:string, index:number, current_value:string) => current_value.indexOf(value) === index);
            this.gradeDataSource = new MatTableDataSource(this.resultdata);
          } else if(tab.index==1){
            this.locationReferences = this.resultdata.map((r:any)=>r.referenceName).filter((value:string, index:number, current_value:string) => current_value.indexOf(value) === index);
            this.locationDataSource = new MatTableDataSource(this.resultdata);
          }
        }
      });
    }
  }
  gradeDefaultValue = "";
  locationDefaultValue = "";
  onReferenceChange(event:any, tabIndex:number){
    let data = [];
    if(tabIndex==0) {  
      if(event.target.value) {
        data = this.resultdata.filter((r:any)=>r.referenceName==event.target.value); 
      } else {
        data = this.resultdata;
      }       
      this.gradeDataSource = new MatTableDataSource(data);
    } else if(tabIndex==1) {
      if(event.target.value){
        data = this.resultdata.filter((r:any)=>r.referenceName==event.target.value); 
      } else {
        data = this.resultdata;
      }
      this.locationDataSource = new MatTableDataSource(data);
    }
  }
  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/zip' });
    const fileName = 'CSV_CONTENT.ZIP';
    //saveAs(blob, fileName);
    this.extractZip(saveAs(blob, fileName));
  }
  

  async extractZip(file: any) {
    const zip = new JSZip();
    const extractedFiles = await zip.loadAsync(file);
    extractedFiles.forEach(async (relativePath, file) => {
      const content = await file.async("string");
      let blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, relativePath);
    });
  }
}
