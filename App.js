import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ResultsScreen from './screens/ResultsScreen';
import BookDetailsScreen from './screens/BookDetailsScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import ReservationsScreen from './screens/ReservationsScreen';
import ShelfMapScreen from './screens/ShelfMapScreen';
import ReserveBookScreen from './screens/ReserveBookScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import AppButton from './components/AppButton';

const books = [
  { id: '1', title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: 'Self Development', available: true, copies: 3, color: '#FFD9A0' },
  { id: '2', title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0061122415', category: 'Fiction', available: true, copies: 1, color: '#CFE7FF' },
  { id: '3', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Computing', available: false, copies: 0, color: '#E1D7FF' },
  { id: '4', title: 'The Psychology of Money', author: 'Morgan Housel', isbn: '978-0857197689', category: 'Finance', available: true, copies: 2, color: '#CFF3DF' },
];

const rooms = ['Quiet Study Room', 'Group Study Room', 'Digital Reading Room'];

function Header({ title, subtitle, back, onBack }) {
  return (
    <View style={styles.header}>
      {back ? <Pressable accessibilityRole="button" onPress={onBack} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable> : <View style={styles.logo}><Text style={styles.logoText}>L</Text></View>}
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.avatar}><Text style={styles.avatarText}>AS</Text></View>
    </View>
  );
}

function BookCover({ book, large = false }) {
  return <View style={[styles.bookCover, { backgroundColor: book.color }, large && styles.bookCoverLarge]}><Text style={[styles.coverInitial, large && styles.coverInitialLarge]}>{book.title.slice(0, 1)}</Text></View>;
}

function Availability({ book }) {
  return <View style={[styles.availability, book.available ? styles.available : styles.unavailable]}><View style={[styles.statusDot, book.available ? styles.dotGreen : styles.dotRed]} /><Text style={[styles.availabilityText, book.available ? styles.availableText : styles.unavailableText]}>{book.available ? `${book.copies} available` : 'Currently unavailable'}</Text></View>;
}

function BookRow({ book, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.bookRow, pressed && styles.pressed]}>
      <BookCover book={book} />
      <View style={styles.bookInfo}>
        <Text numberOfLines={1} style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
        <Text style={styles.bookCategory}>{book.category}</Text>
        <Availability book={book} />
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [catalogue, setCatalogue] = useState(books);
  const [query, setQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(books[0]);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  const [reserved, setReserved] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return catalogue;
    return catalogue.filter((book) => `${book.title} ${book.author} ${book.isbn} ${book.category}`.toLowerCase().includes(term));
  }, [query, catalogue]);

  const openBook = (book) => { setSelectedBook(book); setScreen('bookDetails'); };
  const reserveBook = () => {
    if (!selectedBook.available) return;
    setReserved((items) => items.some((item) => item.id === selectedBook.id) ? items : [...items, selectedBook]);
    setCatalogue((items) => items.map((item) => item.id === selectedBook.id ? { ...item, available: false, copies: 0 } : item));
    setScreen('confirmation');
  };
  const cancelReservation = (book) => {
    setReserved((items) => items.filter((item) => item.id !== book.id));
    setCatalogue((items) => items.map((item) => item.id === book.id ? { ...item, available: true, copies: Math.max(1, book.copies) } : item));
    Alert.alert('Reservation cancelled', `${book.title} is available in the catalogue again.`);
  };

  if (screen === 'welcome') return <WelcomeScreen onStart={() => setScreen('login')} onPreview={() => setScreen('preview')} />;
  if (screen === 'preview') return <ScreenPreview onBack={() => setScreen('welcome')} onOpen={setScreen} />;
  if (screen === 'login') return <LoginScreen email={email} password={password} setEmail={setEmail} setPassword={setPassword} onLogin={() => setScreen('home')} onRegister={() => setScreen('register')} onForgot={() => setScreen('forgot')} />;
  if (screen === 'forgot') return <ForgotPasswordScreen initialEmail={email} onBack={() => setScreen('login')} />;
  if (screen === 'register') return <RegisterScreen onBack={() => setScreen('login')} onComplete={() => setScreen('home')} />;
  if (screen === 'home') return <HomeScreen catalogue={catalogue} onSearch={() => setScreen('search')} onReservations={() => setScreen('reservations')} onRoom={() => setScreen('room')} openBook={openBook} />;
  if (screen === 'search') return <SearchScreen query={query} setQuery={setQuery} results={results} onBack={() => setScreen('home')} onSearch={() => setScreen('results')} />;
  if (screen === 'results') return <ResultsScreen query={query} results={results} onBack={() => setScreen('search')} openBook={openBook} />;
  if (screen === 'bookDetails') return <BookDetailsScreen book={selectedBook} onBack={() => setScreen('results')} onReserve={() => setScreen('reserve')} />;
  if (screen === 'shelfMap') return <ShelfMapScreen book={selectedBook} onBack={() => setScreen('bookDetails')} />;
  if (screen === 'reserve') return <ReserveBookScreen book={selectedBook} onBack={() => setScreen('bookDetails')} onConfirm={reserveBook} />;
  if (screen === 'confirmation') return <ConfirmationScreen book={selectedBook} onHome={() => setScreen('home')} onReservations={() => setScreen('reservations')} />;
  if (screen === 'reservations') return <ReservationsScreen items={reserved} onBack={() => setScreen('home')} onSearch={() => setScreen('search')} onCancel={cancelReservation} />;
  return <HomeScreen catalogue={catalogue} onSearch={() => setScreen('search')} onReservations={() => setScreen('reservations')} onRoom={() => setScreen('shelfMap')} openBook={openBook} />;
}

function Page({ children }) {
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" /><ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>{children}</ScrollView></SafeAreaView>;
}

function ScreenPreview({ onBack, onOpen }) {
  const screens = [
    ['welcome', '01', 'Welcome', 'First screen and app introduction'],
    ['login', '02', 'Sign in', 'Password validation and account entry'],
    ['register', '03', 'Create account', 'Student registration form'],
    ['home', '04', 'Home dashboard', 'Search, reservations and room shortcuts'],
    ['search', '05', 'Search books', 'Title, author, ISBN and categories'],
    ['results', '06', 'Search results', 'Live availability result list'],
    ['bookDetails', '07', 'Book details', 'Availability and reserve action'],
    ['shelfMap', '08', 'Shelf map', 'Find the book location in the library'],
    ['reserve', '09', 'Reserve book', 'Choose pickup date and time'],
    ['reservations', '10', 'My reservations', 'Pickup status and reservation list'],
  ];
  return <Page><Header title="Screen preview" subtitle="Open any screen without signing in" back onBack={onBack} />
    <Text style={styles.screenLead}>Use this gallery when reviewing your HCI design. Every item opens a working app screen.</Text>
    {screens.map(([key, number, title, copy]) => <Pressable key={key} onPress={() => onOpen(key)} style={({ pressed }) => [styles.previewCard, pressed && styles.pressed]}>
      <View style={styles.previewNumber}><Text style={styles.previewNumberText}>{number}</Text></View><View style={styles.previewText}><Text style={styles.bookTitle}>{title}</Text><Text style={styles.bookAuthor}>{copy}</Text></View><Text style={styles.chevron}>›</Text>
    </Pressable>)}
  </Page>;
}

function DetailRow({ label, value }) { return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F8FC' }, page: { padding: 20, paddingBottom: 44 }, welcomeSafe: { flex: 1, backgroundColor: '#273B7A' }, welcome: { flex: 1, padding: 28, justifyContent: 'center' },
  welcomeLogo: { width: 72, height: 72, borderRadius: 22, backgroundColor: '#F6C85F', justifyContent: 'center', alignItems: 'center', marginBottom: 26 }, welcomeLogoText: { fontSize: 38, fontWeight: '900', color: '#273B7A' },
  welcomeTitle: { color: '#FFF', fontSize: 38, fontWeight: '800' }, welcomeSubtitle: { color: '#DCE5FF', fontSize: 17, lineHeight: 25, marginTop: 10, marginBottom: 36 }, featureBox: { flexDirection: 'row', gap: 15, borderWidth: 1, borderColor: '#6C80BE', backgroundColor: '#344987', padding: 18, borderRadius: 18 }, featureIcon: { color: '#F6C85F', fontSize: 32 }, featureTitle: { color: '#FFF', fontSize: 17, fontWeight: '700' }, featureCopy: { color: '#DCE5FF', marginTop: 4 }, welcomeBottom: { marginTop: 'auto' }, welcomeFootnote: { color: '#BFCBF4', textAlign: 'center', marginTop: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 }, logo: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#304B9B', alignItems: 'center', justifyContent: 'center' }, logoText: { color: '#FFF', fontSize: 23, fontWeight: '900' }, headerText: { flex: 1, marginLeft: 12 }, headerTitle: { fontSize: 21, fontWeight: '800', color: '#1D2742' }, headerSubtitle: { color: '#69738D', marginTop: 2 }, avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E5E9F8', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#304B9B', fontSize: 12, fontWeight: '800' }, back: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#E8ECF7', alignItems: 'center', justifyContent: 'center' }, backText: { fontSize: 35, lineHeight: 38, color: '#304B9B' },
  authTop: { alignItems: 'center', marginTop: 36, marginBottom: 42 }, authTitle: { fontSize: 30, fontWeight: '800', color: '#1D2742', marginTop: 18 }, authCopy: { color: '#69738D', marginTop: 7, fontSize: 16 }, label: { color: '#303A54', fontWeight: '700', marginBottom: 8, marginTop: 16 }, input: { backgroundColor: '#FFF', borderColor: '#D9DEEB', borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 15, fontSize: 16, color: '#1D2742' }, forgot: { color: '#304B9B', fontWeight: '700', textAlign: 'right', marginTop: 12, marginBottom: 24 }, button: { minHeight: 54, backgroundColor: '#304B9B', justifyContent: 'center', alignItems: 'center', borderRadius: 14, marginTop: 12, paddingHorizontal: 16 }, buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' }, secondaryButton: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#C9D0E2' }, secondaryButtonText: { color: '#304B9B' }, disabledButton: { opacity: 0.5 }, pressed: { opacity: 0.78 }, or: { textAlign: 'center', color: '#8B93A7', fontWeight: '700', marginTop: 24 }, authFooter: { textAlign: 'center', color: '#69738D', marginTop: 25 }, link: { color: '#304B9B', fontWeight: '800' }, privacy: { color: '#69738D', lineHeight: 20, marginTop: 22, marginBottom: 12 }, screenLead: { color: '#69738D', fontSize: 16, lineHeight: 23, marginTop: -16, marginBottom: 12 },
  previewCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 14, marginTop: 11, borderWidth: 1, borderColor: '#E4E7F0' }, previewNumber: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E9F8' }, previewNumberText: { color: '#304B9B', fontWeight: '900' }, previewText: { flex: 1, marginLeft: 13 },
  searchBar: { height: 58, backgroundColor: '#FFF', borderColor: '#D9DEEB', borderWidth: 1, borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }, searchIcon: { fontSize: 27, color: '#304B9B', marginRight: 10 }, searchPlaceholder: { color: '#8B93A7', fontSize: 15 }, sectionTitle: { fontSize: 19, fontWeight: '800', color: '#1D2742', marginTop: 28, marginBottom: 13 }, actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, actionCard: { width: '47.8%', minHeight: 145, padding: 15, borderRadius: 18 }, actionPurple: { backgroundColor: '#E5E4FF' }, actionGold: { backgroundColor: '#FFF0C9' }, actionBlue: { backgroundColor: '#D9EDFF' }, actionEmoji: { fontSize: 25, color: '#304B9B' }, actionTitle: { color: '#1D2742', fontWeight: '800', marginTop: 15 }, actionCopy: { color: '#65708D', fontSize: 12, marginTop: 4 },
  bookRow: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E4E7F0' }, bookCover: { width: 62, height: 84, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, bookCoverLarge: { width: 104, height: 140, borderRadius: 14 }, coverInitial: { color: '#243561', fontWeight: '900', fontSize: 28 }, coverInitialLarge: { fontSize: 48 }, bookInfo: { flex: 1, marginLeft: 13 }, bookTitle: { color: '#1D2742', fontSize: 16, fontWeight: '800' }, bookAuthor: { color: '#69738D', marginTop: 4 }, bookCategory: { color: '#304B9B', fontSize: 12, fontWeight: '700', marginTop: 5 }, chevron: { color: '#8B93A7', fontSize: 30 }, availability: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, marginTop: 8 }, available: { backgroundColor: '#DDF5E7' }, unavailable: { backgroundColor: '#FCE0E3' }, statusDot: { height: 6, width: 6, borderRadius: 3, marginRight: 5 }, dotGreen: { backgroundColor: '#168253' }, dotRed: { backgroundColor: '#B53C52' }, availabilityText: { fontSize: 11, fontWeight: '800' }, availableText: { color: '#146B45' }, unavailableText: { color: '#96344A' },
  searchInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderColor: '#304B9B', borderWidth: 2, borderRadius: 15, paddingHorizontal: 15 }, searchInput: { flex: 1, fontSize: 16, paddingVertical: 15, color: '#1D2742' }, helper: { color: '#69738D', marginTop: 10, lineHeight: 20 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, chip: { paddingHorizontal: 13, paddingVertical: 10, backgroundColor: '#E9EDF7', borderRadius: 22 }, chipText: { color: '#405071', fontWeight: '700', fontSize: 13 }, chipActive: { backgroundColor: '#304B9B' }, chipActiveText: { color: '#FFF' }, infoBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#E5ECFF', borderRadius: 13, padding: 14, marginVertical: 26 }, infoIcon: { color: '#304B9B', fontSize: 17, fontWeight: '900' }, infoText: { color: '#30406E', flex: 1, lineHeight: 20 }, resultSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -14, marginBottom: 15 }, resultCount: { color: '#1D2742', fontWeight: '800' }, sortText: { color: '#304B9B', fontWeight: '700', fontSize: 13 }, empty: { alignItems: 'center', backgroundColor: '#FFF', borderRadius: 18, padding: 30, marginTop: 24 }, emptyEmoji: { fontSize: 38, color: '#304B9B' }, emptyTitle: { color: '#1D2742', fontSize: 18, fontWeight: '800', marginTop: 10 }, emptyCopy: { color: '#69738D', textAlign: 'center', lineHeight: 21, marginTop: 7, marginBottom: 16 },
  detailHero: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E4E7F0' }, detailText: { flex: 1, marginLeft: 16 }, detailTitle: { color: '#1D2742', fontSize: 23, fontWeight: '900', lineHeight: 29 }, detailAuthor: { color: '#69738D', fontSize: 16, marginTop: 6 }, detailCard: { backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, marginTop: 18 }, detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#EDF0F5' }, detailLabel: { color: '#69738D' }, detailValue: { color: '#1D2742', fontWeight: '700' }, description: { color: '#4E5871', lineHeight: 22, marginVertical: 22 },
  confirm: { alignItems: 'center', marginTop: 30 }, successCircle: { height: 86, width: 86, borderRadius: 43, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDF5E7' }, successMark: { fontSize: 45, color: '#168253', fontWeight: '900' }, confirmTitle: { color: '#1D2742', fontSize: 27, fontWeight: '900', marginTop: 18 }, confirmCopy: { color: '#69738D', textAlign: 'center', lineHeight: 22, marginTop: 9 }, bold: { fontWeight: '800', color: '#30406E' }, ticket: { backgroundColor: '#304B9B', borderRadius: 20, padding: 22, marginVertical: 30 }, ticketLabel: { color: '#BFCCF8', fontSize: 12, fontWeight: '800', letterSpacing: 1 }, ticketCode: { color: '#FFF', fontSize: 29, fontWeight: '900', letterSpacing: 2, marginTop: 7 }, ticketLine: { borderTopWidth: 1, borderColor: '#8294CD', marginVertical: 18 }, ticketText: { color: '#E0E8FF', marginBottom: 6 },
  reservationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 17, padding: 13, borderWidth: 1, borderColor: '#E4E7F0' }, pickup: { color: '#168253', fontWeight: '800', marginTop: 9 }, roomCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E1E5F0', padding: 15, borderRadius: 16, marginBottom: 11 }, roomSelected: { borderColor: '#304B9B', borderWidth: 2, backgroundColor: '#F3F5FF' }, roomIcon: { color: '#304B9B', fontSize: 25 }, radio: { fontSize: 21, color: '#304B9B' },
});
