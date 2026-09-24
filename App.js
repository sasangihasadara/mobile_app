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

const books = [
  { id: '1', title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: 'Self Development', available: true, copies: 3, color: '#FFD9A0' },
  { id: '2', title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0061122415', category: 'Fiction', available: true, copies: 1, color: '#CFE7FF' },
  { id: '3', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Computing', available: false, copies: 0, color: '#E1D7FF' },
  { id: '4', title: 'The Psychology of Money', author: 'Morgan Housel', isbn: '978-0857197689', category: 'Finance', available: true, copies: 2, color: '#CFF3DF' },
];

const rooms = ['Quiet Study Room', 'Group Study Room', 'Digital Reading Room'];

function AppButton({ title, onPress, secondary = false, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, secondary && styles.secondaryButton, disabled && styles.disabledButton, pressed && styles.pressed]}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>{title}</Text>
    </Pressable>
  );
}

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

  if (screen === 'welcome') return <Welcome onStart={() => setScreen('login')} onPreview={() => setScreen('preview')} />;
  if (screen === 'preview') return <ScreenPreview onBack={() => setScreen('welcome')} onOpen={setScreen} />;
  if (screen === 'login') return <Login email={email} password={password} setEmail={setEmail} setPassword={setPassword} onLogin={() => setScreen('home')} onRegister={() => setScreen('register')} />;
  if (screen === 'register') return <Register onBack={() => setScreen('login')} onComplete={() => setScreen('home')} />;
  if (screen === 'home') return <Home onSearch={() => setScreen('search')} onReservations={() => setScreen('reservations')} onRoom={() => setScreen('room')} openBook={openBook} />;
  if (screen === 'search') return <Search query={query} setQuery={setQuery} results={results} onBack={() => setScreen('home')} onSearch={() => setScreen('results')} />;
  if (screen === 'results') return <Results query={query} results={results} onBack={() => setScreen('search')} openBook={openBook} />;
  if (screen === 'bookDetails') return <BookDetails book={selectedBook} onBack={() => setScreen('results')} onReserve={reserveBook} />;
  if (screen === 'confirmation') return <Confirmation book={selectedBook} onHome={() => setScreen('home')} onReservations={() => setScreen('reservations')} />;
  if (screen === 'reservations') return <Reservations items={reserved} onBack={() => setScreen('home')} onSearch={() => setScreen('search')} />;
  return <ReadingRoom selected={selectedRoom} setSelected={setSelectedRoom} onBack={() => setScreen('home')} />;
}

function Page({ children }) {
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" /><ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>{children}</ScrollView></SafeAreaView>;
}

function Welcome({ onStart, onPreview }) {
  return <SafeAreaView style={styles.welcomeSafe}><StatusBar barStyle="light-content" /><View style={styles.welcome}>
    <View style={styles.welcomeLogo}><Text style={styles.welcomeLogoText}>L</Text></View>
    <Text style={styles.welcomeTitle}>LibraReserve</Text>
    <Text style={styles.welcomeSubtitle}>Find books, reserve them instantly, and book your perfect study space.</Text>
    <View style={styles.featureBox}><Text style={styles.featureIcon}>⌕</Text><View><Text style={styles.featureTitle}>Search smarter</Text><Text style={styles.featureCopy}>See live availability before you visit.</Text></View></View>
    <View style={styles.welcomeBottom}><AppButton title="Get started" onPress={onStart} /><AppButton title="Browse all screens" secondary onPress={onPreview} /><Text style={styles.welcomeFootnote}>Your campus library, in your pocket.</Text></View>
  </View></SafeAreaView>;
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
    ['confirmation', '08', 'Reservation confirmation', 'Pickup code and next actions'],
    ['reservations', '09', 'My reservations', 'Pickup status and reservation list'],
    ['room', '10', 'Reading room booking', 'Room and time-slot selection'],
  ];
  return <Page><Header title="Screen preview" subtitle="Open any screen without signing in" back onBack={onBack} />
    <Text style={styles.screenLead}>Use this gallery when reviewing your HCI design. Every item opens a working app screen.</Text>
    {screens.map(([key, number, title, copy]) => <Pressable key={key} onPress={() => onOpen(key)} style={({ pressed }) => [styles.previewCard, pressed && styles.pressed]}>
      <View style={styles.previewNumber}><Text style={styles.previewNumberText}>{number}</Text></View><View style={styles.previewText}><Text style={styles.bookTitle}>{title}</Text><Text style={styles.bookAuthor}>{copy}</Text></View><Text style={styles.chevron}>›</Text>
    </Pressable>)}
  </Page>;
}

function Login({ email, password, setEmail, setPassword, onLogin, onRegister }) {
  const submit = () => {
    if (!email.includes('@') || password.length < 6) return Alert.alert('Check your details', 'Enter a valid email and a password with at least 6 characters.');
    onLogin();
  };
  return <Page><View style={styles.authTop}><View style={styles.logo}><Text style={styles.logoText}>L</Text></View><Text style={styles.authTitle}>Welcome back</Text><Text style={styles.authCopy}>Sign in to manage your library life.</Text></View>
    <Text style={styles.label}>University email</Text><TextInput accessibilityLabel="University email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@university.edu" placeholderTextColor="#8B93A7" style={styles.input} />
    <Text style={styles.label}>Password</Text><TextInput accessibilityLabel="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password" placeholderTextColor="#8B93A7" style={styles.input} />
    <Pressable onPress={() => Alert.alert('Password reset', 'A reset link would be sent to your university email.')}><Text style={styles.forgot}>Forgot password?</Text></Pressable>
    <AppButton title="Sign in" onPress={submit} /><Text style={styles.or}>OR</Text><AppButton title="Continue with campus account" secondary onPress={() => Alert.alert('Campus sign-in', 'Connect your university OAuth account here.')} />
    <Text style={styles.authFooter}>New here? <Text onPress={onRegister} style={styles.link}>Create an account</Text></Text>
  </Page>;
}

function Register({ onBack, onComplete }) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  return <Page><Header title="Create account" back onBack={onBack} /><Text style={styles.screenLead}>Create your library account in less than a minute.</Text>
    <Text style={styles.label}>Full name</Text><TextInput value={name} onChangeText={setName} placeholder="Your full name" placeholderTextColor="#8B93A7" style={styles.input} />
    <Text style={styles.label}>Student ID</Text><TextInput value={studentId} onChangeText={setStudentId} placeholder="IT12345678" placeholderTextColor="#8B93A7" style={styles.input} />
    <Text style={styles.label}>University email</Text><TextInput autoCapitalize="none" keyboardType="email-address" placeholder="you@university.edu" placeholderTextColor="#8B93A7" style={styles.input} />
    <Text style={styles.privacy}>By creating an account, you agree to the library borrowing and room-use policies.</Text><AppButton title="Create account" onPress={() => name && studentId ? onComplete() : Alert.alert('Almost there', 'Enter your name and student ID.')} />
  </Page>;
}

function Home({ onSearch, onReservations, onRoom, openBook }) {
  return <Page><Header title="Good morning, Anya" subtitle="What would you like to do today?" />
    <Pressable onPress={onSearch} style={styles.searchBar}><Text style={styles.searchIcon}>⌕</Text><Text style={styles.searchPlaceholder}>Search title, author or ISBN</Text></Pressable>
    <Text style={styles.sectionTitle}>Quick actions</Text><View style={styles.actionGrid}>
      <Pressable onPress={onSearch} style={[styles.actionCard, styles.actionPurple]}><Text style={styles.actionEmoji}>⌕</Text><Text style={styles.actionTitle}>Search books</Text><Text style={styles.actionCopy}>Find what you need</Text></Pressable>
      <Pressable onPress={onReservations} style={[styles.actionCard, styles.actionGold]}><Text style={styles.actionEmoji}>▣</Text><Text style={styles.actionTitle}>My reservations</Text><Text style={styles.actionCopy}>Track your pickups</Text></Pressable>
      <Pressable onPress={onRoom} style={[styles.actionCard, styles.actionBlue]}><Text style={styles.actionEmoji}>⌂</Text><Text style={styles.actionTitle}>Reading rooms</Text><Text style={styles.actionCopy}>Book a study space</Text></Pressable>
    </View>
    <Text style={styles.sectionTitle}>Popular this week</Text>{books.slice(0, 2).map((book) => <BookRow key={book.id} book={book} onPress={() => openBook(book)} />)}
  </Page>;
}

function Search({ query, setQuery, results, onBack, onSearch }) {
  return <Page><Header title="Search books" subtitle="Search by title, author or ISBN" back onBack={onBack} />
    <View style={styles.searchInputWrap}><Text style={styles.searchIcon}>⌕</Text><TextInput accessibilityLabel="Search books" autoFocus value={query} onChangeText={setQuery} onSubmitEditing={onSearch} placeholder="Try “Atomic Habits”" placeholderTextColor="#8B93A7" style={styles.searchInput} returnKeyType="search" /></View>
    <Text style={styles.helper}>Results update as you type. Availability is live.</Text>
    <Text style={styles.sectionTitle}>Browse by category</Text><View style={styles.chips}>{['Fiction', 'Computing', 'Finance', 'Self Development'].map((item) => <Pressable key={item} onPress={() => { setQuery(item); onSearch(); }} style={styles.chip}><Text style={styles.chipText}>{item}</Text></Pressable>)}</View>
    <View style={styles.infoBanner}><Text style={styles.infoIcon}>i</Text><Text style={styles.infoText}>{results.length} books match your current search.</Text></View>
    <AppButton title="See search results" onPress={onSearch} />
  </Page>;
}

function Results({ query, results, onBack, openBook }) {
  return <Page><Header title="Search results" subtitle={query ? `Results for “${query}”` : 'Browse all books'} back onBack={onBack} />
    <View style={styles.resultSummary}><Text style={styles.resultCount}>{results.length} {results.length === 1 ? 'book' : 'books'} found</Text><Text style={styles.sortText}>Sort: Relevance ▾</Text></View>
    {results.length ? results.map((book) => <BookRow key={book.id} book={book} onPress={() => openBook(book)} />) : <View style={styles.empty}><Text style={styles.emptyEmoji}>⌕</Text><Text style={styles.emptyTitle}>No books found</Text><Text style={styles.emptyCopy}>Try the book title, author name, or ISBN number.</Text></View>}
  </Page>;
}

function BookDetails({ book, onBack, onReserve }) {
  return <Page><Header title="Book details" back onBack={onBack} /><View style={styles.detailHero}><BookCover book={book} large /><View style={styles.detailText}><Text style={styles.detailTitle}>{book.title}</Text><Text style={styles.detailAuthor}>by {book.author}</Text><Text style={styles.bookCategory}>{book.category}</Text><Availability book={book} /></View></View>
    <View style={styles.detailCard}><DetailRow label="ISBN" value={book.isbn} /><DetailRow label="Shelf" value="Level 2 · A-14" /><DetailRow label="Loan period" value="14 days" /><DetailRow label="Pickup point" value="Main library desk" /></View>
    <Text style={styles.description}>A well-loved title selected by students. Reserve an available copy now and collect it from the main library desk.</Text>
    <AppButton title={book.available ? 'Reserve this book' : 'Join waitlist'} onPress={book.available ? onReserve : () => Alert.alert('Waitlist joined', 'We will notify you when a copy is returned.')} />
  </Page>;
}

function DetailRow({ label, value }) { return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>; }

function Confirmation({ book, onHome, onReservations }) {
  return <Page><View style={styles.confirm}><View style={styles.successCircle}><Text style={styles.successMark}>✓</Text></View><Text style={styles.confirmTitle}>Book reserved!</Text><Text style={styles.confirmCopy}>Your copy of <Text style={styles.bold}>{book.title}</Text> will be held until 6:00 PM tomorrow.</Text></View>
    <View style={styles.ticket}><Text style={styles.ticketLabel}>PICKUP CODE</Text><Text style={styles.ticketCode}>LB-{book.id}724</Text><View style={styles.ticketLine} /><Text style={styles.ticketText}>Main Library · Ground floor desk</Text><Text style={styles.ticketText}>Bring your student ID when collecting.</Text></View>
    <AppButton title="View my reservations" onPress={onReservations} /><AppButton title="Back to home" secondary onPress={onHome} />
  </Page>;
}

function Reservations({ items, onBack, onSearch }) {
  return <Page><Header title="My reservations" subtitle="Manage your book pickups" back onBack={onBack} />
    {items.length ? items.map((book) => <View key={book.id} style={styles.reservationCard}><BookCover book={book} /><View style={styles.bookInfo}><Text style={styles.bookTitle}>{book.title}</Text><Text style={styles.bookAuthor}>Pickup by tomorrow, 6:00 PM</Text><Text style={styles.pickup}>Ready for pickup</Text></View></View>) : <View style={styles.empty}><Text style={styles.emptyEmoji}>▣</Text><Text style={styles.emptyTitle}>No reservations yet</Text><Text style={styles.emptyCopy}>Search the catalogue and reserve an available book.</Text><AppButton title="Search books" onPress={onSearch} /></View>}
  </Page>;
}

function ReadingRoom({ selected, setSelected, onBack }) {
  const [time, setTime] = useState('10:00 AM – 12:00 PM');
  return <Page><Header title="Reading rooms" subtitle="Reserve your study space" back onBack={onBack} /><Text style={styles.sectionTitle}>Choose a room</Text>
    {rooms.map((room) => <Pressable key={room} onPress={() => setSelected(room)} style={[styles.roomCard, selected === room && styles.roomSelected]}><Text style={styles.roomIcon}>⌂</Text><View style={styles.bookInfo}><Text style={styles.bookTitle}>{room}</Text><Text style={styles.bookAuthor}>{room === rooms[0] ? '1–2 people · Silent' : room === rooms[1] ? '3–6 people · Whiteboard' : 'Computers · E-resources'}</Text></View><Text style={styles.radio}>{selected === room ? '●' : '○'}</Text></Pressable>)}
    <Text style={styles.sectionTitle}>Choose a time</Text><View style={styles.chips}>{['9–10 AM', '10 AM – 12 PM', '1–3 PM'].map((item) => <Pressable key={item} onPress={() => setTime(item)} style={[styles.chip, time === item && styles.chipActive]}><Text style={[styles.chipText, time === item && styles.chipActiveText]}>{item}</Text></Pressable>)}</View>
    <View style={styles.infoBanner}><Text style={styles.infoIcon}>✓</Text><Text style={styles.infoText}>{selected} is available today.</Text></View><AppButton title="Confirm room booking" onPress={() => Alert.alert('Room booked', `${selected} is reserved for ${time}.`)} />
  </Page>;
}

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
