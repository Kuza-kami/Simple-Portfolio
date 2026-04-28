# Security Specification

## Invariants
- A user can only access and modify their own projects and timeline events under `/users/{userId}/...`.
- The `userId` property must match the currently authenticated user's ID.
- Access to other user's projects and timeline events is completely rejected.
- To prevent Denial of Wallet, arrays must be strictly bounded. Strings must be bounded.
- The user must be signed in to perform any operation.

## Test Payloads (Dirty Dozen)
1. Missing Authentication
2. Wrong user ID modification (spoofing)
3. Shadow Update (Ghost Field injection)
4. Modifying immutable field `createdAt`
5. Large String ID Poisoning
6. Missing required field
7. Incorrect data type
8. Denial of Wallet (Max Array length exceeded)
9. Denial of Wallet (Max String length exceeded)
10. Unverified Email
11. Reading another user's data
12. Bad Timestamp (Timestamp from past instead of `request.time`)
