import { Instrument, Institution, UserPersona, AuditEvent } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('aicte_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface LoginResult {
  message: string;
  token: string;
  user: UserPersona;
  requiresOtp?: boolean;
  mfaType?: string;
  simulatedOtp?: string;
}

export const apiClient = {
  // Authentication
  async login(credentials: {
    username: string;
    password: string;
    portalType?: string;
    captchaInput?: string;
    captchaExpected?: string;
  }): Promise<LoginResult> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }
    if (data.token) {
      localStorage.setItem('aicte_auth_token', data.token);
    }
    return data;
  },

  async verifyOtp(otp: string, token: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp, token })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'OTP verification failed');
    }
    return data;
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
    } catch {
      // ignore network error
    } finally {
      localStorage.removeItem('aicte_auth_token');
      localStorage.removeItem('aicte_active_user');
    }
  },

  async getSession(): Promise<{ authenticated: boolean; user?: UserPersona }> {
    const res = await fetch(`${API_BASE}/auth/session`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  async stepUp(actionName: string, totpCode: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/step-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ actionName, totpCode })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Step-up authentication failed');
    }
    return data;
  },

  // Institutions & Instruments
  async getInstitutions(): Promise<Institution[]> {
    const res = await fetch(`${API_BASE}/institutions`);
    if (!res.ok) throw new Error('Failed to load institutions');
    return res.json();
  },

  async getInstruments(filter?: { institutionId?: string; trustLevel?: string; status?: string }): Promise<Instrument[]> {
    const query = new URLSearchParams();
    if (filter?.institutionId) query.set('institutionId', filter.institutionId);
    if (filter?.trustLevel) query.set('trustLevel', filter.trustLevel);
    if (filter?.status) query.set('status', filter.status);

    const res = await fetch(`${API_BASE}/instruments?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load instruments');
    return res.json();
  },

  async createInstrument(data: Partial<Instrument> & { actorName?: string }): Promise<Instrument> {
    const res = await fetch(`${API_BASE}/instruments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit instrument');
    return res.json();
  },

  async raiseQuery(id: string, field: string, queryText: string, remedy: string, officerName?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/instruments/${id}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ field, queryText, remedy, officerName })
    });
    if (!res.ok) throw new Error('Failed to raise query');
    return res.json();
  },

  async replyQuery(id: string, queryId: string, replyText: string, actorName?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/instruments/${id}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ queryId, replyText, actorName })
    });
    if (!res.ok) throw new Error('Failed to reply to query');
    return res.json();
  },

  async renewInstrument(id: string, data: Partial<Instrument>, actorName?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/instruments/${id}/renew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ ...data, actorName })
    });
    if (!res.ok) throw new Error('Failed to renew instrument');
    return res.json();
  },

  async bankConfirm(id: string, evidenceData: { branchName: string; branchAddress: string; referenceNo: string; confirmedBy: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/instruments/${id}/bank-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(evidenceData)
    });
    if (!res.ok) throw new Error('Failed to confirm bank evidence');
    return res.json();
  },

  async approveRelease(id: string, exceptionNote?: string, authorityName?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/instruments/${id}/approve-release`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ exceptionNote, authorityName })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to approve release');
    }
    return data;
  },

  // Audit
  async getAuditLog(): Promise<AuditEvent[]> {
    const res = await fetch(`${API_BASE}/audit`);
    if (!res.ok) throw new Error('Failed to load audit trail');
    return res.json();
  },

  async verifyAuditChain(): Promise<any> {
    const res = await fetch(`${API_BASE}/audit/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  async tamperAudit(): Promise<any> {
    const res = await fetch(`${API_BASE}/audit/tamper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  async restoreAudit(): Promise<any> {
    const res = await fetch(`${API_BASE}/audit/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  // Timeline
  async evaluateTimeline(simulatedDate: string): Promise<any> {
    const res = await fetch(`${API_BASE}/timeline/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ simulatedDate })
    });
    return res.json();
  }
};
