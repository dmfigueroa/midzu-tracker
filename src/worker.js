const streams = /** @type {const} */ (['midzui', 'jhulzui']);

/**
 * Get an access token from Twitch using the environment variables provided by the environment variable
 *
 * @param {Env} env Cloudflare's environment object
 * @returns An access token
 */
const getToken = async (env) => {
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: env.TWITCH_CLIENT_ID,
      client_secret: env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  /** @type {import("../types").CredentialsResponse} */
  const json = await res.json();
  return json.access_token;
};

/**
 *
 * @param {string} token Twitch access token
 * @param {Env} env Cloudflare's environment object
 * @returns A boolan that indicates if the given user is on stream
 */
const isStreaming = async (token, env) => {
  const params = new URLSearchParams();
  streams.forEach((stream) => params.append('user_login', stream));
  const res = await fetch(`https://api.twitch.tv/helix/streams?${params.toString()}`, {
    headers: {
      'Client-ID': env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  /** @type {import("../types").StreamsResponse} */
  const json = await res.json();
  return json.data.length > 0;
};

export default {
  async scheduled(/** @type {ScheduleEvent} */ _event, /** @type {Env} */ env, /** @type {ExecutionContext} */ _ctx) {
    const token = await getToken(env);
    if (await isStreaming(token, env)) {
      await env.MIDZU.put('last_stream', JSON.stringify(Date.now()));
    }
  },
};
