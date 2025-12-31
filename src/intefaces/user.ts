export interface IUser {
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  ageRange: '18-25' | '26-35' | '36-45' | '46-55' | '55+';
}