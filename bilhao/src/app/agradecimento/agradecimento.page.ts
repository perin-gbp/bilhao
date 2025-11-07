import { Component } from '@angular/core';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonTitle, IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-agradecimento',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton
  ],
  templateUrl: './agradecimento.page.html',
  styleUrls: ['./agradecimento.page.scss']
})
export class AgradecimentoPage {
  async share() {
    const url = 'https://perin-gbp.github.io/bilhao/';
    const text = 'Acabei de checar meu 1 bilhão de segundos! ⏳';
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: 'Bilhão de Segundos', text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link copiado! Cole onde quiser 😊');
      }
    } catch {}
  }
}
