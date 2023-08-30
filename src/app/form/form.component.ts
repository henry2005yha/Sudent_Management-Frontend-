import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { RestService } from '../service/rest.service';
import { MessageService } from '../service/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../service/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {


  sub: any;
  param = "";
  imageData: any;
  imageName :any;
  uq:boolean = true;
  uqNrc:boolean = true;
  

  constructor(
    private fb: FormBuilder,
    private rest: RestService,
    private message: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params['syskey']) {
        // Parameter exists, go to get()
        this.param = params['syskey'];
        this.get(params['syskey']);
      }else{
        this.addRow()}
    });



  }
  registrationForm = this.fb.group({
    student_syskey: [''],
    student_id: ['', Validators.required],
    name: ['', Validators.required],
    nrc: ['', Validators.required],
    dob: ['', Validators.required],
    phone: ['', Validators.required],
    gender: ['', Validators.required],
    nationality: ['', Validators.required],
    address: ['', Validators.required],
    detail: new FormArray([])
  })

  async get(syskey: any) {
    let json = {
      "student_syskey": syskey
    };

    try {
      const res: any = await this.rest.post('service001/GetStudent', json).toPromise();
      this.imageName = { 'photo': res.photo };

      let detailArray = this.registrationForm.get('detail') as FormArray;
      detailArray.clear(); // Clear existing rows

      for (const detailItem of res.detail) {
        detailArray.push(this.fb.group({
          year: [detailItem.year, Validators.required],
          mark1: [detailItem.mark1, Validators.required],
          mark2: [detailItem.mark2, Validators.required],
          mark3: [detailItem.mark3, Validators.required],
          remark: [detailItem.remark, Validators.required],
        }));
      }

      this.registrationForm.patchValue({
        student_syskey: syskey,
        student_id: res.student_id,
        name: res.name,
        nrc: res.nrc,
        dob: res.dob,
        phone: res.phone,
        gender: res.gender,
        nationality: res.nationality,
        address: res.address,
      });
    
      this.getPhoto(this.imageName);
    } catch (error) {
      console.log("error get photo");
      
    }
  }

  get detail() {
    return this.registrationForm.get('detail') as FormArray;
  }

  get detailGroup() {

    return this.detail.controls as FormGroup[]
  }
  addRow() {
    this.detail.push(this.fb.group({
      year: ['', Validators.required],
      mark1: ['', Validators.required],
      mark2: ['', Validators.required],
      mark3: ['', Validators.required],
      remark: ['', Validators.required],
    }))
  }

  url = "";
  image = false;
  display(imageData: ArrayBuffer) {
    const blob = new Blob([imageData], { type: 'image/png' }); // Adjust the type if needed
    this.url = URL.createObjectURL(blob);
    this.imageData = blob;
    
  }
  onSelect(img: any) {
    if (img.target.files && img.target.files.length > 0) {
      const file = img.target.files[0];
      const reader = new FileReader();


      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.imageData = file;
      };

      reader.readAsDataURL(file);
     
    }
  }

  deleteRow(index: number) {
    this.detail.removeAt(index);
  }

  async save() {
    this.uq = true;
    const formData = this.registrationForm.getRawValue();
    if (this.imageData !== null) {
      try {
        console.log("photo is uploading"+this.imageData);
        
        const res: any = await this.rest.goUpload('service001/upload', this.imageData).toPromise();
        console.log('Upload response:', res);
      } catch (error) {
        console.error('Error uploading:', error);
      }
    }

    try {
      const res: any = await this.rest.post('service001/save', formData).toPromise();
      if(res.msg === "ID already exists"){
        this.uq = false;
      }
      else if (res.msg === "NRC already exists") {
        this.uqNrc = false;
      }
      else{
        this.message.openSnackBar(res.msg, '');
        this.router.navigate(['student']);
      }

     
    } catch (error) {
      console.error('Error posting data:', error);
      this.message.openSnackBar('Error posting data:', 'An error occurred');
    }

    

  }
  async getPhoto(imageName: any) {
      
      const imageResponse: any = await this.rest.getImage('service001/image',imageName).toPromise();
      this.display(imageResponse);
   
  }

  confirmDialog(): void {
    console.log(this.param);
    
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      // width: "350px",
      // height: "100px",
      position: { top: '40px' }

    });

    dialogRef.afterClosed().subscribe(async (dialogResult: any) => {
      if (dialogResult == true) {
        let json = {
          "student_syskey": this.param
        }
        const res: any = await this.rest.delete('service001/delete', json).toPromise();
        this.message.openSnackBar(res.msg, '');
        console.log(res.msg);
      }
    });
  }

}
