# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅        |

## Architecture Security

### Data Layer
- **SQLite database** stored locally — no network exposure
- **Parameterized queries** throughout — SQL injection prevented
- **WAL mode** for safe concurrent access

### Server-Side Execution
- All database operations run server-side only (Server Components / Server Actions)
- `better-sqlite3` native module cannot execute in browser
- No database credentials exposed to client bundle

### Input Validation
- CHECK constraints on status (todo/in-progress/done) and priority (high/medium/low)
- Server Actions validate input before database operations

### Dependencies
- Regular `npm audit` recommended
- Minimal dependency footprint
- No authentication layer (demo app — add NextAuth.js for production)

## Known Limitations (Demo)
- No authentication/authorization
- No CSRF protection beyond Next.js defaults
- No rate limiting
- Database file has no encryption at rest

## Reporting Vulnerabilities
For this demo project, open a GitHub issue.
For production deployments, implement a responsible disclosure policy.
