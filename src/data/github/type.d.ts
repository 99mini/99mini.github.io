type TReleasePR = {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  closed_at: string;
  merged_at: string;
  user: User;
};

type TUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  url: string;
  html_url: string;
};
