import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, of, delay } from 'rxjs';
import { COMPANY } from '../data/company.data';
import { Lang, ServiceId } from '../models/site.models';

export interface InquiryPayload {
  fullName: string;
  phone: string;
  service: ServiceId | 'other';
  destination: string;
  travelers: number;
  preferredDate: string;
  message: string;
  lang: Lang;
}

/** `sent` — accepted by the configured endpoint; `not-configured` — nothing was sent. */
export type InquiryResult = 'sent' | 'not-configured';

/** wa.me link that opens a chat with the company number and a pre-filled message. */
export function whatsappLink(text?: string): string | null {
  if (!COMPANY.whatsapp) return null;
  return `https://wa.me/${COMPANY.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : '');
}

@Injectable({ providedIn: 'root' })
export class InquiryService {
  private readonly http = inject(HttpClient);

  readonly isConfigured = !!COMPANY.inquiryEndpoint;
  /** Without a backend, enquiries are handed to WhatsApp (the visitor presses Send there). */
  readonly usesWhatsapp = !COMPANY.inquiryEndpoint && !!COMPANY.whatsapp;

  send(payload: InquiryPayload): Observable<InquiryResult> {
    if (!COMPANY.inquiryEndpoint) {
      // No backend yet: never pretend the enquiry was delivered.
      return of<InquiryResult>('not-configured').pipe(delay(400));
    }
    return this.http.post(COMPANY.inquiryEndpoint, payload).pipe(map((): InquiryResult => 'sent'));
  }
}

/** Lets service and trip cards pre-fill the enquiry form. */
@Injectable({ providedIn: 'root' })
export class InquiryDraftService {
  readonly request = signal<{ service?: ServiceId; destination?: string; nonce: number } | null>(null);

  prefill(draft: { service?: ServiceId; destination?: string }): void {
    this.request.set({ ...draft, nonce: Date.now() });
  }
}
