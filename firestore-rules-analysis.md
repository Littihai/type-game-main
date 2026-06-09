# Firestore Rules Analysis

## App Context

- Framework: React + TypeScript + Vite.
- Firebase products used: Auth with Google provider, Cloud Firestore.
- Firestore SDK calls are centralized in `src/services/leaderboardService.ts`.

## Collections

### `leaderboard/{userId}`

- Document ID: Firebase Auth UID.
- Reads:
  - `getDoc(doc(db, 'leaderboard', user.uid))` before saving best score.
  - `getDocs(query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(10)))` for top 10.
- Writes:
  - `setDoc(doc(db, 'leaderboard', user.uid), data, { merge: true })`.
- Deletes: none.

## Data Model

- `uid`: string, required, must match `request.auth.uid`, immutable.
- `displayName`: string, required, public leaderboard name, 1-80 chars.
- `photoURL`: string or null, optional public avatar URL.
- `score`: int, required, positive, non-decreasing on update.
- `wave`: int, required, range 1-10000.
- `accuracy`: int, required, range 0-100.
- `words`: int, required, range 0-100000.
- `language`: string enum, `thai` or `english`.
- `difficulty`: string enum, `easy`, `medium`, or `hard`.
- `updatedAt`: timestamp, required, must be `request.time`.

## Attack Review

- Public list exploit: blocked because reads require authentication.
- Unauthorized write: blocked by document ID ownership check.
- Ownership hijacking: blocked because `uid` must match authenticated UID and document path.
- Schema pollution: blocked by `hasOnlyLeaderboardFields`.
- Type juggling: blocked by explicit type checks.
- Resource exhaustion: string fields have size limits.
- Score downgrade: blocked by update score comparison.
- Delete abuse: blocked.
