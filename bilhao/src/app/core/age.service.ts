import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

const STORAGE_KEY = 'birthISO'; // armazena string ISO ex: 1990-11-07T19:30:00-03:00
const BILLION = 1_000_000_000;
const TICK_MS = 1000; // 1s

export interface AgeState {
  birthISO: string | null;
  secondsLived: number;           // inteiros
  nextBillionIndex: number | null; // 1 para 1bi, 2 para 2bi, ...
  nextBillionAt: Date | null;     // data/hora da próxima virada
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

  /** Observa o estado */
  get ageState$() {
    return this.state$.asObservable();
  }

  /** Define/atualiza a data de nascimento (ISO com timezone do usuário) */
  setBirthISO(iso: string) {
    localStorage.setItem(STORAGE_KEY, iso);
    const birth = new Date(iso);
    // inicia/reativa o ticker
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

  // -------- Internos --------

  private startTicker(birth: Date) {
    this.stopTicker();

    // Atualiza imediatamente, depois a cada 1s
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

    // próximo bilhão:
    // k atual = floor(seconds/1e9); próximo índice = k+1 (pelo menos 1)
    const currentIndex = Math.floor(secondsLived / BILLION);
    const nextIndex = currentIndex + 1;
    const nextBillionAt = new Date(birth.getTime() + nextIndex * BILLION * 1000);
    const secondsToNextBillion = Math.max(0, Math.floor((nextBillionAt.getTime() - now.getTime()) / 1000));

    // publica dentro da zona Angular para atualizar a UI
    this.zone.run(() => {
      this.state$.next({
        birthISO: birth.toISOString(), // normaliza interna, mas mantemos o que está no storage
        secondsLived,
        nextBillionIndex: nextIndex,
        nextBillionAt,
        secondsToNextBillion,
      });
    });
  }
}
