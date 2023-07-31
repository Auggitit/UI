import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'IMS';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'vendorIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/shop.svg'
      )
    );

    this.matIconRegistry.addSvgIcon(
      'arrowDown',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/arrowDown.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'Search',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/Search.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'flagLine',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/flagLine.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'bankCardLine',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/bank-card-line.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'Export',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/Export.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'Download',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/DownloadVector.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'DeleteFile',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/delete-file.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'EditData',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/data-edit.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'Xls',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/xls.png'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'Pdf',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/pdf.png'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'Filter',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/Filter.svg'
      )
    );
    // this.matIconRegistry.addSvgIcon(
    //   'ReportsIcon',
    //   this.domSanitizer.bypassSecurityTrustResourceUrl(
    //     '../assets/icons/reportsIcon.svg'
    //   )
    // );
  }
}
