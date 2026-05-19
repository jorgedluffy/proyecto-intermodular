import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfigService, Language, Currency } from '../../services/config.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  public configService = inject(ConfigService);
  private elementRef = inject(ElementRef);

  isLangOpen = signal(false);
  isCurrOpen = signal(false);

  toggleLang() {
    this.isLangOpen.update(v => !v);
    this.isCurrOpen.set(false);
  }

  toggleCurr() {
    this.isCurrOpen.update(v => !v);
    this.isLangOpen.set(false);
  }

  selectLanguage(lang: string) {
    this.configService.setLanguage(lang as Language);
    this.isLangOpen.set(false);
  }

  selectCurrency(curr: string) {
    this.configService.setCurrency(curr as Currency);
    this.isCurrOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isLangOpen.set(false);
      this.isCurrOpen.set(false);
    }
  }
}
