export type CollaboratorRole = "admin" | "contributor" | "viewer";

export type Collaborator = {
  id: string;
  email: string;
  role: CollaboratorRole;
  invitation_accepted: boolean;
};

export type InviteFormData = {
  email: string;
  role: CollaboratorRole;
};