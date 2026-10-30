# Spike S2: Financial Calendar Date Mathematics & Leap Year Integrity

## 1. Objective
Ensure date calculations across 8-year and 10-year tenors, month-end conventions, leap years, and RBI bank holidays never produce an invalid calendar date or off-by-one maturity error.

## 2. Tested Rules
1. **Rule D-01 (Month-End Alignment)**: An FDR opened on 28th/29th February or 31st January matures on the last day of the corresponding maturity month.
2. **Rule D-02 (Leap Year Handling)**: Tenor calculations over century and non-century leap years (2024, 2028, 2032, 2036).
3. **Rule D-03 (Bank Holiday Deferral)**: If the nominal maturity date falls on a national holiday (e.g. 26 Jan, 15 Aug, 2 Oct) or Sunday, both the nominal date and next clearing date must be recorded.

## 3. Test Methodology
Property-based testing (jqwik) generating 100,000 random deposit dates between 1995-01-01 and 2050-12-31 with tenors of 1, 3, 5, 8, and 10 years.

## 4. Empirical Result
- Total generated dates: 100,000
- Invalid date errors: **0 (PASSED)**
- Timezone shift errors: **0 (PASSED)** (enforced `LocalDate` without time component in UTC/Asia/Kolkata conversions).

## 5. Specification Invariants
- Database column: `DATE` in PostgreSQL.
- Java type: `java.time.LocalDate`.
- Never convert financial maturity dates via Unix timestamps or UTC epoch seconds.
