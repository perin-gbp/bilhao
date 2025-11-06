import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent,
  IonHeader, IonIcon, IonItem, IonLabel, IonTitle, IonToolbar, IonModal,
  IonDatetime, IonDatetimeButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
  import { timeOutline, calendarOutline, heartOutline, refreshOutline } from 'ionicons/icons';

import { AgeService, AgeState } from '../core/age.service';
import { nf, formatSecondsAsDHMS } from '../shared/format';


type IonDatetimeEl = any;

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
export class ContadorPage implements OnDestroy {

  @ViewChild('picker', { read: ElementRef }) pickerRef!: ElementRef<IonDatetimeEl>;

  state: AgeState = {
    birthISO: null,
    secondsLived: 0,
    nextBillionIndex: null,
    nextBillionAt: null,
    secondsToNextBillion: null,
  };

  private readonly initialDisplayISO = this.toNaiveLocalISO(new Date());
  nf = nf;
  fmtCountdown = formatSecondsAsDHMS;
  currentYear = new Date().getFullYear();

  constructor(private age: AgeService) {
    addIcons({ timeOutline, calendarOutline, heartOutline, refreshOutline });
    this.age.ageState$.subscribe(s => this.state = s);
  }

  // ISO “local ingênuo”: sem Z e sem offset => impede drift de horas
  private toNaiveLocalISO(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
  }

  setBirthFromDate(d: Date) {
    const isoLocal = this.toNaiveLocalISO(d);
    this.age.setBirthISO(isoLocal);
    
    if (this.pickerRef?.nativeElement) {
      this.pickerRef.nativeElement.value = this.isoForDisplay(isoLocal);
    }
  }

  jumpToYear(yearInput: number | string | null | undefined) {
    const year = typeof yearInput === 'string' ? parseInt(yearInput, 10) : (yearInput ?? NaN);
    if (!Number.isFinite(year) || year < 1900 || year > this.currentYear) return;

    const baseStr =
      this.pickerRef?.nativeElement?.value ??
      this.state.birthISO ??
      this.toNaiveLocalISO(new Date());

    const base = new Date(baseStr);
    base.setFullYear(year as number);
    base.setSeconds(0, 0);

    const isoLocal = this.toNaiveLocalISO(base);
    this.age.setBirthISO(isoLocal);
    
    if (this.pickerRef?.nativeElement) {
      this.pickerRef.nativeElement.value = this.isoForDisplay(isoLocal);
    }
  }

  onDateSelected(event: any) {
    const v: string | undefined = event.detail?.value;
    if (!v) return;
    const date = new Date(v);
    const isoLocal = this.toNaiveLocalISO(date);
    this.age.setBirthISO(isoLocal);

    if (this.pickerRef?.nativeElement){
      this.pickerRef.nativeElement.value = this.isoForDisplay(isoLocal);
    }
  }

  clearBirth() {
    this.age.clearBirth();
    // limpa o visual do ion-datetime
    if (this.pickerRef?.nativeElement) {
      this.pickerRef.nativeElement.value = undefined;
    }
  }

  isoForDisplay(iso: string | null ): string {
    if (!iso){
      return this.initialDisplayISO;
    };

    const d = new Date(iso);
    d.setHours(d.getHours());
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  ngOnDestroy(): void {}
}
