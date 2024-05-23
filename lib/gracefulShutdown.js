export function gracefulShutdown({ qb_api }) {
    if (qb_api.auth_interval_id) clearInterval(qb_api.auth_interval_id);
    return process.exit(0);
}