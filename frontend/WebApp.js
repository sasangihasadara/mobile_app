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
  return <CampusPortal user={user} busy={busy} books={books} query={query} setQuery={setQuery} results={results} reservations={reservations} selectedBook={selectedBook} setSelected={setSelected} pickupDate={pickupDate} pickupWindow={pickupWindow} setPickupDate={setPickupDate} setPickupWindow={setPickupWindow} reserveBook={reserveBook} cancelReservation={cancelReservation} cancelAll={cancelAll} logout={logout} />;

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

function CampusPortal({ user, busy, books, query, setQuery, results, reservations, selectedBook, setSelected, pickupDate, pickupWindow, setPickupDate, setPickupWindow, reserveBook, cancelReservation, cancelAll, logout }) {
  const [section, setSection] = useState('home');
  const availableCount = books.reduce((total, book) => total + (book.copies || 0), 0);
  const nav = [['home', 'Home'], ['search', 'Search'], ['holds', 'Holds'], ['alerts', 'Alerts'], ['profile', 'Profile']];
  const activeBook = books.find(book => book.id === selectedBook?.id) || selectedBook || books[0];

  return <View style={s.portalShell}>
    <View style={s.portalNav}>
      <View style={s.portalBrand}><View style={s.portalLogo}><Text style={s.portalLogoText}>L</Text></View><View><Text style={s.portalBrandText}>LibraReserve</Text><Text style={s.portalBrandSub}>Campus library portal</Text></View></View>
      <View style={s.portalTabs}>{nav.map(([key, label]) => <Pressable key={key} onPress={() => setSection(key)} style={[s.portalTab, (section === key || (section === 'details' && key === 'search')) && s.portalTabActive]}><Text style={[s.portalTabText, (section === key || (section === 'details' && key === 'search')) && s.portalTabTextActive]}>{label}</Text></Pressable>)}</View>
      <Pressable onPress={logout} style={s.portalLogout}><Text style={s.portalLogoutText}>Sign out</Text></Pressable>
    </View>
    <ScrollView style={s.portalMain} contentContainerStyle={s.portalMainContent}>
      {section === 'home' ? <View>
        <View style={s.campusHero}>
          <View><Text style={s.campusKicker}>Welcome back</Text><Text style={s.campusTitle}>{user.name}</Text><Text style={s.campusSub}>Exam period access: smart stacks, study spaces, and pickup requests in one place.</Text></View>
          <View style={s.campusAvatar}><Text style={s.campusAvatarText}>{user.name?.slice(0, 1) || 'U'}</Text></View>
        </View>
        <View style={s.quickGrid}>
          <Pressable onPress={() => setSection('search')} style={[s.quickCard, s.quickBlue]}><Text style={s.quickIcon}>⌕</Text><Text style={s.quickTitle}>Search Books</Text><Text style={s.quickText}>Stacks and shelf map</Text></Pressable>
          <Pressable onPress={() => setSection('holds')} style={[s.quickCard, s.quickViolet]}><Text style={s.quickIcon}>▣</Text><Text style={s.quickTitle}>My Holds</Text><Text style={s.quickText}>{reservations.length} active reservation</Text></Pressable>
          <View style={[s.quickCard, s.quickMint]}><Text style={s.quickIcon}>↗</Text><Text style={s.quickTitle}>Reader Pass</Text><Text style={s.quickText}>Barcode for gates</Text></View>
        </View>
        <View style={s.portalGrid}>
          <View style={s.portalPanel}><View style={s.panelTop}><Text style={s.panelTitle}>Current active loans</Text><Text style={s.panelAction}>View details</Text></View>{books.slice(0, 3).map(book => <Pressable key={book.id} onPress={() => { setSelected(book); setSection('details'); }} style={s.loanRow}><View style={[s.loanCover, { backgroundColor: book.color }]}><Text style={s.loanCoverText}>{book.title[0]}</Text></View><View style={s.loanInfo}><Text style={s.loanTitle}>{book.title}</Text><Text style={s.loanMeta}>{book.author}</Text><Text style={s.dueText}>{book.available ? `On shelf · ${book.copies} copies` : 'Currently unavailable'}</Text></View><Pill tone={book.available ? 'green' : 'red'}>{book.available ? 'On shelf' : 'Out'}</Pill></Pressable>)}</View>
          <View style={s.portalPanel}><Text style={s.panelTitle}>Today’s room bookings</Text><View style={s.roomHighlight}><Text style={s.roomHighlightTitle}>Quiet Study Pod B-12</Text><Text style={s.roomHighlightText}>Floor 3 Silent Wing · 15:00 - 17:00</Text><Pill>Reserved</Pill></View><Text style={s.panelTitleSmall}>Facility hours and access</Text><Text style={s.infoLine}>Main stacks: 08:00 - 23:00</Text><Text style={s.infoLine}>Weekend reading rooms: 08:00 - 21:00</Text><Text style={s.infoLine}>Smart pickup lockers: 24/7 active</Text></View>
        </View>
      </View> : null}

      {section === 'search' ? <View style={s.portalPanelWide}>
        <Text style={s.panelTitle}>Search catalogue</Text>
        <TextInput accessibilityLabel="Search books" value={query} onChangeText={setQuery} placeholder="Search by title, author, ISBN or category" style={s.input} />
        <Text style={s.catalogueCount}>{results.length} of {books.length} books</Text>
        <View style={s.catalogueGrid}>{results.map(book => <Pressable accessibilityRole="button" accessibilityLabel={'View details for ' + book.title} key={book.id} onPress={() => { setSelected(book); setSection('details'); }} style={({ pressed }) => [s.catalogueCard, pressed && s.pressed]}>
          <View style={s.detailHead}><View style={[s.resultCover, { backgroundColor: book.color }]}><Text style={s.resultCoverText}>{book.title[0]}</Text></View><View style={s.loanInfo}><Text style={s.bookTitle}>{book.title}</Text><Text style={s.loanMeta}>{book.author}</Text><Text style={s.shelfText}>{book.category}</Text></View></View>
          <Text numberOfLines={3} style={s.bookDescription}>{book.description || 'Select this book to see availability and reservation details.'}</Text>
          <View style={s.cardFooter}><Pill tone={book.available ? 'green' : 'red'}>{book.available ? book.copies + ' available' : 'Unavailable'}</Pill><Text style={s.link}>View details</Text></View>
        </Pressable>)}</View>
        {!results.length ? <Empty title="No books found" copy="Try another title, author, ISBN or category." /> : null}
      </View> : null}

      {section === 'details' ? <View style={s.detailPage}>
        <Pressable accessibilityRole="button" onPress={() => setSection('search')} style={s.backToCatalogue}><Text style={s.link}>Back to catalogue</Text></Pressable>
        <DetailPanel book={activeBook} pickupDate={pickupDate} pickupWindow={pickupWindow} setPickupDate={setPickupDate} setPickupWindow={setPickupWindow} reserveBook={reserveBook} busy={busy} />
      </View> : null}

      {section === 'holds' ? <View style={s.portalPanelWide}><View style={s.panelTop}><Text style={s.panelTitle}>Account shelf and loans</Text>{reservations.length ? <Pressable onPress={cancelAll} style={s.portalSmallButton}><Text style={s.portalSmallButtonText}>Cancel all</Text></Pressable> : null}</View>{reservations.length ? reservations.map(item => <View key={item.reservationId} style={s.pickupSlip}><View style={[s.loanCover, { backgroundColor: item.color }]}><Text style={s.loanCoverText}>{item.title[0]}</Text></View><View style={s.loanInfo}><Text style={s.loanTitle}>{item.title}</Text><Text style={s.loanMeta}>{item.author}</Text><Text style={s.pickupText}>Pickup: {item.pickupDate} · {item.pickupWindow}</Text><Text style={s.code}>Code {item.pickupCode}</Text></View><Pressable onPress={() => cancelReservation(item)} style={s.dangerButton}><Text style={s.dangerText}>Cancel hold</Text></Pressable></View>) : <Empty title="No active holds" copy="Search the catalogue and reserve an available book." />}</View> : null}

      {section === 'alerts' ? <View style={s.portalPanelWide}><Text style={s.panelTitle}>Alerts</Text><View style={s.alertCard}><Text style={s.alertTitle}>No urgent alerts</Text><Text style={s.muted}>Reservation and pickup notifications will appear here.</Text></View></View> : null}

      {section === 'profile' ? <View style={s.portalPanelWide}><Text style={s.panelTitle}>Profile</Text><View style={s.infoRow}><Text style={s.infoLabel}>Name</Text><Text style={s.infoValue}>{user.name}</Text></View><View style={s.infoRow}><Text style={s.infoLabel}>Email</Text><Text style={s.infoValue}>{user.email}</Text></View><View style={s.infoRow}><Text style={s.infoLabel}>Student ID</Text><Text style={s.infoValue}>{user.studentId}</Text></View><Text style={s.infoLine}>Available copies across seeded catalogue: {availableCount}</Text></View> : null}
    </ScrollView>
  </View>;
}

function DetailPanel({ book, pickupDate, pickupWindow, setPickupDate, setPickupWindow, reserveBook, busy }) {
  if (!book) return <View style={s.panel}><Empty title="Select a book" copy="Choose a catalogue item to see reservation details." /></View>;
  return <View style={s.panel}>
    <Text style={s.panelTitle}>Book details</Text>
    <View style={s.detailHead}><View style={[s.detailCover, { backgroundColor: book.color }]}><Text style={s.detailCoverText}>{book.title[0]}</Text></View><View style={s.rowGrow}><Text style={s.detailTitle}>{book.title}</Text><Text style={s.muted}>{book.author}</Text><Pill tone={book.available ? 'green' : 'red'}>{book.available ? `${book.copies} available` : 'Currently unavailable'}</Pill></View></View>
    <View style={s.infoRow}><Text style={s.infoLabel}>ISBN</Text><Text style={s.infoValue}>{book.isbn || 'Not recorded'}</Text></View>
    <View style={s.infoRow}><Text style={s.infoLabel}>Category</Text><Text style={s.infoValue}>{book.category}</Text></View>
    <Text style={s.label}>About this book</Text><Text style={s.bookDescription}>{book.description || 'A description has not been added for this book yet.'}</Text>
    <Text style={s.label}>Pickup date</Text><View style={s.segment}>{[nextDate(0), nextDate(1), nextDate(2)].map(date => <Pressable key={date} onPress={() => setPickupDate(date)} style={[s.segmentItem, pickupDate === date && s.segmentActive]}><Text style={[s.segmentText, pickupDate === date && s.segmentTextActive]}>{date}</Text></Pressable>)}</View>
    <Text style={s.label}>Pickup window</Text><View style={s.segment}>{windows.map(item => <Pressable key={item} onPress={() => setPickupWindow(item)} style={[s.segmentItem, pickupWindow === item && s.segmentActive]}><Text style={[s.segmentText, pickupWindow === item && s.segmentTextActive]}>{item}</Text></Pressable>)}</View>
    <Pressable disabled={!book.available || busy} onPress={() => reserveBook({ date: pickupDate, pickupWindow }, book)} style={[s.primary, (!book.available || busy) && s.disabled]}><Text style={s.primaryText}>{busy ? 'Saving...' : 'Reserve book'}</Text></Pressable>
  </View>;
}

function Empty({ title, copy }) {
  return <View style={s.empty}><Text style={s.emptyTitle}>{title}</Text><Text style={s.muted}>{copy}</Text></View>;
}

const s = StyleSheet.create({
  catalogueCount: { color: '#66728C', marginVertical: 16 },
  catalogueGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  catalogueCard: { flexGrow: 1, flexBasis: 300, borderWidth: 1, borderColor: '#DDE4F0', borderRadius: 12, padding: 18, backgroundColor: '#F8FAFE' },
  bookDescription: { color: '#52617B', fontSize: 15, lineHeight: 24 },
  detailPage: { width: '100%', maxWidth: 820, alignSelf: 'center' },
  backToCatalogue: { alignSelf: 'flex-start', paddingVertical: 14, marginBottom: 10 },
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
  input: { backgroundColor: '#F8FAFE', borderWidth: 1, borderColor: '#CBD5E8', borderRadius: 9, padding: 14, fontSize: 15, color: '#17213A' },
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
  label: { color: '#2C3650', fontWeight: '900', marginTop: 16, marginBottom: 8 },
  segment: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  segmentItem: { backgroundColor: '#EEF2F8', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 },
  segmentActive: { backgroundColor: '#304B9B' },
  segmentText: { color: '#405071', fontWeight: '800' },
  segmentTextActive: { color: '#FFF' },
  primary: { backgroundColor: '#304B9B', borderRadius: 9, padding: 15, alignItems: 'center', marginTop: 20 },
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
  authShell: { flex: 1, minHeight: '100vh', flexDirection: 'row', backgroundColor: '#F4F7FB' },
  authHeroClean: { flex: 1.25, backgroundColor: '#13203A', paddingHorizontal: 64, paddingVertical: 46, justifyContent: 'center' },
  heroContent: { maxWidth: 780 },
  portalTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 44 },
  portalLabel: { color: '#FFF', fontSize: 17, fontWeight: '900' },
  portalSub: { color: '#A9B7D6', marginTop: 3, fontWeight: '700' },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 34 },
  serviceCard: { width: '48.7%', minHeight: 116, backgroundColor: '#1B2A49', borderWidth: 1, borderColor: '#2D4068', borderRadius: 12, padding: 16 },
  serviceKicker: { color: '#F6C85F', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  serviceTitle: { color: '#FFF', fontSize: 16, fontWeight: '900', marginTop: 8 },
  serviceText: { color: '#C8D3EF', lineHeight: 20, marginTop: 6, fontSize: 13 },
  portalNotice: { flexDirection: 'row', gap: 18, marginTop: 22, padding: 18, backgroundColor: '#182944', borderWidth: 1, borderColor: '#32486F', borderRadius: 12 },
  noticeColumn: { flex: 1 },
  noticeDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.16)' },
  authSide: { width: 558, backgroundColor: '#F4F7FB', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 48 },
  authHero: { flex: 1.1, backgroundColor: '#17213A', padding: 56, justifyContent: 'center' },
  brandMark: { width: 58, height: 58, borderRadius: 14, backgroundColor: '#F6C85F', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#17213A', fontSize: 32, fontWeight: '900' },
  heroTitle: { color: '#FFF', fontSize: 58, fontWeight: '900', marginTop: 0 },
  heroCopy: { color: '#D6DFF2', fontSize: 19, lineHeight: 30, maxWidth: 620, marginTop: 14 },
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
  noticeText: { color: '#B7C4DF', lineHeight: 21, marginTop: 6, fontSize: 13 },
  authCard: { width: 430, alignSelf: 'center', backgroundColor: '#FFF', borderRadius: 14, padding: 30, borderWidth: 1, borderColor: '#DCE3EF' },
  eyebrow: { color: '#304B9B', fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  authTitle: { color: '#17213A', fontSize: 34, fontWeight: '900', marginTop: 8, marginBottom: 18 },
  authLinks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  link: { color: '#304B9B', fontWeight: '900' },
  portalShell: { flex: 1, minHeight: '100vh', backgroundColor: '#F4F7FB' },
  portalNav: { height: 76, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#DDE4F0', paddingHorizontal: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  portalBrand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  portalLogo: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#2864F0', alignItems: 'center', justifyContent: 'center' },
  portalLogoText: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  portalBrandText: { color: '#16213A', fontSize: 18, fontWeight: '900' },
  portalBrandSub: { color: '#71809C', fontSize: 12, marginTop: 2 },
  portalTabs: { flexDirection: 'row', gap: 8, backgroundColor: '#EFF4FF', borderRadius: 999, padding: 5 },
  portalTab: { paddingVertical: 9, paddingHorizontal: 18, borderRadius: 999 },
  portalTabActive: { backgroundColor: '#2864F0' },
  portalTabText: { color: '#60708D', fontWeight: '900' },
  portalTabTextActive: { color: '#FFF' },
  portalLogout: { borderWidth: 1, borderColor: '#CCD6EA', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  portalLogoutText: { color: '#2864F0', fontWeight: '900' },
  portalMain: { flex: 1 },
  portalMainContent: { padding: 28, maxWidth: 1180, width: '100%', alignSelf: 'center' },
  campusHero: { backgroundColor: '#2864F0', borderRadius: 16, padding: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  campusKicker: { color: '#DCE8FF', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  campusTitle: { color: '#FFF', fontSize: 30, fontWeight: '900', marginTop: 4 },
  campusSub: { color: '#EAF1FF', marginTop: 8, lineHeight: 22, maxWidth: 620 },
  campusAvatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#183C94', alignItems: 'center', justifyContent: 'center' },
  campusAvatarText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  quickGrid: { flexDirection: 'row', gap: 14, marginTop: 16 },
  quickCard: { flex: 1, borderRadius: 13, padding: 18, borderWidth: 1, borderColor: '#DDE4F0' },
  quickBlue: { backgroundColor: '#EAF1FF' },
  quickViolet: { backgroundColor: '#F2EFFF' },
  quickMint: { backgroundColor: '#EAFBF4' },
  quickIcon: { color: '#2864F0', fontSize: 22, fontWeight: '900' },
  quickTitle: { color: '#17213A', fontSize: 16, fontWeight: '900', marginTop: 10 },
  quickText: { color: '#66728C', marginTop: 4 },
  portalGrid: { flexDirection: 'row', gap: 18, alignItems: 'flex-start', marginTop: 18 },
  portalPanel: { flex: 1, backgroundColor: '#FFF', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#DDE4F0' },
  portalPanelWide: { flex: 1, backgroundColor: '#FFF', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#DDE4F0' },
  panelTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  panelAction: { color: '#2864F0', fontWeight: '900', fontSize: 12 },
  panelTitleSmall: { color: '#17213A', fontSize: 15, fontWeight: '900', marginTop: 18, marginBottom: 8 },
  loanRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderColor: '#EEF2F8', paddingVertical: 13 },
  loanCover: { width: 46, height: 60, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  loanCoverText: { color: '#17345F', fontSize: 20, fontWeight: '900' },
  loanInfo: { flex: 1 },
  loanTitle: { color: '#17213A', fontWeight: '900' },
  loanMeta: { color: '#66728C', marginTop: 3, fontSize: 12 },
  dueText: { color: '#E07922', marginTop: 5, fontSize: 12, fontWeight: '800' },
  roomHighlight: { backgroundColor: '#F3EEFF', borderWidth: 1, borderColor: '#DCCEFF', borderRadius: 12, padding: 14 },
  roomHighlightTitle: { color: '#462384', fontWeight: '900' },
  roomHighlightText: { color: '#6E5A98', marginTop: 5, marginBottom: 10 },
  infoLine: { color: '#66728C', marginTop: 8 },
  searchHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  portalSearchInput: { flex: 1, backgroundColor: '#F8FAFE', borderWidth: 1, borderColor: '#CBD5E8', borderRadius: 9, padding: 12, fontSize: 14, color: '#17213A' },
  filterStrip: { flexDirection: 'row', gap: 8, marginTop: 14, marginBottom: 10 },
  resultList: { gap: 10 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F3', borderRadius: 12, padding: 12 },
  resultRowActive: { borderColor: '#2864F0', backgroundColor: '#F3F7FF' },
  resultCover: { width: 54, height: 68, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  resultCoverText: { color: '#17345F', fontSize: 23, fontWeight: '900' },
  shelfText: { color: '#2864F0', marginTop: 5, fontSize: 12, fontWeight: '800' },
  portalSmallButton: { borderWidth: 1, borderColor: '#CBD5E8', borderRadius: 9, paddingVertical: 9, paddingHorizontal: 12 },
  portalSmallButtonText: { color: '#2864F0', fontWeight: '900' },
  pickupSlip: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#F8FAFE', borderWidth: 1, borderColor: '#DDE4F0', borderRadius: 12, padding: 14, marginTop: 12 },
  pickupText: { color: '#146B45', marginTop: 5, fontWeight: '800' },
  alertCard: { backgroundColor: '#F8FAFE', borderWidth: 1, borderColor: '#DDE4F0', borderRadius: 12, padding: 18 },
  alertTitle: { color: '#17213A', fontWeight: '900', fontSize: 16 },
});
