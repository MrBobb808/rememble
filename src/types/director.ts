export interface Collaborator {
  id: string;
  memorial_id: string;
  user_id: string | null;
  email: string;
  role: 'admin' | 'contributor' | 'viewer';
}

export interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
  birth_year: string | null;
  death_year: string | null;
  banner_image_url: string | null;
  summary: string | null;
  memorial_collaborators: Collaborator[];
}

export interface Survey {
  id: string;
  memorial_id: string;
  name: string;
  key_memories: string | null;
  family_messages: string | null;
  personality_traits: string | null;
  preferred_tone: string | null;
  created_at: string;
  memorial: {
    name: string;
  } | null;
}