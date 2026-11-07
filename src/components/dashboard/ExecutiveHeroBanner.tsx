import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  QrCode,
  Landmark,
  FileCheck2,
  Lock,
  Layers
} from 'lucide-react';

interface BannerSlide {
  id: string;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  bullets: string[];
  primaryBtnText: string;
  primaryAction: () => void;
  secondaryBtnText?: string;
  secondaryAction?: () => void;
  stampImage: string;
  stampLabel: string;
  stampSub: string;
  accentColor: string;
}

export const ExecutiveHeroBanner: React.FC = () => {
  const { setActiveTab } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides: BannerSlide[] = [
    {
      id: 'slide-parliament',
      image: './assets/indian-parliament.jpg',
      tag: 'Viksit Bharat @ 2047 · Ministry of Education · Government of India',
      title: 'National Central Security Deposit & Joint FDR Registry (e-FDR)',
      subtitle:
        'Automated statutory governance under APH 2024-27 Clause 1.4. Mandatory joint lien endorsements with Member Secretary, AICTE New Delhi, real-time Scheduled Bank confirmations, and zero temporal coverage gaps.',
      bullets: [
        '100% Digital Lien Verification',
        'Direct Scheduled Bank Attestation (L2)',
        'Zero Temporal Coverage Gap Guarantee',
        'SHA-256 Merkle Ledger Active'
      ],
      primaryBtnText: 'View Scrutiny Worklist',
      primaryAction: () => setActiveTab('WORKLIST'),
      secondaryBtnText: 'Deposit Lodgement (e-FDR)',
      secondaryAction: () => setActiveTab('NEW_SUBMISSION'),
      stampImage: './assets/stamps/aicte-gold-seal.svg',
      stampLabel: 'AICTE STATUTORY SEAL',
      stampSub: 'APH 2024-27 Mandated',
      accentColor: '#f97316'
    },
    {
      id: 'slide-rashtrapati',
      image: './assets/rashtrapati-bhavan.jpg',
      tag: 'Sovereign Banking Integration · RBI Scheduled Commercial Bank Network',
      title: 'Direct Scheduled Commercial Bank Attestation Channel',
      subtitle:
        'Direct API integration with 7 Scheduled Commercial Banks (State Bank of India, PNB, Bank of Baroda, Canara, Union Bank, HDFC, ICICI) for automated CBS lien recording and instant branch attestation.',
      bullets: [
        'Core Banking System (CBS) Verified',
        'STP API Direct Attestation Link',
        'Eliminates Physical Courier Verification',
        'Level L2 Trust Grade Certified'
      ],
      primaryBtnText: 'Open Bank Confirmation Channel',
      primaryAction: () => setActiveTab('BANK_CONFIRM'),
      secondaryBtnText: 'Explore Partner Network',
      secondaryAction: () => setActiveTab('API_EXPLORER'),
      stampImage: './assets/stamps/stamp-bank-confirmed.svg',
      stampLabel: 'BANK CBS CONFIRMED',
      stampSub: 'L2 Attestation Active',
      accentColor: '#38bdf8'
    },
    {
      id: 'slide-indiagate',
      image: './assets/india-gate.jpg',
      tag: 'Central Vigilance Bureau · Fraud Prevention & Digital Trust',
      title: 'Tamper-Evident Digital QR-NOC Release Protocol',
      subtitle:
        'Zero tolerance for forged paper release orders. Every approved deposit discharge generates a cryptographically signed digital release certificate with QR-code verification against the AICTE immutable audit trail.',
      bullets: [
        'Evidence Act 65B Compliant Digital Signatures',
        'Tamper-Evident Citizen QR Scan Verification',
        'Automated Maker-Checker Dual Authorization',
        'Immediate Bank CBS Lien Discharge'
      ],
      primaryBtnText: 'Verify Digital NOC Online',
      primaryAction: () => setActiveTab('PUBLIC_NOC'),
      secondaryBtnText: 'Inspect Cryptographic Audit Log',
      secondaryAction: () => setActiveTab('AUDIT_EXPLORER'),
      stampImage: './assets/stamps/stamp-noc-released.svg',
      stampLabel: 'NOC DISCHARGE SEAL',
      stampSub: 'Public Registry Verified',
      accentColor: '#22c55e'
    },
    {
      id: 'slide-governance',
      image: './assets/indian-parliament.jpg',
      tag: 'Regulatory Sandbox · Deterministic Rule Engine (R1–R10)',
      title: 'Zero-Trust Cryptographic Ledger & Deterministic Scrutiny',
      subtitle:
        'Mathematical verification of institutional security deposits. Real-time APH Table 1.4 adequacy checking, automated defect flagging, and continuous risk-ranked scrutiny queues protecting ₹3,400+ Cr in assets.',
      bullets: [
        'R1 to R10 Automated Discrepancy Checks',
        'Deterministic Urgency & Value Risk Scoring',
        'Fast-Forward T-90 Day Maturity Alerts',
        'Council Executive MIS Analytics'
      ],
      primaryBtnText: 'Launch Regulatory Sandbox',
      primaryAction: () => setActiveTab('RULE_SANDBOX'),
      secondaryBtnText: 'Council MIS Analytics',
      secondaryAction: () => setActiveTab('ROI_SLIDES'),
      stampImage: './assets/stamps/stamp-lien-verified.svg',
      stampLabel: 'REGULATION BUREAU',
      stampSub: 'Clause 1.4 Endorsed',
      accentColor: '#a855f7'
    }
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay handler with pause on hover
  useEffect(() => {
    if (isPlaying && !isHovered) {
      timerRef.current = setInterval(nextSlide, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, nextSlide]);

  const activeSlideData = slides[currentSlide];

  return (
    <div
      className="gov-hero-banner-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '14px',
        boxShadow: '0 4px 14px rgba(0, 33, 71, 0.12)',
        border: '1px solid #cbd5e1',
        background: '#002147'
      }}
    >
      {/* Sovereign Tricolor Top Hairline (Government Standard) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3.5px',
          background: 'linear-gradient(90deg, #f37022 33.3%, #ffffff 33.3% 66.6%, #15803d 66.6%)',
          zIndex: 10
        }}
      />

      {/* Slide Viewport / Sliding Track */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '210px',
          overflow: 'hidden'
        }}
      >
        {/* Photographic Background Image with Smooth Cross-Fade Transition */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${activeSlideData.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            transition: 'background-image 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 6s linear',
            transform: isHovered ? 'scale(1.02)' : 'scale(1.0)',
            zIndex: 1
          }}
        />

        {/* Sovereign Multi-Stop Navy Gradient Overlay for Crystal Clear Legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(0, 24, 56, 0.97) 0%, rgba(0, 33, 71, 0.92) 55%, rgba(0, 48, 96, 0.82) 100%)',
            zIndex: 2
          }}
        />

        {/* Slide Content Box */}
        <div
          key={activeSlideData.id}
          style={{
            position: 'relative',
            zIndex: 4,
            padding: '22px 30px 24px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
            animation: 'fadeInSlide 0.5s ease-out'
          }}
        >
          {/* Left Text Block */}
          <div style={{ color: '#ffffff', maxWidth: '820px' }}>
            {/* National Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  background: activeSlideData.accentColor,
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 900,
                  padding: '2px 8px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: '2px'
                }}
              >
                Official Directive
              </span>
              <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600 }}>
                {activeSlideData.tag}
              </span>
            </div>

            {/* Slide Title */}
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: '0.015em'
              }}
            >
              {activeSlideData.title}
            </h2>

            {/* Slide Subtitle */}
            <p
              style={{
                fontSize: '12px',
                color: '#e2e8f0',
                marginTop: '8px',
                marginBottom: '10px',
                lineHeight: 1.5,
                maxWidth: '780px'
              }}
            >
              {activeSlideData.subtitle}
            </p>

            {/* Bullet Highlights */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '14px',
                fontSize: '11px',
                color: '#93c5fd',
                flexWrap: 'wrap'
              }}
            >
              {activeSlideData.bullets.map((b, idx) => (
                <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#22c55e', fontWeight: 900 }}>✓</span>
                  <span>{b}</span>
                </span>
              ))}
            </div>

            {/* Interactive Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={activeSlideData.primaryAction}
                className="btn-gov btn-gov-primary"
                style={{
                  background: 'var(--gov-saffron)',
                  borderColor: '#ea580c',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '11.5px',
                  padding: '6px 14px',
                  boxShadow: '0 2px 6px rgba(243, 112, 34, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '2px'
                }}
              >
                <span>{activeSlideData.primaryBtnText}</span>
                <ArrowRight size={13} />
              </button>

              {activeSlideData.secondaryBtnText && (
                <button
                  type="button"
                  onClick={activeSlideData.secondaryAction}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{activeSlideData.secondaryBtnText}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Visual Stamp & Holographic Crest Medallion */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 18, 41, 0.72)',
              padding: '12px 18px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
              minWidth: '150px',
              flexShrink: 0
            }}
          >
            <img
              src={activeSlideData.stampImage}
              alt={activeSlideData.stampLabel}
              style={{
                height: '70px',
                width: 'auto',
                filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))',
                marginBottom: '6px'
              }}
            />
            <div style={{ textAlign: 'center', color: '#ffffff', lineHeight: 1.25 }}>
              <div
                style={{
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#fbbf24',
                  fontWeight: 900
                }}
              >
                {activeSlideData.stampLabel}
              </div>
              <div style={{ fontSize: '9px', color: '#cbd5e1', marginTop: '2px' }}>
                {activeSlideData.stampSub}
              </div>
              <div
                style={{
                  fontSize: '8px',
                  color: '#4ade80',
                  fontWeight: 800,
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px'
                }}
              >
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4ade80' }} />
                NIC &amp; RBI Compliant
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar: Left / Right Arrows + Slide Indicators + Play / Pause */}
      <div
        style={{
          background: 'rgba(0, 15, 36, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '6px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#ffffff',
          position: 'relative',
          zIndex: 5
        }}
      >
        {/* Slide Counter & Title Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--gov-saffron)',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 8px',
              borderRadius: '2px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            0{currentSlide + 1} / 0{totalSlides}
          </span>
          <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600 }}>
            {activeSlideData.title.slice(0, 48)}...
          </span>
        </div>

        {/* Center: Slide Indicators / Dots */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {slides.map((s, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: isActive ? '28px' : '9px',
                  height: '8px',
                  borderRadius: '3px',
                  background: isActive ? 'var(--gov-saffron)' : 'rgba(255, 255, 255, 0.28)',
                  border: isActive ? '1px solid #f97316' : 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s ease'
                }}
                title={`Jump to slide ${idx + 1}: ${s.title}`}
              />
            );
          })}
        </div>

        {/* Right Navigation Arrows & Autoplay Pause/Play Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              width: '24px',
              height: '24px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={isPlaying ? 'Pause banner slideshow' : 'Play banner slideshow'}
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
          </button>

          <button
            type="button"
            onClick={prevSlide}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              width: '24px',
              height: '24px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Previous banner slide"
          >
            <ChevronLeft size={14} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              width: '24px',
              height: '24px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Next banner slide"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
