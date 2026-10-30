# Spike S7: Network Boundaries, Firewalls & Nightly Sync Accessibility

## 1. Objective
Assess network reachability between the isolated FDR Security Deposit Portal and the legacy AICTE Approval Management System located inside the NIC MeghRaj data center.

## 2. Findings & Constraints
1. **Direct DB Connection**: Direct database connection from external cloud to NIC Oracle database is **PROHIBITED** by government security policy.
2. **Synchronous Webhooks**: Legacy approval system lacks outbound webhook dispatch capabilities.
3. **Approved Solution**: 
   - Nightly batch export generated within the secure enclave at 01:30 IST.
   - Pushed via mutual-TLS authenticated SFTP / encrypted blob store.
   - FDR Portal pulls the nightly file at 02:00 IST using an idempotent file-import adapter.
   - Failed records routed to a dead-letter table with automated alert triggers.

## 3. Conclusion
Batch file-drop synchronization is the only policy-compliant integration path. Architecture frozen accordingly.
