type CredentialsResponse = { access_token: string; expires_in: number; token_type: string };

type StreamsResponse = {
  data: {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    title: string;
    tags: string[];
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    is_mature: boolean;
  }[];
  pagination: Object;
  cursor: string;
};

const streams = ['midzui', 'jhulzui'] as const;

const getToken = async (env: Env) => {
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: env.TWITCH_CLIENT_ID,
      client_secret: env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const json = (await res.json()) as CredentialsResponse;
  return json.access_token;
};

const isStreaming = async (token: string, env: Env) => {
  const params = new URLSearchParams();
  streams.forEach((stream) => params.append('user_login', stream));
  const res = await fetch(`https://api.twitch.tv/helix/streams?${params.toString()}`, {
    headers: {
      'Client-ID': env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });
  const json = (await res.json()) as StreamsResponse;
  return json.data.length > 0;
};

export default {
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    const token = await getToken(env);
    if (await isStreaming(token, env)) {
      await env.MIDZU.put('last_stream', JSON.stringify(Date.now()));
    }
  },
};
