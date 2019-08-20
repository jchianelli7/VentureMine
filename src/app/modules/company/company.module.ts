import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';



@NgModule({
  declarations: [CompanyDetailsComponent, EditCompanyComponent],
  imports: [
    CommonModule
  ],
  exports: [CompanyDetailsComponent]
})
export class CompanyModule { }
