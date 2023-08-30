import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from '../service/rest.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.css']
})
export class ExcelImportComponent {
  constructor(public excelDialogRef: MatDialogRef<ExcelImportComponent>, private rest: RestService, private http: HttpClient) {}

  file:any;
  res:any;
  empty = '';

  async onConfirm(){
    console.log("in confirm");
    
    let formData = new FormData();
    formData.set('file', this.file);

   await this.http.post("http://localhost:8080/Student/module001/service001/import", formData)
    .subscribe(
      (response) => {
        // Handle success response if needed
        console.log("Import successful", response);
        this.res = response;
        console.log(this.res.msg);
        
        this.excelDialogRef.close(this.res.msg);
      },
      (error) => {
        // Handle error if the request fails
        console.error("Import failed", error);
      }
    );

    //this.excelDialogRef.close(this.res.msg);
  }

  onFileSelect(event:any){
    this.file = event.target.files[0];
    console.log('file',this.file);
    
  }

  onDismiss(): void {
    this.excelDialogRef.close(this.empty);
  }
 
  ngOnInit(): void {
   
  }
}
