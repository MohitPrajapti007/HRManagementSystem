import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private handler: HttpBackend, private _snackBar: MatSnackBar) { }
  openSnackBar(message: string, action?:string, time?:number) {  
    let config:any = { duration: (time||10 * 1000), horizontalPosition: "center", verticalPosition: "top",  }
    if(time==null) {
      delete config['duration'];
    }    
    this._snackBar.open(message, action||'Close', config);  
  }

  getUsers(data:any) {
    let params = new HttpParams();
    if(data.searchKey)
      params = params.set('searchKey', data.searchKey);  
    if(data.role && data.role!="null")
      params = params.set('role', data.role);            
    if(data.page>=0 && data.size>0){
      params = params.set('page', data.page);
      params = params.set('size', data.size);
    }   
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/users`, {params});
  }

  getMasterData(data:any) {
    let params = new HttpParams();
    if(data.searchKey)
      params = params.set('searchKey', data.searchKey);  
    if(data.role && data.role!="null")
      params = params.set('role', data.role);            
    if(data.page>=0 && data.size>0){
      params = params.set('page', data.page);
      params = params.set('size', data.size);
    }
    if(data.id){
      params = params.set('id',data.id);
    }
    if(data.tagName /*&& data.tagName!='-- SELECT --'*/) {
      params = params.set('tagName', data.tagName);   
    }
    if(data.name) {
      params = params.set('name', data.name);   
    }
    if (data.filterData > 0) {
      
    }
    params = params.set('filterData', data.filterData ? data.filterData: 0);
    if (data.departmentFlag > 0) {
      params = params.set('departmentFlag', data.departmentFlag);
    }
    if (data.directorateFlag > 0) {
      params = params.set('directorateFlag', data.directorateFlag);
    }
    if (data.desciplineFlag > 0) {
      params = params.set('desciplineFlag', data.desciplineFlag);
    }
    if (data.designationFlag > 0) {
      params = params.set('designationFlag', data.designationFlag);
    }
    if (data.functionFlag > 0) {
      params = params.set('functionFlag', data.functionFlag);
    }
    if (data.subfunctionFlag > 0) {
      params = params.set('subfunctionFlag', data.subfunctionFlag);
    }
    if (data.empstatusFlag > 0) {
      params = params.set('empstatusFlag', data.empstatusFlag);
    }
    if (data.empgroupFlag > 0) {
      params = params.set('empgroupFlag', data.empgroupFlag);
    }
    if (data.gradeFlag > 0) {
      params = params.set('gradeFlag', data.gradeFlag);
    }
    if (data.locationFlag > 0) {
      params = params.set('locationFlag', data.locationFlag);
    }
    if (data.genderFlag > 0) {
      params = params.set('genderFlag', data.genderFlag);
    }    
    if (data.eligiblityCheck > 0) {
      params = params.set('eligiblityCheck', data.eligiblityCheck);
    }
    if (data.actionCheck > 0) {
      params = params.set('actionCheck', data.actionCheck);
    }
    if (data.analytics > 0) {
      params = params.set('analytics', data.analytics);
    }
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/master-data`, {params});
  }
  
  getMasterDataUniqueTags() {
    let params = new HttpParams();
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/tagnames`, {params});
  }

  addUser(body: any) {
    return this.httpClient.post(`${environment.config.apiContextUrl}/secure/users`, body);
  }

  registerUser(body: any) {
    return this.httpClient.post(`${environment.config.apiContextUrl}/public/register-student`, body);
  }

  getRules(tagName?: string,status?:string) {
    let params = new HttpParams();
    if (tagName) {
      params = params.set('tagName', tagName);
    }
    if (status){
      params = params.set('status',status);
    }
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/rules`, {params});
  }

  getMetadataMenus() {
    let params = new HttpParams();
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/metadata-menus`, {params});
  }

  submitRule(tagName: string, body: any) {
    let params = new HttpParams();
    if (tagName) {
      params = params.set('tagName', tagName);
    }
    return this.httpClient.post(`${environment.config.apiContextUrl}/secure/rule`, body, {params});
  }
  getFilters(tagName?: string,status?: string) {
    let params = new HttpParams();
    if (tagName) {
      params = params.set('tagName', tagName);
    }
    if (status){
      params = params.set('status',status);
    }
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/filter`, {params});
  }

  submitFilters(body: any) {
    return this.httpClient.post(`${environment.config.apiContextUrl}/secure/filter`, body);
  }
  getActions(tagName?: string) {
    let params = new HttpParams();
    if (tagName) {
      params = params.set('tagName', tagName);
    }
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/action`, {params});
  }
  submitActions(body: any) {
    return this.httpClient.post(`${environment.config.apiContextUrl}/secure/action`, body);
  }
  getRecommendedChanges(data:any) {
    let params = new HttpParams();
    if (data.tagName) {
      params = params.set('tagName', data.tagName);
    }
    console.log(`getRecommendedChanges params >> ${params}`);
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/recommend-changes`, {params});
  }
  getResetChanges(data:any) {
    let params = new HttpParams();
    if (data.tagName) {
      params = params.set('tagName', data.tagName);
    }
    console.log(`getResetChanges params >> ${params}`);
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/reset-recommend`, {params});
  }
  getDepartmentsName() {
    let params = new HttpParams();
    console.log(`getRecommendedChanges params >> ${params}`);
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/departments`, {params});
  }
  getDesignation() {
    let params = new HttpParams();
    console.log(`getRecommendedChanges params >> ${params}`);
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/getDesignationList`, {params});
  }
  getDirectorate() {
    let params = new HttpParams();
    console.log(`getRecommendedChanges params >> ${params}`);
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/getDirectorateList`, {params});
  }
  changePassword(changePasswordDTO: any) {
    return this.httpClient.post(`${environment.config.apiContextUrl}/secure/change-password`, changePasswordDTO);
  }
  getManningReports(tagName?: string) {
    let params = new HttpParams();
    if (tagName) {
      params = params.set('tagName', tagName);
    }
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/stdManningReports`, {params});
  }
  
  getTPState(data:any) {
    let params = new HttpParams();
    if (data.tagName) {
      params = params.set('tagName', data.tagName);
    }
    let value = localStorage.getItem(`gaz7LiAx`) || "{token:null}";

    const headers = new HttpHeaders({ 
          'Authorization' : JSON.parse(value).token,
          'timezone': `${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
          'Access-Control-Allow-Origin': `*`,
          'Accept-Language': `en`
      });

    let httpClient = new HttpClient(this.handler);
	  return httpClient.get(`${environment.config.apiContextUrl}/secure/process-status`, {params, headers: headers});
  }
  getTPWholeState(tagName?: string){
    let params = new HttpParams();
    if (tagName) {
      params = params.set('tagName', tagName);
    }
    return this.httpClient.get(`${environment.config.apiContextUrl}/secure/transfer-process-detail`,{params});
  }

  uploadContents(data: any, file1: File, file2?: File, file3?: File, sensitivePositionFile?: File, tpcFile?: File,plManningFile?: File, mutualFileTrans?:File) {
    const formData: FormData = new FormData();
   // const blob = new Blob([JSON.stringify(data)], {  type: 'application/json' });
  //  formData.append('requestBody', blob);
      formData.append('tagName', data);
      if(file1) { formData.append('file1', file1, file1.name); }  
      if(file2) { 
        formData.append('file2', file2, file2.name);
      } 
      if(file3) { formData.append('file3', file3, file3.name);}  
      if(sensitivePositionFile) { 
        formData.append('sensitivePositionFile', sensitivePositionFile, sensitivePositionFile.name);
      }  
      if(tpcFile) { formData.append('tpcFile', tpcFile, tpcFile.name); }  
      if (plManningFile) {formData.append('plManningFile', plManningFile, plManningFile.name); }
      if(mutualFileTrans) { formData.append('mutualTransferFile', mutualFileTrans, mutualFileTrans.name); }  
    
    return this.httpClient.post(`${environment.config.apiContextUrl}/secure/upload`, formData, { responseType: "arraybuffer"});
  }
  uploadContents2(data: any, apeName: string, file1: File, file2: File, comment:string) {
    const formData: FormData = new FormData();
      formData.append('tagName', data);
      formData.append('listName', apeName);
      formData.append('comment', comment);
      if(file1) { 
        formData.append('gradeFile', file1, file1.name);
      }  
      if(file2) { 
        formData.append('locationFile', file2, file2.name);
      } 

    //return this.httpClient.post(`${environment.config.apiContextUrl}/secure/upload`, formData, {responseType: "text"}); // application/zip
    return this.httpClient.post(`${environment.config.apiContextUrl}/secure/upload-old`, formData, { responseType: "arraybuffer"});
  }
  getStdManning(tagName?: string){
    let params = new HttpParams();
    if (tagName) {
      params = params.set('tagName', tagName);
    }
    return this.httpClient.get(`${environment.config.apiContextUrl}/secure/stdManning`,{params});
  }
  getMetadata() {    
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/metadata`);
  }
  countMasterdata(body: any) {    
	  return this.httpClient.post(`${environment.config.apiContextUrl}/secure/count-masterdata`, body);
  }
  getReports(data?: any) {    
    let params = new HttpParams();
    if (data && data.tagName) {
      params = params.set('tagName', data.tagName);
    }
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/reports`, {params});
  }

  deleteActions(id:number, tagName: string, actionName:string) {    
    let params = new HttpParams();
    if (actionName) {
      params = params.set('action', actionName);
    }
    return this.httpClient.delete(`${environment.config.apiContextUrl}/secure/action/${id}/${tagName}`, {params});
  }
  getLocations() {    
    let params = new HttpParams();
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/locations`, {params});
  }
  getMasterdataForAnalytics(data:any) {    
    let params = new HttpParams();
    if (data && data.tagName) { params = params.set('tagName', data.tagName);  }
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/master-data-for-analytics`, {params});
  }
  exportexcel(element:any, fileName:string): void 
  {
     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     XLSX.writeFile(wb, fileName);			
  }
  exportexcelbyFilter(element:any, fileName:string,additionalData:any): void 
  {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // Create a new workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Add the original worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Include additional data in a separate worksheet
    if (additionalData) {
      const additionalWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet([additionalData], { header: ['FilterApplied'] });
      XLSX.utils.book_append_sheet(wb, additionalWs, 'Filter Applied');
    }

    

    // Save the workbook to a file
    XLSX.writeFile(wb, fileName + '.xlsx');
  }		
  
  getUploadedOldFileData(data: any) {
    return this.httpClient.post(`${environment.config.apiContextUrl}/secure/getUploadedOldFileData`, data);
  }
}