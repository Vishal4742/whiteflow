-- Code review 2026-11-08 (F1 sweep): lib/settle.ts settleStale reads the oldest checkouts with an unknown outcome every
-- 30 s per instance on checkout traffic. app_web_sessions is never pruned, so this partial index keeps that read to the
-- few pending rows instead of a scan of every checkout ever opened.
-- Idempotent and additive: safe to re-run on Neon. Rollback: DROP INDEX IF EXISTS app_web_sessions_pending.
CREATE INDEX IF NOT EXISTS app_web_sessions_pending ON app_web_sessions (created_at) WHERE pending IS NOT NULL;
