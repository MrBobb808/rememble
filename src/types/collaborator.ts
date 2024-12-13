export type Collaborator = {
  id: string;
  email: string;
  role: "admin" | "contributor" | "viewer";
  invitation_accepted: boolean;
};