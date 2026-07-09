/** Fail loudly and specifically. A CRO agent must never paper over a missing credential. */
export function requireEnv(...names) {
  const missing = names.filter(n => !process.env[n]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}.\n` +
        'See website/analytics/README.md for how to create each one.',
    );
  }
  return names.map(n => process.env[n]);
}
