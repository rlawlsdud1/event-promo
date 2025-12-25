export interface Reward {
  id: number;
  name: string;
  image: string;
  count: number;
  detail: string;
  backDescription: string;
  rank: number;
}

export interface EventData {
  id: string;
  title: string;
  endDate: string;
  description: string;
  rewards: Reward[];
}

export interface EntryFormData {
  name: string;
  phone: string;
  email: string;
  agreedTerms: boolean;
}
