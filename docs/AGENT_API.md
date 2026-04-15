# AILevelUp Proposals — Agent API

This document describes how an AI agent (or any programmatic client) can manage proposals on ailevelup.ca.

## Base URL

```
https://www.ailevelup.ca
```

## Authentication

All agent requests use an API key issued from the admin UI at `/admin/api-keys`. Keys are prefixed with `ailu_` and must be sent in the `Authorization` header:

```
Authorization: Bearer ailu_<your-key>
```

- Keys are hashed with SHA-256 at rest; the raw key is shown once at creation and never again.
- Keys can be revoked at any time from `/admin/api-keys`. Revoked keys return `401 Unauthorized`.
- Every authenticated call is recorded in the audit log at `/admin/audit`.
- Default scopes: `proposals:read`, `proposals:write`.

Never commit the raw key. Store it in the agent's secret manager.

## Endpoints

### List proposals

```
GET /api/proposals
```

Response `200`:
```json
{ "proposals": [ { "id": "...", "clientName": "...", ... } ] }
```

### Create a proposal

```
POST /api/proposals
Content-Type: application/json
```

Minimum body:
```json
{ "clientName": "Acme Inc" }
```

Full body accepts every field on the `Proposal` type (see `types/proposal.ts`), including:
`badge, headline, subtitle, preparedFor, date, preparedBy, validUntil, challenge,
deliverables[], scopeIncluded[], scopeExcluded[], timeline[], timelineNote,
pricingPhase, pricingSubtitle, pricingAmount, pricingCurrency, pricingAmountAlt,
pricingCurrencyAlt, pricingNote, pricingIncludes[], paymentTerms, paymentMethods,
whatWeNeed[], clientProvides[], terms[], setupFees[], managedSetup, ctaSteps[], status`.

Response `201`:
```json
{ "id": "acme-inc-2026-04-15...", "message": "Proposal created", "proposal": { ... } }
```

The `id` is the stable slug used in URLs: `https://www.ailevelup.ca/proposals/{id}`.

### Get a proposal

```
GET /api/proposals/{id}
```

Response `200`: full `Proposal` object. `404` if not found.

### Update a proposal (full replace)

```
PUT /api/proposals/{id}
Content-Type: application/json
```

Body must include `clientName`. Any fields provided overwrite the existing record; omitted fields are preserved.

### Partial update

```
PATCH /api/proposals/{id}
Content-Type: application/json
```

Identical to `PUT` but does not require `clientName`. Useful for targeted edits like status changes:

```json
{ "status": "sent" }
```

or single-field tweaks:

```json
{ "pricingAmount": "$3,200" }
```

### Mark sent / signed

Update the `status` field via `PATCH`:
- `"draft"` — default, still editable
- `"sent"` — sent to client
- `"signed"` — client has signed off

```
PATCH /api/proposals/{id}
{ "status": "sent" }
```

## Error responses

| Status | Meaning |
|--------|---------|
| `400`  | Bad JSON or missing required field |
| `401`  | Missing / invalid / revoked API key |
| `403`  | API key lacks the required scope |
| `404`  | Proposal not found |
| `500`  | Server error — check `/admin/audit` for details |

## Audit trail

Every call is logged to the `api_audit` table with: timestamp, method, path, status, key name (actor), and a short summary. View the last 200 entries at `/admin/audit`.

## Example: end-to-end agent flow

```bash
KEY="ailu_..."

# 1. Create a draft
curl -s -X POST https://www.ailevelup.ca/api/proposals \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Harsha Karnani","pricingAmount":"$2,500","pricingCurrency":"USD"}'

# 2. Tweak it
curl -s -X PATCH https://www.ailevelup.ca/api/proposals/harsha-karnani-... \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"pricingNote":"30/70 split, 30% deposit"}'

# 3. Mark sent
curl -s -X PATCH https://www.ailevelup.ca/api/proposals/harsha-karnani-... \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"sent"}'

# 4. List to confirm
curl -s https://www.ailevelup.ca/api/proposals \
  -H "Authorization: Bearer $KEY"
```

## Key management

Only humans authenticated via Supabase can create or revoke keys. The admin UI at `/admin/api-keys` is session-gated; keys cannot create other keys. To rotate: create a new key, update the agent's secret, then revoke the old key.
