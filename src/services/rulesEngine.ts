import { Discrepancy, Instrument } from '../types';
import { IFSC_DIRECTORY, APH_RULES } from '../data/bankDirectory';

export function evaluateDiscrepancyRules(
  instrument: Partial<Instrument>,
  existingInstruments: Instrument[] = []
): Discrepancy[] {
  const discrepancies: Discrepancy[] = [];

  // R1: Amount differs from required under applicable APH
  const requiredAmount = instrument.aphRequiredAmount || 3500000;
  const submittedAmount = instrument.amount || 0;
  if (instrument.institutionType !== 'GOVERNMENT_EXEMPT' && submittedAmount < requiredAmount) {
    const diff = requiredAmount - submittedAmount;
    discrepancies.push({
      code: 'R1',
      ruleTitle: 'Required Security Deposit Amount Mismatch',
      field: 'amount',
      severity: 'CRITICAL',
      message: `Deposited amount ₹${submittedAmount.toLocaleString('en-IN')} is less than the prescribed ₹${requiredAmount.toLocaleString('en-IN')} (Shortfall of ₹${diff.toLocaleString('en-IN')}) under applicable APH table.`,
      requiredValue: `₹${requiredAmount.toLocaleString('en-IN')}.00`,
      detectedValue: `₹${submittedAmount.toLocaleString('en-IN')}.00`,
      resolved: false
    });
  }

  // R2: Beneficiary or lien not in favour of AICTE
  const beneficiary = (instrument.beneficiaryName || '').toLowerCase();
  const lien = (instrument.lienMarkedTo || '').toLowerCase();
  const validBeneficiary = beneficiary.includes('aicte') || beneficiary.includes('member secretary');
  const validLien = lien.includes('aicte');

  if (!validBeneficiary) {
    discrepancies.push({
      code: 'R2',
      ruleTitle: 'Beneficiary Not Marked in Favour of AICTE',
      field: 'beneficiaryName',
      severity: 'CRITICAL',
      message: `Beneficiary must be 'Member Secretary, AICTE New Delhi'. Submitted: '${instrument.beneficiaryName || 'Missing'}'`,
      requiredValue: 'Member Secretary, AICTE New Delhi',
      detectedValue: instrument.beneficiaryName || 'Not Specified',
      resolved: false
    });
  }

  if (!validLien) {
    discrepancies.push({
      code: 'R2',
      ruleTitle: 'Lien Not Exclusively Marked to AICTE',
      field: 'lienMarkedTo',
      severity: 'CRITICAL',
      message: `Lien annotation must be explicitly marked in favour of 'AICTE, New Delhi'. Submitted: '${instrument.lienMarkedTo || 'Missing'}'`,
      requiredValue: 'AICTE, New Delhi',
      detectedValue: instrument.lienMarkedTo || 'None',
      resolved: false
    });
  }

  // R3: Issue date, maturity date, or tenor inconsistent
  if (instrument.issueDate && instrument.maturityDate) {
    const issue = new Date(instrument.issueDate);
    const maturity = new Date(instrument.maturityDate);
    if (maturity <= issue) {
      discrepancies.push({
        code: 'R3',
        ruleTitle: 'Inconsistent Tenor / Invalid Maturity Date',
        field: 'maturityDate',
        severity: 'CRITICAL',
        message: 'Maturity date is earlier than or equal to the issue date.',
        requiredValue: 'Maturity date must be at least 8 to 10 years after issue date',
        detectedValue: `${instrument.maturityDate} <= ${instrument.issueDate}`,
        resolved: false
      });
    }
  }

  // R4: Same FDR number + bank already exists under another institution
  if (instrument.instrumentNumber && instrument.bankName) {
    const duplicate = existingInstruments.find(
      (other) =>
        other.id !== instrument.id &&
        other.instrumentNumber.trim().toLowerCase() === instrument.instrumentNumber?.trim().toLowerCase() &&
        other.bankName.trim().toLowerCase() === instrument.bankName?.trim().toLowerCase() &&
        other.institutionId !== instrument.institutionId
    );

    if (duplicate) {
      discrepancies.push({
        code: 'R4',
        ruleTitle: 'Duplicate Instrument Number in Central Registry',
        field: 'instrumentNumber',
        severity: 'CRITICAL',
        message: `Instrument #${instrument.instrumentNumber} at '${instrument.bankName}' already exists under institution '${duplicate.institutionName}' (${duplicate.institutionAicteId}).`,
        requiredValue: 'Globally unique FDR / BG certificate number',
        detectedValue: `Colliding with institution ${duplicate.institutionAicteId}`,
        resolved: false
      });
    }
  }

  // R5: IFSC does not match bank name or branch
  if (instrument.ifscCode) {
    const ifscUpper = instrument.ifscCode.toUpperCase().trim();
    const ifscEntry = IFSC_DIRECTORY[ifscUpper];
    if (ifscEntry) {
      if (
        instrument.bankName &&
        !ifscEntry.bankName.toLowerCase().includes(instrument.bankName.toLowerCase().slice(0, 5))
      ) {
        discrepancies.push({
          code: 'R5',
          ruleTitle: 'IFSC Code and Bank Mismatch',
          field: 'ifscCode',
          severity: 'WARNING',
          message: `IFSC ${ifscUpper} maps to ${ifscEntry.bankName}, but entered bank is '${instrument.bankName}'.`,
          requiredValue: ifscEntry.bankName,
          detectedValue: instrument.bankName,
          resolved: false
        });
      }
    } else if (ifscUpper.length !== 11) {
      discrepancies.push({
        code: 'R5',
        ruleTitle: 'Malformed IFSC Code Format',
        field: 'ifscCode',
        severity: 'WARNING',
        message: 'IFSC code must be exactly 11 alphanumeric characters (e.g., SBIN0008432).',
        requiredValue: '11 characters (RBI IFSC standard)',
        detectedValue: `${ifscUpper.length} characters`,
        resolved: false
      });
    }
  }

  // R8: Required affidavit or document missing
  if (!instrument.documents || instrument.documents.length === 0) {
    discrepancies.push({
      code: 'R8',
      ruleTitle: 'Mandatory FDR Certificate Document Missing',
      field: 'documents',
      severity: 'CRITICAL',
      message: 'Scanned original copy of FDR or Bank Guarantee certificate is mandatory for verification.',
      requiredValue: 'Uploaded PDF (min 200 DPI)',
      detectedValue: '0 files uploaded',
      resolved: false
    });
  }

  return discrepancies;
}
