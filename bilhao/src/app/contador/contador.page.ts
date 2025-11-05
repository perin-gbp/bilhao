import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, effect, signal, viewChild } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToolbar, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, calendarOutline, heartOutline, refreshOutline } from 'ionicons/icons';
import { AgeService, AgeState } from '../core/age.service';
import { nf, formatSecondsAsDHMS } from '../shared/format';

import flatpickr from 'flatpickr';
import { Options as FlatpickrOptions } from 'flatpickr/dist/types/options';
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/airbnb.css';


@Component({
  selector: 'app-contador',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    AsyncPipe, DatePipe, IonInput
  ],
  templateUrl: './contador.page.html',
  styleUrls: ['./contador.page.scss']
})
export class ContadorPage implements AfterViewInit, OnDestroy {

  @ViewChild('birthInput') birthInput!: ElementRef<HTMLInputElement>;

  state = signal<AgeState>({
    birthISO: null,
    secondsLived: 0,
    nextBillionIndex: null,
    nextBillionAt: null,
    secondsToNextBillion: null,
  });

  nf = nf;
  fmtCountdown = formatSecondsAsDHMS;

  private fp?: FlatpickrInstance;
  currentYear = new Date().getFullYear();

  constructor(private age: AgeService) {
    addIcons({ timeOutline, calendarOutline, heartOutline, refreshOutline });

    this.age.ageState$.subscribe(s => this.state.set(s));
  }

  setBirth(event: CustomEvent) {
    const value = (event as any).detail.value as string; // ISO
    if (value) this.age.setBirthISO(value);
  }

  jumpToYear(yearInput: number | string | null | undefined) {
    const year = typeof yearInput === 'string' ? parseInt(yearInput, 10) : (yearInput ?? NaN);
    if (!Number.isFinite(year) || year < 1900 || year > this.currentYear) return;

    const baseISO = this.state().birthISO ?? new Date().toISOString();
    const current = new Date(baseISO);
    current.setFullYear(year as number);
    current.setSeconds(0, 0);

    this.setBirthFromDate(current);
  }

  private toLocalISOString(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = '00';
    const tz = -d.getTimezoneOffset();
    const sign = tz >= 0 ? '+' : '-';
    const tzh = pad(Math.floor(Math.abs(tz) / 60));
    const tzm = pad(Math.abs(tz) % 60);
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}${sign}${tzh}:${tzm}`;
  }

  setBirthFromDate(d: Date) {
    const isoLocal = this.toLocalISOString(d);
    this.age.setBirthISO(isoLocal);
    // reflete no input (quando usuário ajusta via atalhos)
    this.fp?.setDate(d, true);
  }

  clearBirth() {
    this.age.clearBirth();
    this.fp?.clear();
  }

  ngOnDestroy(): void {
    this.fp?.destroy();
  }

  ngAfterViewInit(): void {
    const options: FlatpickrOptions = {
      enableTime: true,
      time_24hr: true,
      allowInput: true,
      altInput: true,
      altFormat: 'd/m/Y H:i',
      dateFormat: 'Y-m-d H:i',
      defaultHour: 12,
      minuteIncrement: 1,
      minDate: '1900-01-01',
      maxDate: new Date(),
      locale: { firstDayOfWeek: 1 },
      defaultDate: this.state().birthISO ? new Date(this.state().birthISO!) : undefined,
      onChange: (dates: Date[]) => {
        const d = dates?.[0];
        if (d) this.setBirthFromDate(d);
      }
    };

    this.fp = flatpickr(this.birthInput.nativeElement, options);
  }

  openCalendar() {
    this.fp?.open();
  }
}
