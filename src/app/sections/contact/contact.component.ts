import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, untracked, viewChild } from '@angular/core';
import {
  AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { InquiryDraftService, InquiryPayload, InquiryService, whatsappLink } from '../../core/inquiry.service';
import { LanguageService } from '../../core/i18n/language.service';
import { COMPANY } from '../../data/company.data';
import { SERVICES } from '../../data/services.data';
import { PhoneNumber, ServiceId } from '../../models/site.models';
import { IconComponent } from '../../shared/icon.component';
import { SectionHeadingComponent } from '../../shared/section-heading.component';

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'not-configured' | 'whatsapp';
type FieldName = 'fullName' | 'phone' | 'service' | 'destination' | 'travelers' | 'preferredDate' | 'message';

const MESSAGE_MAX = 1000;

function phoneValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = (control.value ?? '').trim();
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  const wellFormed = /^\+?[\d\s\-()]+$/.test(value);
  return wellFormed && digits.length >= 8 && digits.length <= 15 ? null : { phone: true };
}

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function notPastValidator(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && control.value < todayIso() ? { datePast: true } : null;
}

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, IconComponent, SectionHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly i18n = inject(LanguageService);
  private readonly inquiry = inject(InquiryService);
  private readonly draft = inject(InquiryDraftService);
  protected readonly company = COMPANY;
  protected readonly services = SERVICES;
  protected readonly messageMax = MESSAGE_MAX;
  protected readonly minDate = todayIso();

  protected readonly form = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, phoneValidator] }),
    service: new FormControl<ServiceId | 'other' | ''>('', { nonNullable: true, validators: [Validators.required] }),
    destination: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(150)] }),
    travelers: new FormControl<number | null>(1, {
      validators: [Validators.required, Validators.min(1), Validators.max(500), Validators.pattern(/^\d+$/)],
    }),
    preferredDate: new FormControl('', { nonNullable: true, validators: [notPastValidator] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(MESSAGE_MAX)] }),
  });

  protected readonly status = signal<Status>('idle');
  protected readonly submitted = signal(false);
  protected readonly copied = signal(false);
  protected readonly summary = signal('');
  protected readonly usesWhatsapp = this.inquiry.usesWhatsapp;
  protected readonly waUrl = signal<string | null>(null);
  protected readonly waChatUrl = whatsappLink();
  /** The WhatsApp number exactly as the company supplied it. */
  protected readonly waDisplay =
    COMPANY.phones.find((p) => p.e164 === `+${COMPANY.whatsapp}`)?.display ?? `+${COMPANY.whatsapp}`;
  private readonly messageValue = toSignal(this.form.controls.message.valueChanges, { initialValue: '' });
  protected readonly charsLeft = () => MESSAGE_MAX - (this.messageValue()?.length ?? 0);

  private readonly statusPanel = viewChild<ElementRef<HTMLElement>>('statusPanel');
  private readonly errorSummary = viewChild<ElementRef<HTMLElement>>('errorSummary');

  constructor() {
    // Pre-fill from service / trip cards.
    effect(() => {
      const req = this.draft.request();
      if (!req) return;
      untracked(() => {
        if (this.status() !== 'idle' && this.status() !== 'error') this.reset();
        if (req.service) this.form.controls.service.setValue(req.service);
        if (req.destination !== undefined) this.form.controls.destination.setValue(req.destination);
      });
    });
  }

  protected tel(phone: PhoneNumber): string {
    return `tel:${phone.e164}`;
  }

  protected phoneLabel(phone: PhoneNumber): string {
    const c = this.i18n.t().contact;
    if (phone.country === 'SA') return c.saudiNumber;
    return phone.kind === 'landline' ? c.landline : c.mobile;
  }

  protected showError(name: FieldName): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected errorText(name: FieldName): string {
    const e = this.form.controls[name].errors ?? {};
    const m = this.i18n.t().form.errors;
    if (e['required']) return m.required;
    if (name === 'fullName' && (e['minlength'] || e['maxlength'])) return m.nameMin;
    if (e['phone']) return m.phone;
    if (e['pattern']) return m.integer;
    if (e['min']) return m.travelersMin;
    if (e['max']) return m.travelersMax;
    if (e['datePast']) return m.datePast;
    if (e['maxlength']) return m.messageMax;
    return '';
  }

  protected describedBy(name: FieldName, hintId?: string): string | null {
    const ids = [hintId, this.showError(name) ? `err-${name}` : null].filter(Boolean);
    return ids.length ? ids.join(' ') : null;
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      setTimeout(() => this.errorSummary()?.nativeElement.focus());
      return;
    }
    const v = this.form.getRawValue();
    const payload: InquiryPayload = {
      fullName: v.fullName.trim(),
      phone: v.phone.trim(),
      service: v.service as ServiceId | 'other',
      destination: v.destination.trim(),
      travelers: Number(v.travelers),
      preferredDate: v.preferredDate,
      message: v.message.trim(),
      lang: this.i18n.lang(),
    };
    this.summary.set(this.buildSummary(payload));

    if (this.usesWhatsapp) {
      // Must open synchronously inside the click/submit handler, otherwise browsers block the popup.
      const url = whatsappLink(this.summary())!;
      this.waUrl.set(url);
      const win = window.open(url, '_blank');
      if (win) win.opener = null;
      this.finish('whatsapp');
      return;
    }

    this.status.set('submitting');
    this.form.disable();

    this.inquiry.send(payload).subscribe({
      next: (result) => this.finish(result === 'sent' ? 'success' : 'not-configured'),
      error: () => {
        this.form.enable();
        this.finish('error');
      },
    });
  }

  private finish(status: Status): void {
    this.status.set(status);
    setTimeout(() => this.statusPanel()?.nativeElement.focus());
  }

  protected reset(): void {
    this.form.enable();
    this.form.reset();
    this.submitted.set(false);
    this.copied.set(false);
    this.waUrl.set(null);
    this.status.set('idle');
  }

  protected async copySummary(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.summary());
      this.copied.set(true);
    } catch {
      this.copied.set(false);
    }
  }

  private buildSummary(p: InquiryPayload): string {
    const t = this.i18n.t().form;
    const service = p.service === 'other' ? t.otherService : this.i18n.pick(SERVICES.find((s) => s.id === p.service)!.title);
    const lines = [
      `${t.fields.name}: ${p.fullName}`,
      `${t.fields.phone}: ${p.phone}`,
      `${t.fields.service}: ${service}`,
      p.destination && `${t.fields.destination}: ${p.destination}`,
      `${t.fields.travelers}: ${p.travelers}`,
      p.preferredDate && `${t.fields.date}: ${p.preferredDate}`,
      p.message && `${t.fields.message}: ${p.message}`,
    ].filter(Boolean);
    return `${t.offline.summaryTitle}\n\n${lines.join('\n')}`;
  }
}
