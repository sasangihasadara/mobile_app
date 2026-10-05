export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  available: boolean;
  color: string;
  description?: string;
}
export interface Reservation extends Book {
  reservationId: string;
  pickupCode: string;
  pickupDate: string;
  pickupWindow: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
}
export interface Credentials {
  email: string;
  password: string;
  name?: string;
  studentId?: string;
}
export interface Pickup {
  pickupDate: string;
  pickupWindow: string;
}
export type Action = () => void;
export interface ScreenProps {
  book: Book & Partial<Reservation>;
  busy: boolean;
  user: User | null;
  catalogue: Book[];
  results: Book[];
  items: Reservation[];
  query: string;
  email: string;
  password: string;
  initialEmail: string;
  setEmail: (s: string) => void;
  setPassword: (s: string) => void;
  setQuery: (s: string) => void;
  openBook: (book: Book) => void;
  onComplete: (details: Credentials) => void;
  onConfirm: (pickup: Pickup) => void;
  onCancel: (book: Reservation) => void;
  onStart: Action;
  onPreview: Action;
  onBack: Action;
  onHome: Action;
  onSearch: Action;
  onHolds: Action;
  onReserve: Action;
  onReservations: Action;
  onCancelAll: Action;
  onLogin: Action;
  onLogout: Action;
  onRegister: Action;
  onForgot: Action;
  onRoom: Action;
}
