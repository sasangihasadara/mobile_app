import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const windows = ['9:00 - 11:00 AM', '12:00 - 2:00 PM', '4:00 - 6:00 PM'];
const rooms = ['Quiet Study Room', 'Group Study Room', 'Digital Reading Room'];

function nextDate(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function Pill({ children, tone = 'blue' }) {
  return <View style={[s.pill, tone === 'green' && s.greenPill, tone === 'red' && s.redPill]}><Text style={[s.pillText, tone === 'green' && s.greenText, tone === 'red' && s.redText]}>{children}</Text></View>;
}

function BookCard({ book, active, onPress }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [s.bookCard, active && s.activeCard, pressed && s.pressed]}>
    <View style={[s.cover, { backgroundColor: book.color }]}><Text style={s.coverText}>{book.title.slice(0, 1)}</Text></View>
    <View style={s.bookBody}>
      <Text numberOfLines={1} style={s.bookTitle}>{book.title}</Text>
      <Text style={s.muted}>{book.author}</Text>
      <View style={s.cardFooter}><Pill>{book.category}</Pill><Pill tone={book.available ? 'green' : 'red'}>{book.available ? `${book.copies} copies` : 'Unavailable'}</Pill></View>
    </View>
  </Pressable>;
}

function AuthPanel({ mode, setMode, busy, email, password, setEmail, setPassword, authenticate }) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const submit = () => {
    if (mode === 'forgot') return Alert.alert('Password recovery', 'Contact the library administrator to reset your password.');
    if (!email.trim().includes('@') || password.length < 8) return Alert.alert('Check details', 'Use a valid email and a password with at least 8 characters.');
    if (mode === 'register') {
      if (!name.trim() || !studentId.trim()) return Alert.alert('Almost there', 'Enter your full name and student ID.');
      authenticate('register', { name, studentId, email, password });
      return;
    }
    authenticate('login', { email, password });
  };

  return <View style={s.authShell}>
    <View style={s.authHero}>
      <View style={s.brandMark}><Text style={s.brandMarkText}>L</Text></View>
      <Text style={s.heroTitle}>LibraReserve</Text>
      <Text style={s.heroCopy}>Secure access for students and staff to manage library reservations, borrowing activity, and reading-room services.</Text>
      <View style={s.heroStats}><View><Text style={s.statValue}>Library</Text><Text style={s.statLabel}>student services</Text></View><View><Text style={s.statValue}>Secure</Text><Text style={s.statLabel}>account access</Text></View><View><Text style={s.statValue}>Support</Text><Text style={s.statLabel}>front desk help</Text></View></View>
      <View style={s.heroPreview}>
        <View style={s.previewHeader}>
          <Text style={s.previewTitle}>Portal access</Text>
          <View style={s.liveBadge}><Text style={s.liveBadgeText}>Sign-in required</Text></View>
        </View>
        <Text style={s.accessCopy}>Use your university email and password to continue. Catalogue availability, reservations, pickup codes, and account details are shown only inside the protected portal.</Text>
        <View style={s.accessList}>
          <View style={s.accessItem}><Text style={s.checkMark}>✓</Text><Text style={s.accessText}>Search library holdings and reserve eligible books</Text></View>
          <View style={s.accessItem}><Text style={s.checkMark}>✓</Text><Text style={s.accessText}>View your personal reservation and pickup details</Text></View>
          <View style={s.accessItem}><Text style={s.checkMark}>✓</Text><Text style={s.accessText}>Manage cancellations and reading-room requests</Text></View>
        </View>
        <View style={s.noticeBox}><Text style={s.noticeTitle}>Need help signing in?</Text><Text style={s.noticeText}>Contact the library circulation desk or your department administrator to reset account access.</Text></View>
      </View>
    </View>
    <View style={s.authCard}>
      <Text style={s.eyebrow}>{mode === 'register' ? 'New member' : mode === 'forgot' ? 'Account help' : 'Member access'}</Text>
      <Text style={s.authTitle}>{mode === 'register' ? 'Create account' : mode === 'forgot' ? 'Reset password' : 'Sign in'}</Text>
      {mode === 'register' ? <>
        <Text style={s.label}>Full name</Text><TextInput value={name} onChangeText={setName} placeholder="Your full name" style={s.input} />
        <Text style={s.label}>Student ID</Text><TextInput value={studentId} onChangeText={setStudentId} placeholder="IT12345678" style={s.input} />
      </> : null}
      <Text style={s.label}>University email</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@university.edu" style={s.input} />
      {mode !== 'forgot' ? <><Text style={s.label}>Password</Text><TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 8 characters" style={s.input} /></> : null}
      <Pressable disabled={busy} onPress={submit} style={s.primary}><Text style={s.primaryText}>{busy ? 'Please wait...' : mode === 'register' ? 'Create account' : mode === 'forgot' ? 'Request help' : 'Sign in'}</Text></Pressable>
      <View style={s.authLinks}>
        <Text onPress={() => setMode(mode === 'register' ? 'login' : 'register')} style={s.link}>{mode === 'register' ? 'Back to sign in' : 'Create account'}</Text>
        <Text onPress={() => setMode('forgot')} style={s.link}>Forgot password?</Text>
      </View>
    </View>
  </View>;
}

function InstitutionalAuthPanel({ mode, setMode, busy, email, password, setEmail, setPassword, authenticate }) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const submit = () => {
    if (mode === 'forgot') return Alert.alert('Password recovery', 'Contact the library administrator to reset your password.');
    if (!email.trim().includes('@') || password.length < 8) return Alert.alert('Check details', 'Use a valid email and a password with at least 8 characters.');
    if (mode === 'register') {
      if (!name.trim() || !studentId.trim()) return Alert.alert('Almost there', 'Enter your full name and student ID.');
      authenticate('register', { name, studentId, email, password });
      return;
    }
    authenticate('login', { email, password });
  };

  return <View style={s.authShell}>
    <View style={s.authHeroClean}>
      <View style={s.heroContent}>
        <View style={s.portalTop}>
          <View style={s.brandMark}><Text style={s.brandMarkText}>L</Text></View>
          <View><Text style={s.portalLabel}>University Library Services</Text><Text style={s.portalSub}>Student and staff access portal</Text></View>
        </View>
        <Text style={s.heroTitle}>LibraReserve</Text>
        <Text style={s.heroCopy}>Access library reservations, borrowing activity, and reading-room services through a protected university account.</Text>
        <View style={s.serviceGrid}>
          <View style={s.serviceCard}><Text style={s.serviceKicker}>Catalogue</Text><Text style={s.serviceTitle}>Search and reserve books</Text><Text style={s.serviceText}>Find holdings and reserve eligible items after sign in.</Text></View>
          <View style={s.serviceCard}><Text style={s.serviceKicker}>Reading rooms</Text><Text style={s.serviceTitle}>Manage study access</Text><Text style={s.serviceText}>Check room options and manage reading-room requests.</Text></View>
          <View style={s.serviceCard}><Text style={s.serviceKicker}>Account</Text><Text style={s.serviceTitle}>Private reservation details</Text><Text style={s.serviceText}>View pickup information only inside your account.</Text></View>
          <View style={s.serviceCard}><Text style={s.serviceKicker}>Support</Text><Text style={s.serviceTitle}>Library desk assistance</Text><Text style={s.serviceText}>Contact staff if your university login needs help.</Text></View>
        </View>
        <View style={s.portalNotice}>
          <View style={s.noticeColumn}><Text style={s.noticeTitle}>Protected service</Text><Text style={s.noticeText}>Catalogue availability, pickup codes, reservation history, and student details are shown only after authentication.</Text></View>
          <View style={s.noticeDivider} />
          <View style={s.noticeColumn}><Text style={s.noticeTitle}>Need help?</Text><Text style={s.noticeText}>Visit the circulation desk or contact your department administrator for account support.</Text></View>
        </View>
      </View>
    </View>
    <View style={s.authSide}>
      <View style={s.authCard}>
        <Text style={s.eyebrow}>{mode === 'register' ? 'New member' : mode === 'forgot' ? 'Account help' : 'Member access'}</Text>
        <Text style={s.authTitle}>{mode === 'register' ? 'Create account' : mode === 'forgot' ? 'Reset password' : 'Sign in'}</Text>
        {mode === 'register' ? <>
          <Text style={s.label}>Full name</Text><TextInput value={name} onChangeText={setName} placeholder="Your full name" style={s.input} />
          <Text style={s.label}>Student ID</Text><TextInput value={studentId} onChangeText={setStudentId} placeholder="IT12345678" style={s.input} />
        </> : null}
        <Text style={s.label}>University email</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@university.edu" style={s.input} />
        {mode !== 'forgot' ? <><Text style={s.label}>Password</Text><TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 8 characters" style={s.input} /></> : null}
        <Pressable disabled={busy} onPress={submit} style={s.primary}><Text style={s.primaryText}>{busy ? 'Please wait...' : mode === 'register' ? 'Create account' : mode === 'forgot' ? 'Request help' : 'Sign in'}</Text></Pressable>
        <View style={s.authLinks}>
          <Text onPress={() => setMode(mode === 'register' ? 'login' : 'register')} style={s.link}>{mode === 'register' ? 'Back to sign in' : 'Create account'}</Text>
          <Text onPress={() => setMode('forgot')} style={s.link}>Forgot password?</Text>
        </View>
      </View>
    </View>
  </View>;
}

export default function WebApp({ busy, books, query, setQuery, results, reservations, user, email, password, setEmail, setPassword, authenticate, logout, reserveBook, cancelReservation, cancelAll }) {
  const [mode, setMode] = useState('login');
  const [section, setSection] = useState('dashboard');
  const [selected, setSelected] = useState(books[0]);
  const [pickupDate, setPickupDate] = useState(nextDate(1));
  const [pickupWindow, setPickupWindow] = useState(windows[0]);

  const availableCount = useMemo(() => books.reduce((total, book) => total + (book.copies || 0), 0), [books]);
  const selectedBook = books.find(book => book.id === selected?.id) || selected || books[0];
  const nav = [['dashboard', 'Dashboard'], ['catalogue', 'Catalogue'], ['reservations', 'Reservations'], ['rooms', 'Reading rooms'], ['account', 'Account']];

  if (!user) return <InstitutionalAuthPanel mode={mode} setMode={setMode} busy={busy} email={email} password={password} setEmail={setEmail} setPassword={setPassword} authenticate={authenticate} />;

  return <View style={s.shell}>
    <View style={s.sidebar}>
      <View style={s.sideBrand}><View style={s.logo}><Text style={s.logoText}>L</Text></View><View><Text style={s.sideTitle}>LibraReserve</Text><Text style={s.sideSub}>Library portal</Text></View></View>
      <View style={s.nav}>{nav.map(([key, label]) => <Pressable key={key} onPress={() => setSection(key)} style={[s.navItem, section === key && s.navActive]}><Text style={[s.navText, section === key && s.navTextActive]}>{label}</Text></Pressable>)}</View>
      <Pressable onPress={logout} style={s.logout}><Text style={s.logoutText}>Sign out</Text></Pressable>
    </View>
    <ScrollView style={s.main} contentContainerStyle={s.mainContent}>
      <View style={s.topbar}><View><Text style={s.pageTitle}>{nav.find(item => item[0] === section)?.[1]}</Text><Text style={s.pageSub}>Welcome, {user.name}. Manage library work from one desktop view.</Text></View><View style={s.userBadge}><Text style={s.userInitial}>{user.name?.slice(0, 1) || 'U'}</Text></View></View>

      {section === 'dashboard' ? <View>
        <View style={s.statsGrid}><View style={s.statCard}><Text style={s.statNumber}>{books.length}</Text><Text style={s.statCaption}>Catalogue books</Text></View><View style={s.statCard}><Text style={s.statNumber}>{availableCount}</Text><Text style={s.statCaption}>Copies available</Text></View><View style={s.statCard}><Text style={s.statNumber}>{reservations.length}</Text><Text style={s.statCaption}>Your reservations</Text></View></View>
        <View style={s.twoCol}><View style={s.panel}><Text style={s.panelTitle}>Quick search</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search by title, author, ISBN or category" style={s.input} /><View style={s.bookGrid}>{results.slice(0, 4).map(book => <BookCard key={book.id} book={book} active={selectedBook?.id === book.id} onPress={() => { setSelected(book); setSection('catalogue'); }} />)}</View></View><DetailPanel book={selectedBook} pickupDate={pickupDate} pickupWindow={pickupWindow} setPickupDate={setPickupDate} setPickupWindow={setPickupWindow} reserveBook={reserveBook} busy={busy} /></View>
      </View> : null}

      {section === 'catalogue' ? <View style={s.twoCol}><View style={s.panel}><Text style={s.panelTitle}>Browse catalogue</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search books" style={s.input} /><View style={s.bookGrid}>{results.map(book => <BookCard key={book.id} book={book} active={selectedBook?.id === book.id} onPress={() => setSelected(book)} />)}</View></View><DetailPanel book={selectedBook} pickupDate={pickupDate} pickupWindow={pickupWindow} setPickupDate={setPickupDate} setPickupWindow={setPickupWindow} reserveBook={reserveBook} busy={busy} /></View> : null}

      {section === 'reservations' ? <View style={s.panel}><View style={s.panelHeader}><Text style={s.panelTitle}>My reservations</Text>{reservations.length ? <Pressable onPress={cancelAll} style={s.ghostButton}><Text style={s.ghostText}>Cancel all</Text></Pressable> : null}</View>{reservations.length ? reservations.map(item => <View key={item.reservationId} style={s.reservationRow}><View style={[s.coverSmall, { backgroundColor: item.color }]}><Text style={s.coverSmallText}>{item.title[0]}</Text></View><View style={s.rowGrow}><Text style={s.bookTitle}>{item.title}</Text><Text style={s.muted}>{item.pickupDate} - {item.pickupWindow}</Text><Text style={s.code}>Code {item.pickupCode}</Text></View><Pressable onPress={() => cancelReservation(item)} style={s.dangerButton}><Text style={s.dangerText}>Cancel</Text></Pressable></View>) : <Empty title="No reservations yet" copy="Reserve an available book from the catalogue." />}</View> : null}

      {section === 'rooms' ? <View style={s.panel}><Text style={s.panelTitle}>Reading room booking</Text><View style={s.roomGrid}>{rooms.map((room, index) => <View key={room} style={s.roomCard}><Text style={s.roomName}>{room}</Text><Text style={s.muted}>{index === 0 ? 'Silent individual study' : index === 1 ? 'Team discussion space' : 'Computer and media access'}</Text><Pill tone="green">{index === 1 ? '5 seats free' : 'Available today'}</Pill></View>)}</View></View> : null}

      {section === 'account' ? <View style={s.panel}><Text style={s.panelTitle}>Account</Text><View style={s.infoRow}><Text style={s.infoLabel}>Name</Text><Text style={s.infoValue}>{user.name}</Text></View><View style={s.infoRow}><Text style={s.infoLabel}>Email</Text><Text style={s.infoValue}>{user.email}</Text></View><View style={s.infoRow}><Text style={s.infoLabel}>Student ID</Text><Text style={s.infoValue}>{user.studentId}</Text></View></View> : null}
    </ScrollView>
  </View>;
}

function DetailPanel({ book, pickupDate, pickupWindow, setPickupDate, setPickupWindow, reserveBook, busy }) {
  if (!book) return <View style={s.panel}><Empty title="Select a book" copy="Choose a catalogue item to see reservation details." /></View>;
  return <View style={s.panel}>
    <Text style={s.panelTitle}>Book details</Text>
    <View style={s.detailHead}><View style={[s.detailCover, { backgroundColor: book.color }]}><Text style={s.detailCoverText}>{book.title[0]}</Text></View><View style={s.rowGrow}><Text style={s.detailTitle}>{book.title}</Text><Text style={s.muted}>{book.author}</Text><Pill tone={book.available ? 'green' : 'red'}>{book.available ? `${book.copies} available` : 'Currently unavailable'}</Pill></View></View>
    <View style={s.infoRow}><Text style={s.infoLabel}>ISBN</Text><Text style={s.infoValue}>{book.isbn}</Text></View>
    <View style={s.infoRow}><Text style={s.infoLabel}>Category</Text><Text style={s.infoValue}>{book.category}</Text></View>
    <Text style={s.label}>Pickup date</Text><View style={s.segment}>{[nextDate(0), nextDate(1), nextDate(2)].map(date => <Pressable key={date} onPress={() => setPickupDate(date)} style={[s.segmentItem, pickupDate === date && s.segmentActive]}><Text style={[s.segmentText, pickupDate === date && s.segmentTextActive]}>{date}</Text></Pressable>)}</View>
    <Text style={s.label}>Pickup window</Text><View style={s.segment}>{windows.map(item => <Pressable key={item} onPress={() => setPickupWindow(item)} style={[s.segmentItem, pickupWindow === item && s.segmentActive]}><Text style={[s.segmentText, pickupWindow === item && s.segmentTextActive]}>{item}</Text></Pressable>)}</View>
    <Pressable disabled={!book.available || busy} onPress={() => reserveBook({ date: pickupDate, pickupWindow }, book)} style={[s.primary, (!book.available || busy) && s.disabled]}><Text style={s.primaryText}>{busy ? 'Saving...' : 'Reserve book'}</Text></Pressable>
  </View>;
}

function Empty({ title, copy }) {
  return <View style={s.empty}><Text style={s.emptyTitle}>{title}</Text><Text style={s.muted}>{copy}</Text></View>;
}

const s = StyleSheet.create({
  shell: { flex: 1, flexDirection: 'row', minHeight: '100vh', backgroundColor: '#EEF2F8' },
  sidebar: { width: 280, backgroundColor: '#17213A', padding: 24, justifyContent: 'space-between' },
  sideBrand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F6C85F', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#17213A', fontSize: 24, fontWeight: '900' },
  sideTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  sideSub: { color: '#9EABC8', marginTop: 2 },
  nav: { gap: 8, marginTop: 36 },
  navItem: { paddingVertical: 13, paddingHorizontal: 14, borderRadius: 10 },
  navActive: { backgroundColor: '#2C3F73' },
  navText: { color: '#BCC8E4', fontWeight: '800' },
  navTextActive: { color: '#FFF' },
  logout: { borderWidth: 1, borderColor: '#3D4D75', borderRadius: 10, padding: 13, alignItems: 'center' },
  logoutText: { color: '#FFF', fontWeight: '900' },
  main: { flex: 1 },
  mainContent: { padding: 32, maxWidth: 1280, width: '100%', alignSelf: 'center' },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle: { color: '#17213A', fontSize: 34, fontWeight: '900' },
  pageSub: { color: '#66728C', marginTop: 6 },
  userBadge: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#DCE5FF', alignItems: 'center', justifyContent: 'center' },
  userInitial: { color: '#304B9B', fontSize: 20, fontWeight: '900' },
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 18 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#DDE4F0' },
  statNumber: { color: '#17213A', fontSize: 32, fontWeight: '900' },
  statCaption: { color: '#66728C', marginTop: 6, fontWeight: '700' },
  twoCol: { flexDirection: 'row', gap: 18, alignItems: 'flex-start' },
  panel: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#DDE4F0' },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  panelTitle: { color: '#17213A', fontSize: 22, fontWeight: '900', marginBottom: 14 },
  input: { backgroundColor: '#F8FAFE', borderWidth: 1, borderColor: '#CBD5E8', borderRadius: 10, padding: 14, fontSize: 15, color: '#17213A' },
  bookGrid: { gap: 12, marginTop: 16 },
  bookCard: { flexDirection: 'row', backgroundColor: '#F8FAFE', borderWidth: 1, borderColor: '#E2E8F3', borderRadius: 14, padding: 12 },
  activeCard: { borderColor: '#304B9B', backgroundColor: '#F0F4FF' },
  pressed: { opacity: 0.78 },
  cover: { width: 56, height: 74, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  coverText: { color: '#243561', fontSize: 25, fontWeight: '900' },
  bookBody: { flex: 1, marginLeft: 12 },
  bookTitle: { color: '#17213A', fontSize: 16, fontWeight: '900' },
  muted: { color: '#66728C', marginTop: 4 },
  cardFooter: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 10 },
  pill: { alignSelf: 'flex-start', backgroundColor: '#E9EDF7', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 9 },
  pillText: { color: '#304B9B', fontSize: 12, fontWeight: '900' },
  greenPill: { backgroundColor: '#DDF5E7' },
  greenText: { color: '#146B45' },
  redPill: { backgroundColor: '#FCE0E3' },
  redText: { color: '#96344A' },
  detailHead: { flexDirection: 'row', gap: 16, marginBottom: 18 },
  detailCover: { width: 96, height: 132, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  detailCoverText: { color: '#243561', fontSize: 44, fontWeight: '900' },
  detailTitle: { color: '#17213A', fontSize: 24, fontWeight: '900', lineHeight: 30 },
  rowGrow: { flex: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#E8EDF6', paddingVertical: 13, gap: 16 },
  infoLabel: { color: '#66728C', fontWeight: '800' },
  infoValue: { color: '#17213A', fontWeight: '900', textAlign: 'right' },
  label: { color: '#2C3650', fontWeight: '900', marginTop: 14, marginBottom: 8 },
  segment: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  segmentItem: { backgroundColor: '#EEF2F8', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 },
  segmentActive: { backgroundColor: '#304B9B' },
  segmentText: { color: '#405071', fontWeight: '800' },
  segmentTextActive: { color: '#FFF' },
  primary: { backgroundColor: '#304B9B', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 18 },
  primaryText: { color: '#FFF', fontWeight: '900' },
  disabled: { opacity: 0.5 },
  reservationRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderTopWidth: 1, borderColor: '#E8EDF6' },
  coverSmall: { width: 48, height: 62, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  coverSmallText: { color: '#243561', fontWeight: '900', fontSize: 22 },
  code: { color: '#304B9B', fontWeight: '900', marginTop: 6 },
  ghostButton: { borderWidth: 1, borderColor: '#CBD5E8', borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12 },
  ghostText: { color: '#304B9B', fontWeight: '900' },
  dangerButton: { backgroundColor: '#FCE0E3', borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12 },
  dangerText: { color: '#96344A', fontWeight: '900' },
  empty: { alignItems: 'center', padding: 32 },
  emptyTitle: { color: '#17213A', fontSize: 18, fontWeight: '900', marginBottom: 4 },
  roomGrid: { flexDirection: 'row', gap: 14 },
  roomCard: { flex: 1, backgroundColor: '#F8FAFE', borderWidth: 1, borderColor: '#E2E8F3', borderRadius: 14, padding: 18 },
  roomName: { color: '#17213A', fontSize: 18, fontWeight: '900', marginBottom: 8 },
  authShell: { flex: 1, minHeight: '100vh', flexDirection: 'row', backgroundColor: '#EEF2F8' },
  authHeroClean: { flex: 1.35, backgroundColor: '#17213A', padding: 56, justifyContent: 'center' },
  heroContent: { maxWidth: 760 },
  portalTop: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 56 },
  portalLabel: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  portalSub: { color: '#AAB7D5', marginTop: 4, fontWeight: '700' },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 38 },
  serviceCard: { width: '48%', minHeight: 142, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 18 },
  serviceKicker: { color: '#F6C85F', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  serviceTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', marginTop: 10 },
  serviceText: { color: '#C8D3EF', lineHeight: 21, marginTop: 8 },
  portalNotice: { flexDirection: 'row', gap: 18, marginTop: 24, padding: 18, backgroundColor: 'rgba(246,200,95,0.1)', borderWidth: 1, borderColor: 'rgba(246,200,95,0.24)', borderRadius: 14 },
  noticeColumn: { flex: 1 },
  noticeDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.16)' },
  authSide: { width: 530, backgroundColor: '#EEF2F8', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 48 },
  authHero: { flex: 1.1, backgroundColor: '#17213A', padding: 56, justifyContent: 'center' },
  brandMark: { width: 72, height: 72, borderRadius: 18, backgroundColor: '#F6C85F', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#17213A', fontSize: 40, fontWeight: '900' },
  heroTitle: { color: '#FFF', fontSize: 52, fontWeight: '900', marginTop: 28 },
  heroCopy: { color: '#C8D3EF', fontSize: 18, lineHeight: 28, maxWidth: 560, marginTop: 14 },
  heroStats: { flexDirection: 'row', gap: 42, marginTop: 40 },
  statValue: { color: '#F6C85F', fontSize: 24, fontWeight: '900' },
  statLabel: { color: '#AAB7D5', marginTop: 4 },
  heroPreview: { maxWidth: 620, marginTop: 46, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)', borderRadius: 22, padding: 18 },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  previewTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  liveBadge: { backgroundColor: '#DDF5E7', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 10 },
  liveBadgeText: { color: '#146B45', fontSize: 12, fontWeight: '900' },
  accessCopy: { color: '#C8D3EF', lineHeight: 23, fontSize: 15 },
  accessList: { gap: 12, marginTop: 18 },
  accessItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkMark: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#DDF5E7', color: '#146B45', textAlign: 'center', lineHeight: 24, fontWeight: '900' },
  accessText: { color: '#FFF', fontWeight: '800', flex: 1 },
  noticeBox: { marginTop: 20, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.14)', paddingTop: 16 },
  noticeTitle: { color: '#F6C85F', fontWeight: '900' },
  noticeText: { color: '#AAB7D5', lineHeight: 21, marginTop: 6 },
  authCard: { width: 430, alignSelf: 'center', backgroundColor: '#FFF', borderRadius: 18, padding: 28, margin: 48, borderWidth: 1, borderColor: '#DDE4F0' },
  eyebrow: { color: '#304B9B', fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  authTitle: { color: '#17213A', fontSize: 32, fontWeight: '900', marginTop: 8, marginBottom: 12 },
  authLinks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  link: { color: '#304B9B', fontWeight: '900' },
});
