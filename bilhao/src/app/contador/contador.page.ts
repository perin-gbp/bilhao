import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent,
  IonHeader, IonIcon, IonItem, IonLabel, IonTitle, IonToolbar, IonModal,
  IonDatetime, IonDatetimeButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, calendarOutline, heartOutline, refreshOutline } from 'ionicons/icons';

import flatpickr from 'flatpickr';
import type { Options as FlatpickrOptions } from 'flatpickr/dist/types/options';
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/airbnb.css';

import { AgeService, AgeState } from '../core/age.service';
import { nf, formatSecondsAsDHMS } from '../shared/format';

type IonDatetimeEl = HTMLIonDatetimeElement | any;

@Component({
  selector: 'app-contador',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonButton, IonIcon,
    NgIf, DatePipe, IonDatetime,
    IonDatetimeButton, IonModal
  ],
  templateUrl: './contador.page.html',
  styleUrls: ['./contador.page.scss']
})
export class ContadorPage implements AfterViewInit, OnDestroy {

  @ViewChild('birthInput') birthInput!: ElementRef<HTMLInputElement>;
  @ViewChild('picker', { read: ElementRef }) pickerRef!: ElementRef<IonDatetimeEl>;

  state: AgeState = {
    birthISO: null,
    secondsLived: 0,
    nextBillionIndex: null,
    nextBillionAt: null,
    secondsToNextBillion: null,
  };

  nf = nf;
  fmtCountdown = formatSecondsAsDHMS;
  private fp?: FlatpickrInstance;
  currentYear = new Date().getFullYear();

  constructor(private age: AgeService) {
    addIcons({ timeOutline, calendarOutline, heartOutline, refreshOutline });
    this.age.ageState$.subscribe(s => this.state = s);
  }

  ngAfterViewInit(): void {
    const confirmButtonPlugin = (onConfirm: (date: Date) => void) => {
      return (fpInstance: any) => {
        function buildPlugin() {
          const confirmBtn = document.createElement('button');
          confirmBtn.type = 'button';
          confirmBtn.textContent = 'Confirmar';
          confirmBtn.className = 'flatpickr-confirm-btn';
          confirmBtn.addEventListener('click', () => {
            const date = fpInstance.selectedDates[0];
            if (date) onConfirm(date);
            fpInstance.close();
          });

          return {
            onReady: () => {
              fpInstance.calendarContainer.appendChild(confirmBtn);
            },
          };
        }
        return buildPlugin();
      };
    };

    const options: FlatpickrOptions = {
      enableTime: true,
      time_24hr: true,
      altInput: true,
      altFormat: 'd/m/Y H:i',
      dateFormat: 'Y-m-d H:i',
      defaultHour: 12,
      minuteIncrement: 1,
      minDate: '1900-01-01',
      maxDate: new Date(),
      locale: { firstDayOfWeek: 1 },
      clickOpens: true,
      allowInput: false,
      static: false,
      defaultDate: this.state.birthISO ? new Date(this.state.birthISO) : undefined,
      plugins: [confirmButtonPlugin((d) => this.setBirthFromDate(d))],
    };

    this.fp = flatpickr(this.birthInput.nativeElement, options);
  }


  openCalendar() {
    this.fp?.open();
  }

  private toLocalISOString(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}`; // sem +03:00
  }

  setBirthFromDate(d: Date) {
    const isoLocal = this.toLocalISOString(d);
    this.age.setBirthISO(isoLocal);
    this.fp?.setDate(d, true);
  }

  jumpToYear(yearInput: number | string | null | undefined) {
    const year = typeof yearInput === 'string' ? parseInt(yearInput, 10) : (yearInput ?? NaN);
    if (!Number.isFinite(year) || year < 1900 || year > this.currentYear) return;

    const baseISO = this.state.birthISO ?? new Date().toISOString();
    const current = new Date(baseISO);

    const localOffset = current.getTimezoneOffset(); // em minutos
    current.setFullYear(year as number);
    current.setMinutes(current.getMinutes() - localOffset);
    current.setSeconds(0, 0);
    current.setMilliseconds(0);

    const isoUtc = current.toISOString();
    this.age.setBirthISO(isoUtc);

    if (this.pickerRef?.nativeElement){
      this.pickerRef.nativeElement.valueAsDate = isoUtc;
    }
  }

  clearBirth() {
    this.age.clearBirth();
    this.fp?.clear();
  }

  ngOnDestroy(): void {
    this.fp?.destroy();
  }

  onDateSelected(event: any) {
    const selected = event.detail?.value;
    if (!selected) return;

    const birth = new Date(selected);
    this.setBirthFromDate(birth);
  }
}
