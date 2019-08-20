import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';



@NgModule({
  declarations: [CompanyDetailsComponent],
  imports: [
    CommonModule
  ],
  exports: [CompanyDetailsComponent]
})
export class CompanyModule { }
