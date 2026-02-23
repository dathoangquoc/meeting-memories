export type Note = {
  note_id: string;
  title: string;
  content: string;
};

export type Usage = {
  notes_created: number;
  year_month: string; 
}

export type Profile = {
  name: string;
  subscription_plan: string;
  notes_limit: number;
}