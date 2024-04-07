export type CredentialsResponse = { access_token: string; expires_in: number; token_type: string };

export type StreamsResponse = {
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
