import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, type: string) {
    this.snackBar.open(message, '', {
     horizontalPosition: 'center',
     verticalPosition: 'top',
     panelClass: ['snackbar', 'snackbar-' + type, 'mat-typography','custom-snackbar'],
     duration: 3000,
    });
  }
}
