import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import JsBarcode from 'jsbarcode';
import { EnvasesService, ValeService } from '../../../shared/services';
import { DatePipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-ticket-layout',
  standalone: true,
  imports: [UpperCasePipe, NgFor, DatePipe, NgIf],
  templateUrl: './ticket-layout.component.html',
  styleUrls: ['./ticket-layout.component.sass'],
})
export class TicketLayoutComponent implements OnInit, OnChanges {
  constructor(
    private envaseSrv: EnvasesService,
    private valeSrv: ValeService
  ) {}

  public image: string =
    'data:image/png;base64,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';

  public envases: any = [];

  public ean: string = '';

  @Input() cabecera!: {
    fecha: string;
    usuario: string | undefined;
    ticket: string;
  };

  ngOnInit(): void {
    this.envaseSrv.getCargaEnvasesObservable().subscribe({
      next: (envases) => {
        this.envases = envases;
      },
      error: (err) => {
        this.envases = [];
      },
    });
    this.valeSrv.getEAN().subscribe((ean) => {
      this.ean = ean;
      console.log({ticketLayout: this.ean})
      this.generateEAN13Barcode()
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateEAN13Barcode();
  }

  generateEAN13Barcode = () => {
    if (this.ean !== '') {
      JsBarcode('#barcode', this.ean, {
        format: 'EAN13',
        lineColor: '#333',
        width: 1.5,
        height: 20,
        displayValue: true,
      });
    }
  };
}
