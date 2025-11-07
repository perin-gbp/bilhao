import { Component } from '@angular/core';
import {
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonTitle, IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-agradecimento',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent
  ],
  templateUrl: './agradecimento.page.html',
  styleUrls: ['./agradecimento.page.scss']
})
export class AgradecimentoPage {}
