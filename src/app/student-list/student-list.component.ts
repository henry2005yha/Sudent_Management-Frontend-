import { Component } from '@angular/core';
import { RestService } from '../service/rest.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ExcelImportComponent } from '../excel-import/excel-import.component';
import { MessageService } from '../service/message.service';
import {Sort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent {

  constructor(private rest: RestService, private route: Router, private dialog: MatDialog, private message: MessageService, ) { }

  totalListcount: number = 0;
  studentList: any;
  search: any = "";
  currentpage = 1;
  pagesize = 10;
  error:boolean = false;
  isloading:boolean= true;

  async ngOnInit() {
    await this.getStudentList();
  }

  async getStudentList() {
    let searchObj = {
      "pagesize": this.pagesize,
      "currentpage": this.currentpage,
      "searchval": this.search
    };
    this.studentList = [];
    try {
      const res: any = await this.rest.post('service001/StudentList', searchObj).toPromise();
      this.studentList = res.list;
      this.totalListcount = res.count; // Set the total count received from the server
      this.isloading = false;
      this.error = false;
      console.log(res); // Log the received data for debugging
    } catch (error) {
      console.error('Error fetching student data:', error);
      this.error = true;
      this.isloading = false;
      
    }
    console.log("done");

  }

  handlePageChange(event: any) {
    this.currentpage = event;
    this.getStudentList();
  }


  confirmDialog(syskey: any): void {

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      // width: "350px",
      // height: "100px",
      position: { top: '40px' }

    });

    dialogRef.afterClosed().subscribe(async (dialogResult: any) => {
      if (dialogResult == true) {
        let json = {
          "student_syskey": syskey
        }
        const res: any = await this.rest.delete('service001/delete', json).toPromise();
        this.message.openSnackBar(res.msg, '');
        console.log(res.msg);
        this.getStudentList();


      }
    });
  }
  async getStudent(syskey: any) {

    this.route.navigate(['student/register', syskey]);
  }

  async excelExport() {
    this.rest.downloadExcel('service001/excel').subscribe(data => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student.xlsx'; // Set the desired file name
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  showExcelDialog(){
    const dialogRef = this.dialog.open(ExcelImportComponent, {
      // width: "350px",
      // height: "100px",
      position: { top: '200px' }

    });
    dialogRef.afterClosed().subscribe(async (dialogResult: any) => {
      if (dialogResult === '') {
        
        this.message.openSnackBar(dialogResult, '');
        this.getStudentList();
      }
    });


  }

  refresh(){
    window.location.reload();
  }

  clean(){
    this.search="";
    this.getStudentList();
  }

  

  }





