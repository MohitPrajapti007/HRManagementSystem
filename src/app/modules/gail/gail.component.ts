import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomDialogComponent } from 'src/app/_dialogs/custom-dialog/custom-dialog.component';
import { LoaderService } from 'src/app/interceptor/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UploadsComponent } from './uploads/uploads.component';
@Component({
  selector: 'app-gail',
  templateUrl: './gail.component.html',
  styleUrls: ['./gail.component.css']
})
export class GailComponent {
  activeTab = "home";
  dialogOpen=0;
  tagNames: string[] = ['-- SELECT --'];
  rules: any = [];
  metadataMenus: any = [];
  selectedCheckBoxes: any = [];
  varToggle = "Eligible";
  subscription: Subscription = new Subscription;
  constructor(private router: Router, private authService: AuthService, public loaderService: LoaderService, private dataService: DataService, private userService: UserService, private dialog: MatDialog) {
    let url = this.router.url || "";
    let doc = document.getElementsByTagName("body")[0];
    if (doc) {
      doc.classList.remove("body-background");
    }

    if (url.includes("home")) this.showTab("home");
    else if (url.includes("upload")) {
      this.showTab("upload");
    
  }
    else if (url.includes("report")) this.showTab("report");
    else if (url.includes("analytics")) this.showTab("analytics");
    else if (url.includes("metadata")) this.showTab("metadata");
    else if (url.includes("setting")) this.showTab("setting");
  }

  createNewFile(){
    this.updateFile=false;
    let filterValues = { filterType: "uploadNewFileFilter", value: this.selectedTag, eventType: "singleclick"};
      this.dataService.changeMessage(filterValues);
    // this.Uploadcomponent.updateOldFile=false;
    // this.uploadcomponent.UploadNewFile=true;
  }
  updateFile=false;
  updateOldFile(){
    this.updateFile=true;
    let filterValues = { filterType: "updateOldFileFilter", value: this.selectedTag, eventType: "singleclick"};
      this.dataService.changeMessage(filterValues);
    // this.uploadcomponent.UploadNewFile=false;
    // this.uploadcomponent.updateOldFile=true;
  }
  ngOnInit() {
    let filterValues = { filterType: "tagFilter", value: this.selectedTag, eventType: "singleclick"};
      this.dataService.changeMessage(filterValues);


    this.userService.getMetadataMenus().subscribe({
      error: (err: any) => {
        console.log('error ', err);
      },
      next: (result: any) => {
        this.metadataMenus = result.data;
      }
    });
    this.userService.getMasterDataUniqueTags().subscribe({
      error: (err: any) => {
        console.log('error ', err);
      },
      next: (result: any) => {
        this.tagNames = this.tagNames.concat(result.data);
      }
    });

    this.subscription = this.dataService.currentMessage.subscribe({
      next: (message: any) => {
        if (this.selectedTag && message.filterType == "refreshAppliedRules") {
          this.userService.getRules(this.selectedTag, "1").subscribe({
            error: (err: any) => {
              console.log('error ', err);
            },
            next: (result: any) => {
              this.rules = result.data;
            }
          });
        } else if (message.filterType == "uploadFilter") {
          this.tagNames = [];
          this.userService.getMasterDataUniqueTags().subscribe({
            error: (err: any) => {
              console.log('error ', err);
            },
            next: (result: any) => {
              this.tagNames = this.tagNames.concat(result.data);
              this.tagNames.forEach(tn => console.log(`tname >> ${tn}`));
            }
          });
        } else if (message.filterType == "checkBoxFilter") {
          this.selectedCheckBoxes = message.value.selectedValues;
          //this.dataService.changeMessage(this.filterValues);
        } else if (message.filterType == "tpStateChangeFilter") {
          this.tpStateChange(this.selectedTag, true);
        }
        else if (message.filterType == "searchFilter") {
          let rules = message.value;
          let disable = message.disable;
          this.dialogOpen=this.dialogOpen+1;
          if(this.dialogOpen==1){
            this.openDialog(rules, this.selectedTag, disable);
          }
        }
        else if (message.filterType == "popupFilter") {
          let rules = message.value;
          let disable = message.disable;
          this.dialogOpen=this.dialogOpen+1;
          if(this.dialogOpen==1){
            this.openDialog(rules, this.selectedTag, disable);
          }
        } else if (message.filterType == "recommendFilter") { // manipulate data before recommend
          this.recommendChanges();
        } else if (message.filterType == "refreshAppliedFilters") {
          let arr={value:"1"};
          this.onToggleGroupChange(arr);
          //this.onToggleValChange({}, "Filtered");
        }
        else if (message.filterType == "eligibleFilter") {
          let arr={value:"2"};
          this.onToggleGroupChange(arr);
          //this.onToggleValChange({}, "Filtered");
        } else if(message.filterType=="uploadNewFileFilter") {
          this.updateFile=false;
         }
         else if(message.filterType=="updateOldFileFilter"){
          this.updateFile=true;
         }
      }
    });

  }
  public openDialog(data: any, tagName: string, enable: boolean): void {
    let dialogRef = this.dialog.open(CustomDialogComponent, {
      disableClose: true,
      autoFocus: true,
      data: {
        tagName: tagName, subdata: data, enable: enable,
      },
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogOpen=0;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  showTab(tab: string) {
    switch (tab) {
      case "home":
        this.activeTab = "home";
        this.varToggle="All";
        break;
      case "upload": this.activeTab = "upload"; break;
      case "report":
        this.activeTab = "report";
        this.varToggle="All";
        break;
      case "analytics": this.activeTab = "analytics"; break;
      case "metadata": this.activeTab = "metadata"; break;
      case "setting": this.activeTab = "setting"; break;
    }
  }
  //filterValues = { years: 0, deptName: "", tagName: ""};
  filterValues = { filterType: "", value: {}, eventType: "none" };
  setRuleValue(value: any, filterType: string) {
    // emit event to fire event for open dialog
    this.filterValues = { filterType: filterType, value: value, eventType: "singleclick" };
    this.dataService.changeMessage(this.filterValues);
  }
  ruleSets: any = [];
  selectedTag = "-- SELECT --";

  onTagChanged(event: any) {
    this.tpStatus = "";
    let value = event.target.value;
    this.selectedTag = value;
    this.rules = [];
    this.ruleSets = [];
    if (value != "-- SELECT --") {
      this.counter = 0;
      if (this.repeatProcess)
        clearInterval(this.repeatProcess);
      this.tpStateChange(value);
    }

    this.filterValues = { filterType: "tagFilter", value: value, eventType: "singleclick" };
    this.dataService.changeMessage(this.filterValues);
  }
  getRules() {
    this.rules = [];
    this.ruleSets = [];
    this.userService.getRules(this.selectedTag, "1").subscribe({
      error: (err: any) => {
        console.log('error ', err);
      },
      next: (result: any) => {
        this.rules = result.data;
        this.ruleSets = result.detail;
      },
      complete: () => {
        let filterValues = { filterType: "popupFilter", value: { subject: 'rule', rules: this.rules, ruleset: this.ruleSets }, eventType: "dblclick", disable: false };
        this.dataService.changeMessage(filterValues);
      }
    });
  }
  setAllRuleValue() {
    this.getRules();
    // emit event to fire event for open dialog
    // this.filterValues = { filterType: "popupFilter", value: {subject: 'rule', rules: this.rules, ruleset: this.ruleSets }, eventType: "dblclick"};
    // this.dataService.changeMessage(this.filterValues);
  }
  setFilterValue() {
    let filters: any = [];
    if (this.selectedTag && this.selectedTag != "-- SELECT --") {
      this.userService.getFilters(this.selectedTag, "1").subscribe({
        next: (result: any) => {
          filters = result.data;
        },
        complete: () => {
          let filterValues = { filterType: "searchFilter", value: { subject: 'filter', filters: filters }, eventType: "dblclick", disable: false };
          this.dataService.changeMessage(filterValues);
        },
      });
    }

  }
  setActionValue() {
    let appliedActions: any = [];
    if (this.selectedTag && this.selectedTag != "-- SELECT --") {
      this.userService.getActions(this.selectedTag).subscribe({
        next: (result: any) => {
          appliedActions = result.data;
        },
        complete: () => {
          this.filterValues = { filterType: "actionFilter", value: { subject: 'action', actions: [], appliedActions: appliedActions, selectRows: this.selectedCheckBoxes }, eventType: "dblclick" };
          this.dataService.changeMessage(this.filterValues);
        },
      });
    }
  }
  onDoubleClick(rule: any) {
    this.filterValues = { filterType: "popupFilter", value: rule, eventType: "dblclick" };
    this.dataService.changeMessage(this.filterValues);
  }
  onMetadataClick(rule: any) {
    this.filterValues = { filterType: "DepartmentFilter", value: rule, eventType: "dblclick" };
    this.dataService.changeMessage(this.filterValues);
  }
  onToggleValChange(event: any, type: string) {
    let filterType = "";
    if (type == 'Eligible') {
      filterType = "eligibleFilter";
    } else if (type == 'Recommend') {
      filterType = "recommendListFilter";
    } else if (type == 'Actions') {
      filterType = "actionMarkedFilter";
    } else {
      filterType = "toggleFilter";
    }
    this.filterValues = { filterType: filterType, value: event.value, eventType: "dblclick" };
    this.dataService.changeMessage(this.filterValues);
  }

  onToggleGroupChange(event: any) {
    this.varToggle = event.value;
  }
  tpStatus: string = "";
  tpStatusDot: string = "";
  repeatProcess: any;
  counter = 0;
  forceToStart: boolean = false;
  tpStateChange(tagName: string, forceToStart?: boolean) {
    this.tpStatus = "";
    if(tagName=="-- SELECT --") return;
    let inputParams = { tagName: tagName };
    this.forceToStart = forceToStart || false;
    this.repeatProcess = setInterval(() => {
      if (this.counter >= 10) {
        clearInterval(this.repeatProcess);
        this.counter = 0;
      }
      if (this.forceToStart || (this.tpStatus != "Completed" && this.tpStatus != "Error")) {
        this.counter = this.counter + 1;
        if (this.counter % 3 == 0)
          this.tpStatusDot = "..|";
        if (this.counter % 3 == 1)
          this.tpStatusDot = "|..";
        if (this.counter % 3 == 2)
          this.tpStatusDot = ".|.";
        this.userService.getTPState(inputParams).subscribe({
          error: (err: any) => {
            console.log('error ', err);
          },
          next: (result: any) => {
            //   console.log('tpresult ', result);
            let mdd = result.data;
            if (mdd && mdd.tpstate) {
              switch (mdd.tpstate) {
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
                  this.forceToStart = false;
                  break;
                case -1:
                  this.tpStatus = "Error";
                  this.forceToStart = false;
                  break;
                default:
                  this.forceToStart = false;
              }
            } else {
              this.tpStatus = "Completed";
              this.forceToStart = false;
            }

          }
        });
      }
    }, 500);


  }
  onClickRecommend() {
    // push notification to recommend
    this.dataService.changeMessage({ filterType: "recommendFilter", value: "", eventType: "" });
  }

  public recommendChanges() {
    let inputParams = { tagName: this.selectedTag };
    this.userService.getRecommendedChanges(inputParams).subscribe({
      error: (err: any) => {
        console.log('error ', err);
      },
      complete: () => {
        let filterValues = { filterType: "tpStateChangeFilter", value: this.selectedTag, eventType: "singleclick" };
        this.dataService.changeMessage(filterValues);
      }
    });
  }
  public resetChanges() {
    let inputParams = { tagName: this.selectedTag };
    this.userService.getResetChanges(inputParams).subscribe({
      error: (err: any) => {
        console.log('error ', err);
      },
      complete: () => {
        let filterValues = { filterType: "tpStateChangeFilter", value: this.selectedTag, eventType: "singleclick" };
        this.dataService.changeMessage(filterValues);
      }
    });
  }

  navigateToReportPage() {
    // You can perform any logic before navigating if needed
    // For example, calling showTab('report') if required
    this.showTab('report');

    // Now, navigate to the report page
    this.router.navigate(['/gail/report']);
  }
  logout() {
    if(this.selectedTag && this.selectedTag!="-- SELECT --") {
      let filterValues = { filterType: "tagFilter", value: this.selectedTag, eventType: "singleclick"};
      this.dataService.changeMessage(filterValues);
    } else {
      this.dataService.changeMessage({});
    }    
    this.subscription.unsubscribe();
    this.authService.logout();
  }
}
