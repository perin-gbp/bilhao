import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

const STORAGE_KEY = 'birthISO'; 
const BILLION = 1_000_000_000;
const TICK_MS = 1000; 

export interface AgeState {
  birthISO: string | null;
  secondsLived: number;           
  nextBillionIndex: number | null; 
  nextBillionAt: Date | null;     
  secondsToNextBillion: number | null;
}

@Injectable({ providedIn: 'root' })
export class AgeService {
  private sub?: Subscription;
  private state$ = new BehaviorSubject<AgeState>({
    birthISO: null,
    secondsLived: 0,
    nextBillionIndex: null,
    nextBillionAt: null,
    secondsToNextBillion: null,
  });

  constructor(private zone: NgZone) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) this.setBirthISO(saved);
  }

  get ageState$() {
    return this.state$.asObservable();
  }

  setBirthISO(iso: string) {
    localStorage.setItem(STORAGE_KEY, iso);
    const birth = new Date(iso);
    this.startTicker(birth);
  }

  clearBirth() {
    localStorage.removeItem(STORAGE_KEY);
    this.stopTicker();
    this.state$.next({
      birthISO: null,
      secondsLived: 0,
      nextBillionIndex: null,
      nextBillionAt: null,
      secondsToNextBillion: null,
    });
  }

  private startTicker(birth: Date) {
    this.stopTicker();

    const tick = () => this.computeState(birth);

    this.zone.runOutsideAngular(() => {
      tick();
      this.sub = interval(TICK_MS).subscribe(() => tick());
    });
  }

  private stopTicker() {
    this.sub?.unsubscribe();
    this.sub = undefined;
  }

  private computeState(birth: Date) {
    const now = new Date();
    const secondsLived = Math.max(0, Math.floor((now.getTime() - birth.getTime()) / 1000));

    const currentIndex = Math.floor(secondsLived / BILLION);
    const nextIndex = currentIndex + 1;
    const nextBillionAt = new Date(birth.getTime() + nextIndex * BILLION * 1000);
    const secondsToNextBillion = Math.max(0, Math.floor((nextBillionAt.getTime() - now.getTime()) / 1000));

    this.zone.run(() => {
      this.state$.next({
        birthISO: birth.toISOString(),
        secondsLived,
        nextBillionIndex: nextIndex,
        nextBillionAt,
        secondsToNextBillion,
      });
    });
  }
}
