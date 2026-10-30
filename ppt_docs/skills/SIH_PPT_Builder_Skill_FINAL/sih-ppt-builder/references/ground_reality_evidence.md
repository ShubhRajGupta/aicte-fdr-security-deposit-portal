# Ground reality, affected people and technical maturity

## The point
A mature SIH deck connects a technical design to the people, operators, institutions and environments in which it must work. It does not just claim “impact” or retell the problem statement.

## Evidence ladder
Rank evidence by how directly it supports the claim:
1. Reproducible test on a documented dataset, system or prototype.
2. Directly observed workflow / measured operational data, gathered with permission.
3. Official public data, operational reports, government documents, audit documents or service records.
4. Interview/field-notes from actual participants, collected with consent and anonymized.
5. Peer-reviewed research or maintained technical implementation about the method.
6. A well-marked assumption or hypothesis where direct evidence is not yet available.

Do not represent level 6 as direct ground research.

## Grounding table
Fill this in during research:

| Real-world observation / source | Constraint | Design response | Component / method | Validation test | Evidence status |
|---|---|---|---|---|---|
| e.g. intermittent connectivity noted in a sourced field report | occasional offline operation | local queue + delayed sync | sync module | replay offline/online transitions | documented constraint; proposed response |

The example is illustrative. Replace it with evidence from the current project; do not copy as project fact.

## People and field evidence
- Define the actual user/operator, workflow owner and decision-maker.
- Explain how and where the solution fits into an existing workflow, including what happens before and after its use.
- For any interview, record date/context, participant role and number of participants; obtain consent and anonymize private/sensitive details.
- Use direct quotes only with permission and only when accurately transcribed. Keep the slide fragment brief.
- Field photos must be genuinely from the relevant environment and used with permission. Do not stage a photo and call it an observed deployment.
- If using public case data, include source date, coverage and known limitations.
- If no direct user validation is possible yet, label it clearly as pending and supply a realistic plan: participant profile, sample method, test task, metric and pass/fail threshold.

## Prototype maturity labels
Choose the most accurate label and include evidence:
- **CONCEPT** — architecture/idea only; no working implementation.
- **POC** — narrow critical mechanism demonstrated in a controlled case.
- **WORKING PROTOTYPE** — core user flow runs; limitations still substantial.
- **TESTED PROTOTYPE** — defined tests completed; report environment, sample and results.
- **FIELD PILOT** — actual use with real participants/workflow in a limited setting, permission secured.
- **DEPLOYED** — real service in operation with sustained maintenance and governance evidence.

A UI mockup is not a working prototype. A successful synthetic demo is not field validation. Use the label as a maturity marker, not as a prestige badge.

## Technical maturity gates
For each critical module, define:
`Gate | setup/data | test action | success threshold | measured result | artifact/link | remaining risk`

Example gate types: API response/latency, model baseline, edge-device power draw, offline recovery, accessibility task completion, sensor calibration, false-positive rate, data-sync integrity, security test or deployment reproducibility. Use only tests that actually apply to the current idea.

## Impact chain
Show:
`who benefits → what changes in their workflow → how it is measured → condition/limitation`

Distinguish:
- current baseline (measured/source-backed);
- target after implementation (proposed threshold);
- estimate/model output (assumptions stated);
- actual test result (method, sample, date and context).

Never invent an “affected person” story or attribute an illustrative image to a real event. A realistic and honest validation gap is stronger than fake field evidence.
