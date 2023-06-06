import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent implements OnInit {
  acquisitionTaxRates: number[] = [0.01, 0.03];
  municipalEduTaxRates: number[] = [0.001, 0.004];
  ruralTaxRates: number[] = [0.002, 0.006, 0.01];

  isRegulatedArea: boolean = true;
  isWeightedTax: boolean = false;

  acquisitionTaxRate: number = 0;
  municipalEduTaxRate: number = 0;
  ruralTaxRate: number = 0;
  acquisitionTax: number = 0;
  municipalEduTax: number = 0;
  ruralTax: number = 0;

  estimatedTaxTotal: number = 0;
  estimatedTotal: number = 0;
  firstBuyDiscount: number = 0;
  test!: string;
  form!: FormGroup;
  constructor() {
    this.form = new FormGroup({
      firstBuy: new FormControl(false),
      isOver: new FormControl(false),
      price: new FormControl(null),
      bid: new FormControl(null),
      liability: new FormControl(null),
      address: new FormControl(''),
      multiHomeOrCorporate: new FormControl(0),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.calculateAcquisitionTax();
    this.calculateMunicipalEduTax();
    this.calculateRuralTax();
    this.estimatedTaxTotal =
      this.acquisitionTax +
      this.municipalEduTax +
      this.ruralTax -
      this.firstBuyDiscount;
    this.estimatedTotal =
      this.form.value.bid +
      this.acquisitionTax +
      this.municipalEduTax +
      this.ruralTax +
      this.form.value.liability -
      this.firstBuyDiscount;
  }

  calculateAcquisitionTax() {
    if (this.form.value.firstBuy) {
      console.log('first');
      if (this.form.value.price <= 150000000) {
        this.acquisitionTax = 0;
      } else {
        this.acquisitionTaxRate = this.acquisitionTaxRates[0];
      }
      this.acquisitionTax = this.form.value.price * this.acquisitionTaxRate;
      this.firstBuyDiscount = this.acquisitionTax / 2;
      this.isWeightedTax = false;
      return;
    }

    if (this.form.value.price <= 100000000) {
      this.isWeightedTax = false;
      this.acquisitionTaxRate = this.acquisitionTaxRates[0];
    } else {
      if (this.form.value.multiHomeOrCorporate <= 1) {
        this.isWeightedTax = false;
        if (this.form.value.price < 600000000) {
          this.acquisitionTaxRate = this.acquisitionTaxRates[0];
        } else if (this.form.value.price <= 900000000) {
          this.acquisitionTaxRate = +(
            (this.form.value.price * (2 / 300000000) - 3) *
            (1 / 100)
          ).toFixed(4);
        } else {
          this.acquisitionTaxRate = this.acquisitionTaxRates[1];
        }
      } else if (this.form.value.multiHomeOrCorporate == 2) {
        this.isWeightedTax = true;
        if (this.isRegulatedArea) {
          this.acquisitionTaxRate = 0.08;
        } else {
          this.acquisitionTaxRate = 0.03;
        }
      } else if (this.form.value.multiHomeOrCorporate == 3) {
        this.isWeightedTax = true;
        if (this.isRegulatedArea) {
          this.acquisitionTaxRate = 0.12;
        } else {
          this.acquisitionTaxRate = 0.08;
        }
      } else {
        this.isWeightedTax = true;
        this.acquisitionTaxRate = 0.12;
      }
    }

    this.acquisitionTax = this.form.value.price * this.acquisitionTaxRate;
  }

  calculateMunicipalEduTax() {
    console.log(this.acquisitionTaxRate)
    if (this.acquisitionTaxRate < 0.03) {
      this.municipalEduTaxRate = this.municipalEduTaxRates[0];
    } else if (this.acquisitionTaxRate < 0.08) {
      this.municipalEduTaxRate = +(
        (this.form.value.price * (2 / 300000000 - 3) * (1 / 100)) /
        10
      ).toFixed(4);
    } else {
      this.municipalEduTaxRate = this.municipalEduTaxRates[1];
    }
    this.municipalEduTax = this.form.value.price * this.municipalEduTaxRate;
  }

  calculateRuralTax() {
    if (this.form.value.isOver) {
      if (this.acquisitionTaxRate < 0.08) {
        this.ruralTaxRate = this.ruralTaxRates[0];
      } else if (this.acquisitionTaxRate < 0.12) {
        this.ruralTaxRate = this.ruralTaxRates[1];
      } else {
        this.ruralTaxRate = this.ruralTaxRates[2];
      }
    }
    this.ruralTax = this.form.value.price * this.ruralTaxRate;
  }

  onPriceChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
  }
}
