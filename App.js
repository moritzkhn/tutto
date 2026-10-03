import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ==========================================
// TUTTO DECK DEFINITION (56 CARDS EXACTLY)
// ==========================================
const CARD_TYPES = {
  BONUS_200: {
    type: 'bonus_200',
    category: 'bonus',
    title: 'BONUS 200',
    badge: '+200',
    color: '#D97706',
    bgColor: '#FEF3C7',
    accentColor: '#B45309',
    iconName: 'gift',
    iconFamily: 'Ionicons',
    description: 'Erzielst du ein Tutto, erhältst du zusätzlich 200 Punkte zu deinen Würfelpunkten.',
  },
  BONUS_300: {
    type: 'bonus_300',
    category: 'bonus',
    title: 'BONUS 300',
    badge: '+300',
    color: '#D97706',
    bgColor: '#FEF3C7',
    accentColor: '#B45309',
    iconName: 'gift',
    iconFamily: 'Ionicons',
    description: 'Erzielst du ein Tutto, erhältst du zusätzlich 300 Punkte zu deinen Würfelpunkten.',
  },
  BONUS_400: {
    type: 'bonus_400',
    category: 'bonus',
    title: 'BONUS 400',
    badge: '+400',
    color: '#D97706',
    bgColor: '#FEF3C7',
    accentColor: '#B45309',
    iconName: 'gift',
    iconFamily: 'Ionicons',
    description: 'Erzielst du ein Tutto, erhältst du zusätzlich 400 Punkte zu deinen Würfelpunkten.',
  },
  BONUS_500: {
    type: 'bonus_500',
    category: 'bonus',
    title: 'BONUS 500',
    badge: '+500',
    color: '#D97706',
    bgColor: '#FEF3C7',
    accentColor: '#B45309',
    iconName: 'gift',
    iconFamily: 'Ionicons',
    description: 'Erzielst du ein Tutto, erhältst du zusätzlich 500 Punkte zu deinen Würfelpunkten.',
  },
  BONUS_600: {
    type: 'bonus_600',
    category: 'bonus',
    title: 'BONUS 600',
    badge: '+600',
    color: '#D97706',
    bgColor: '#FEF3C7',
    accentColor: '#B45309',
    iconName: 'gift',
    iconFamily: 'Ionicons',
    description: 'Erzielst du ein Tutto, erhältst du zusätzlich 600 Punkte zu deinen Würfelpunkten.',
  },
  STOPP: {
    type: 'stopp',
    category: 'stopp',
    title: 'STOPP',
    badge: 'STOPP',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    accentColor: '#991B1B',
    iconName: 'hand-stop-o',
    iconFamily: 'FontAwesome',
    description: 'Pech gehabt! Dein Zug endet sofort. Du darfst nicht würfeln und erhältst 0 Punkte.',
  },
  FEUERWERK: {
    type: 'feuerwerk',
    category: 'feuerwerk',
    title: 'FEUERWERK',
    badge: '🎆',
    color: '#EA580C',
    bgColor: '#FFEDD5',
    accentColor: '#C2410C',
    iconName: 'firework',
    iconFamily: 'MaterialCommunityIcons',
    description: 'Du MUSST so lange weiterwürfeln, bis du eine Niete wirfst! Bei Tutto machst du ohne neue Karte weiter.',
  },
  STRASSE: {
    type: 'strasse',
    category: 'strasse',
    title: 'STRAßE',
    badge: '1 - 6',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    accentColor: '#6D28D9',
    iconName: 'subway',
    iconFamily: 'Ionicons',
    description: 'Ziel: Würfle 1, 2, 3, 4, 5, 6 in beliebiger Reihenfolge! Gelingt dies (Tutto), erhältst du 2.000 Punkte.',
  },
  PLUS_MINUS: {
    type: 'plus_minus',
    category: 'plus_minus',
    title: 'PLUS / MINUS',
    badge: '±1000',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    accentColor: '#0369A1',
    iconName: 'swap-horizontal',
    iconFamily: 'Ionicons',
    description: 'Du musst ein Tutto schaffen. Gelingt dies, erhältst du 1.000 Punkte und dem Führenden werden 1.000 Punkte abgezogen!',
  },
  DOUBLE: {
    type: 'double',
    category: 'double',
    title: '×2 VERDOPPELN',
    badge: '×2',
    color: '#059669',
    bgColor: '#D1FAE5',
    accentColor: '#047857',
    iconName: 'stats-chart',
    iconFamily: 'Ionicons',
    description: 'Erzielst du in diesem Zug ein Tutto, werden ALLE deine Würfelpunkte dieses Zuges verdoppelt!',
  },
  KLEEBLATT: {
    type: 'kleeblatt',
    category: 'kleeblatt',
    title: 'KLEEBLATT',
    badge: '🍀',
    color: '#15803D',
    bgColor: '#DCFCE7',
    accentColor: '#166534',
    iconName: 'clover',
    iconFamily: 'MaterialCommunityIcons',
    description: 'Sonder-Herausforderung! Schaffst du 2 Tutto hintereinander im selben Zug, hast du das Spiel SOFORT GEWONNEN!',
  },
};

// Create standard 56 card deck
const createFreshDeck = () => {
  const cards = [];
  let idCounter = 1;

  const addCards = (cardTypeObj, count) => {
    for (let i = 0; i < count; i++) {
      cards.push({
        id: `${cardTypeObj.type}_${idCounter++}`,
        ...cardTypeObj,
      });
    }
  };

  // 25 Bonus Cards (5 of each)
  addCards(CARD_TYPES.BONUS_200, 5);
  addCards(CARD_TYPES.BONUS_300, 5);
  addCards(CARD_TYPES.BONUS_400, 5);
  addCards(CARD_TYPES.BONUS_500, 5);
  addCards(CARD_TYPES.BONUS_600, 5);

  // 10 Stop Cards
  addCards(CARD_TYPES.STOPP, 10);

  // 5 Fireworks Cards
  addCards(CARD_TYPES.FEUERWERK, 5);

  // 5 Street Cards
  addCards(CARD_TYPES.STRASSE, 5);

  // 5 Plus/Minus Cards
  addCards(CARD_TYPES.PLUS_MINUS, 5);

  // 5 Double Cards
  addCards(CARD_TYPES.DOUBLE, 5);

  // 1 Clover Card
  addCards(CARD_TYPES.KLEEBLATT, 1);

  return shuffle(cards);
};

// Fisher-Yates Shuffle
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function App() {
  // Deck state
  const [drawPile, setDrawPile] = useState(() => createFreshDeck());
  const [discardPile, setDiscardPile] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [reshuffledNotice, setReshuffledNotice] = useState(false);

  // Modals
  const [showInspector, setShowInspector] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Animation values
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Trigger flip animation
  const animateCardDraw = (callback) => {
    scaleAnim.setValue(0.95);
    flipAnim.setValue(0);

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    if (callback) callback();
  };

  // Draw Card Logic
  const handleDrawCard = () => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate(30);
    }

    let currentDrawPile = [...drawPile];
    let currentDiscardPile = [...discardPile];
    let notice = false;

    // Check if deck needs reshuffle
    if (currentDrawPile.length === 0) {
      if (currentDiscardPile.length === 0) {
        currentDrawPile = createFreshDeck();
      } else {
        // Reshuffle discard pile back into draw pile
        currentDrawPile = shuffle([...currentDiscardPile]);
        currentDiscardPile = [];
      }
      notice = true;
    }

    const drawnCard = currentDrawPile.pop();

    if (currentCard) {
      currentDiscardPile.push(currentCard);
    }

    setDrawPile(currentDrawPile);
    setDiscardPile(currentDiscardPile);
    setCurrentCard(drawnCard);
    setReshuffledNotice(notice);

    if (notice) {
      setTimeout(() => setReshuffledNotice(false), 3000);
    }

    animateCardDraw();
  };

  // Undo Last Draw
  const handleUndo = () => {
    if (!currentCard) return;

    if (Platform.OS !== 'web') {
      Vibration.vibrate(20);
    }

    let prevCard = null;
    let newDiscard = [...discardPile];

    if (newDiscard.length > 0) {
      prevCard = newDiscard.pop();
    }

    const newDraw = [...drawPile, currentCard];

    setDrawPile(newDraw);
    setDiscardPile(newDiscard);
    setCurrentCard(prevCard);
  };

  // Reset Game / Reshuffle full deck
  const handleResetGame = () => {
    setDrawPile(createFreshDeck());
    setDiscardPile([]);
    setCurrentCard(null);
    setReshuffledNotice(false);
  };

  // Calculate remaining cards breakdown for Inspector
  const getDeckBreakdown = () => {
    const counts = {
      bonus_200: 0,
      bonus_300: 0,
      bonus_400: 0,
      bonus_500: 0,
      bonus_600: 0,
      stopp: 0,
      feuerwerk: 0,
      strasse: 0,
      plus_minus: 0,
      double: 0,
      kleeblatt: 0,
    };

    drawPile.forEach((card) => {
      if (counts[card.type] !== undefined) {
        counts[card.type]++;
      }
    });

    return counts;
  };

  const breakdown = getDeckBreakdown();
  const totalCardsInPile = drawPile.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>TUTTO!</Text>
          <Text style={styles.headerSubtitle}>Kartenstapel</Text>
        </View>

        {/* DECK COUNTER BADGE */}
        <View style={styles.deckCounterPill}>
          <Ionicons name="layers-outline" size={16} color="#F8FAFC" style={{ marginRight: 6 }} />
          <Text style={styles.deckCounterText}>{totalCardsInPile} / 56</Text>
        </View>

        {/* HEADER ACTIONS */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setShowInspector(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="stats-chart-outline" size={22} color="#F1F5F9" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setShowHistory(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={22} color="#F1F5F9" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleResetGame}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={22} color="#F1F5F9" />
          </TouchableOpacity>
        </View>
      </View>

      {/* RESHUFFLE NOTIFICATION TOAST */}
      {reshuffledNotice && (
        <View style={styles.reshuffleToast}>
          <Ionicons name="sync-circle" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.reshuffleToastText}>Stapel leer – Karten neu gemischt!</Text>
        </View>
      )}

      {/* MAIN CARD CONTAINER */}
      <View style={styles.cardArea}>
        {currentCard ? (
          <Animated.View
            style={[
              styles.cardContainer,
              {
                backgroundColor: currentCard.bgColor,
                borderColor: currentCard.color,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* CARD HEADER / TYPE TITLE */}
            <View style={[styles.cardHeaderBanner, { backgroundColor: currentCard.color }]}>
              <Text style={styles.cardHeaderTitle}>{currentCard.title}</Text>
            </View>

            {/* CARD BADGE / VALUE */}
            <View style={styles.cardBody}>
              <View style={[styles.badgeCircle, { backgroundColor: currentCard.color }]}>
                <Text style={styles.badgeText}>{currentCard.badge}</Text>
              </View>

              {/* CARD ICON */}
              <View style={{ marginVertical: 12 }}>
                {currentCard.iconFamily === 'MaterialCommunityIcons' ? (
                  <MaterialCommunityIcons name={currentCard.iconName} size={64} color={currentCard.color} />
                ) : currentCard.iconFamily === 'FontAwesome' ? (
                  <Ionicons name="hand-stop-outline" size={64} color={currentCard.color} />
                ) : (
                  <Ionicons name={currentCard.iconName} size={64} color={currentCard.color} />
                )}
              </View>

              {/* CARD RULE DESCRIPTION */}
              <View style={[styles.descriptionBox, { borderColor: currentCard.color + '40' }]}>
                <Text style={[styles.descriptionText, { color: currentCard.accentColor }]}>
                  {currentCard.description}
                </Text>
              </View>
            </View>

            {/* CARD FOOTER INFO */}
            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterText}>Karte {discardPile.length + 1} von 56</Text>
            </View>
          </Animated.View>
        ) : (
          /* CARD BACK / START VIEW */
          <TouchableOpacity
            style={styles.cardBackContainer}
            onPress={handleDrawCard}
            activeOpacity={0.85}
          >
            <View style={styles.cardBackInner}>
              <Ionicons name="square-outline" size={64} color="#64748B" />
              <Text style={styles.cardBackTitle}>TUTTO!</Text>
              <Text style={styles.cardBackSubtitle}>Tippe, um die erste Karte zu ziehen</Text>
              <View style={styles.startPill}>
                <Text style={styles.startPillText}>56 Karten bereit</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* BOTTOM CONTROL BUTTONS */}
      <View style={styles.controlsArea}>
        <TouchableOpacity
          style={styles.mainDrawButton}
          onPress={handleDrawCard}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-forward-circle-outline" size={28} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.mainDrawButtonText}>
            {currentCard ? 'NÄCHSTE KARTE ZIEHEN' : 'KARTE ZIEHEN'}
          </Text>
        </TouchableOpacity>

        <View style={styles.secondaryControls}>
          <TouchableOpacity
            style={[styles.secondaryButton, !currentCard && { opacity: 0.5 }]}
            onPress={handleUndo}
            disabled={!currentCard}
            activeOpacity={0.7}
          >
            <Ionicons name="undo-cancel-outline" size={20} color="#475569" style={{ marginRight: 6 }} />
            <Text style={styles.secondaryButtonText}>Rückgängig</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowInspector(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="eye-outline" size={20} color="#475569" style={{ marginRight: 6 }} />
            <Text style={styles.secondaryButtonText}>Rest-Stapel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL 1: DECK INSPECTOR */}
      <Modal visible={showInspector} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verbleibende Karten ({totalCardsInPile})</Text>
              <TouchableOpacity onPress={() => setShowInspector(false)}>
                <Ionicons name="close-circle" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.inspectorSectionHeader}>BONUSKARTEN</Text>
              {[
                { label: 'Bonus 200', count: breakdown.bonus_200, total: 5, color: '#D97706' },
                { label: 'Bonus 300', count: breakdown.bonus_300, total: 5, color: '#D97706' },
                { label: 'Bonus 400', count: breakdown.bonus_400, total: 5, color: '#D97706' },
                { label: 'Bonus 500', count: breakdown.bonus_500, total: 5, color: '#D97706' },
                { label: 'Bonus 600', count: breakdown.bonus_600, total: 5, color: '#D97706' },
              ].map((item, idx) => (
                <InspectorRow key={idx} {...item} />
              ))}

              <Text style={styles.inspectorSectionHeader}>AKTIONSSKARTEN</Text>
              {[
                { label: 'Stopp-Karten', count: breakdown.stopp, total: 10, color: '#DC2626' },
                { label: 'Feuerwerk', count: breakdown.feuerwerk, total: 5, color: '#EA580C' },
                { label: 'Straße', count: breakdown.strasse, total: 5, color: '#7C3AED' },
                { label: 'Plus / Minus', count: breakdown.plus_minus, total: 5, color: '#0284C7' },
                { label: '×2 Verdoppeln', count: breakdown.double, total: 5, color: '#059669' },
                { label: 'Kleeblatt (Sofort-Sieg)', count: breakdown.kleeblatt, total: 1, color: '#15803D' },
              ].map((item, idx) => (
                <InspectorRow key={idx} {...item} />
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowInspector(false)}
            >
              <Text style={styles.modalCloseButtonText}>Schließen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: HISTORY LOG */}
      <Modal visible={showHistory} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Gezogene Karten ({discardPile.length + (currentCard ? 1 : 0)})</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <Ionicons name="close-circle" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {currentCard && (
                <View style={[styles.historyRow, { backgroundColor: currentCard.bgColor, borderColor: currentCard.color }]}>
                  <Text style={[styles.historyBadge, { backgroundColor: currentCard.color }]}>AKTUELL</Text>
                  <Text style={[styles.historyTitle, { color: currentCard.accentColor }]}>{currentCard.title}</Text>
                </View>
              )}

              {[...discardPile].reverse().map((card, idx) => (
                <View key={card.id} style={styles.historyRowSimple}>
                  <Text style={styles.historyNumber}>#{discardPile.length - idx}</Text>
                  <View style={[styles.miniDot, { backgroundColor: card.color }]} />
                  <Text style={styles.historyRowText}>{card.title}</Text>
                </View>
              ))}

              {discardPile.length === 0 && !currentCard && (
                <Text style={styles.emptyHistoryText}>Noch keine Karten gezogen.</Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowHistory(false)}
            >
              <Text style={styles.modalCloseButtonText}>Schließen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Sub-component for Inspector Rows
function InspectorRow({ label, count, total, color }) {
  const percentage = (count / total) * 100;

  return (
    <View style={styles.inspectorRow}>
      <View style={styles.inspectorRowHeader}>
        <Text style={styles.inspectorLabel}>{label}</Text>
        <Text style={[styles.inspectorCount, { color }]}>
          {count} von {total}
        </Text>
      </View>
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// STYLESHEET
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitleContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deckCounterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#475569',
  },
  deckCounterText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    padding: 6,
    marginLeft: 6,
  },
  reshuffleToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  reshuffleToastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    width: width - 48,
    maxHeight: 480,
    height: '92%',
    borderRadius: 24,
    borderWidth: 4,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    justifyContent: 'space-between',
  },
  cardHeaderBanner: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cardBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  badgeCircle: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  descriptionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginTop: 8,
    width: '100%',
  },
  descriptionText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardFooter: {
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
  },
  cardFooterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  cardBackContainer: {
    width: width - 48,
    height: 440,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#334155',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardBackInner: {
    alignItems: 'center',
  },
  cardBackTitle: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 12,
    letterSpacing: 2,
  },
  cardBackSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  startPill: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
  },
  startPillText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  controlsArea: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  mainDrawButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  mainDrawButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  secondaryButton: {
    flex: 0.48,
    backgroundColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 14,
    marginBottom: 14,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  modalScroll: {
    marginBottom: 14,
  },
  inspectorSectionHeader: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: 1,
  },
  inspectorRow: {
    marginBottom: 12,
  },
  inspectorRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  inspectorLabel: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  inspectorCount: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalCloseButton: {
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  historyBadge: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  historyRowSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  historyNumber: {
    color: '#64748B',
    fontSize: 12,
    width: 36,
    fontWeight: '600',
  },
  miniDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  historyRowText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyHistoryText: {
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 20,
  },
});
