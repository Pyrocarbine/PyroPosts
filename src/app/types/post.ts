export type Post = {
  id: number;
  title: string;
  content: string;
  tags: string[] | null;
  user_id: string;
  display_name: string;
  email: string;
  created_at: string;
};
