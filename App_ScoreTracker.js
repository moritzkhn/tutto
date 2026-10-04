import React, { useState, useRef } from 'react';
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
  TextInput,
  Vibration,
  Platform,
  Alert,
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
    bonusVal: 200,
    color: '#D97706',
    bgColor: '#FEF3C7',
    accentColor: '#B45309',
    iconName: 'gift',
    description: 'Erzielst du ein Tutto, erhältst du automatisch +200 Bonuspunkte zu deinen Würfelpunkten.',
  },
  BONUS_300: {
    type: 'bonus_300',
    category: 'bonus',
    title: 'BONUS 300',
    badge: '+300',
    bonusVal: 300,
    color: '#D97706',
    bgColor: '#FEF3C7',
    accentColor: '#B45309',
    iconName: 'gift',
    description: 'Erzielst du ein Tutto, erhältst du automatisch +300 Bonuspunkte zu deinen Würfelpunkten.',
  },
  BONUS_400: {
    type: 'bonus_400',
    category: 'bonus',
    title: 'BONUS 400',
    badge: '+400',
    bonusVal: 400,
    color: '#D97706',
    bgColor: '#FEF3C7',
    accentColor: '#B45309',
    iconName: 'gift',
    description: 'Erzielst du ein Tutto, erhältst du automatisch +400 Bonuspunkte zu deinen Würfelpunkten.',
  },
  BONUS_500: {
    type: 'bonus_500',
    category: 'bonus',
    title: 'BONUS 500',
    badge: '+500',
    bonusVal: 500,
    color: '#D97706',
    bgColor: '#FEF3C7',
    accentColor: '#B45309',
    iconName: 'gift',
    description: 'Erzielst du ein Tutto, erhältst du automatisch +500 Bonuspunkte zu deinen Würfelpunkten.',
  },
  BONUS_600: {
    type: 'bonus_600',
    category: 'bonus',
    title: 'BONUS 600',
    badge: '+600',
    bonusVal: 600,
    color: '#D97706',
    bgColor: '#FEF3C7',
    accentColor: '#B45309',
    iconName: 'gift',
    description: 'Erzielst du ein Tutto, erhältst du automatisch +600 Bonuspunkte zu deinen Würfelpunkten.',
  },
  STOPP: {
    type: 'stopp',
    category: 'stopp',
    title: 'STOPP',
    badge: 'STOPP',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    accentColor: '#991B1B',
    iconName: 'hand-stop-outline',
    description: 'Pech gehabt! Dein Zug endet sofort mit 0 Punkten.',
  },
  FEUERWERK: {
    type: 'feuerwerk',
    category: 'feuerwerk',
    title: 'FEUERWERK',
    badge: '🎆',
    color: '#EA580C',
    bgColor: '#FFEDD5',
    accentColor: '#C2410C',
    iconName: 'flame',
    description: 'Du MUSST weiterwürfeln bis zur Niete! EDGE-CASE: Bei Niete behältst du alle bisherigen Punkte!',
  },
  STRASSE: {
    type: 'strasse',
    category: 'strasse',
    title: 'STRAßE',
    badge: '1 - 6',
    bonusVal: 2000,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    accentColor: '#6D28D9',
    iconName: 'subway',
    description: 'Würfle 1-2-3-4-5-6! Bei Erfolg erhältst du direkt 2.000 Punkte.',
  },
  PLUS_MINUS: {
    type: 'plus_minus',
    category: 'plus_minus',
    title: 'PLUS / MINUS',
    badge: '±1000',
    bonusVal: 1000,
    color: '#0284C7',
    bgColor: '#E0F2FE',
    accentColor: '#0369A1',
    iconName: 'swap-horizontal',
    description: 'Bei Tutto erhältst du 1.000 Pkt. & dem Führenden werden 1.000 Pkt. abgezogen!',
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
    description: 'Bei Tutto werden ALLE deine Würfelpunkte dieses Zuges verdoppelt!',
  },
  KLEEBLATT: {
    type: 'kleeblatt',
    category: 'kleeblatt',
    title: 'KLEEBLATT',
    badge: '🍀',
    color: '#15803D',
    bgColor: '#DCFCE7',
    accentColor: '#166534',
    iconName: 'leaf',
    description: 'Schaffst du 2 Tutto in Folge im selben Zug, hast du SOFORT GEWONNEN!',
  },
};

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

  addCards(CARD_TYPES.BONUS_200, 5);
  addCards(CARD_TYPES.BONUS_300, 5);
  addCards(CARD_TYPES.BONUS_400, 5);
  addCards(CARD_TYPES.BONUS_500, 5);
  addCards(CARD_TYPES.BONUS_600, 5);
  addCards(CARD_TYPES.STOPP, 10);
  addCards(CARD_TYPES.FEUERWERK, 5);
  addCards(CARD_TYPES.STRASSE, 5);
  addCards(CARD_TYPES.PLUS_MINUS, 5);
  addCards(CARD_TYPES.DOUBLE, 5);
  addCards(CARD_TYPES.KLEEBLATT, 1);

  return shuffle(cards);
};

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function App() {
  // --- PLAYER & SCORE STATE ---
  const [players, setPlayers] = useState([
    { id: '1', name: 'Spieler 1', score: 0 },
    { id: '2', name: 'Spieler 2', score: 0 },
  ]);
  const [activePlayerIdx, setActivePlayerIdx] = useState(0);
  const [targetScore, setTargetScore] = useState(6000);
  const [turnScore, setTurnScore] = useState(0);
  const [kleeblattTuttoCount, setKleeblattTuttoCount] = useState(0);

  // Input for adding dice points
  const [diceInput, setDiceInput] = useState('');

  // --- DECK STATE ---
  const [drawPile, setDrawPile] = useState(() => createFreshDeck());
  const [discardPile, setDiscardPile] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);

  // --- MODALS & NOTIFICATIONS ---
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [winnerModal, setWinnerModal] = useState(null);

  // New Player Name Input
  const [newPlayerName, setNewPlayerName] = useState('');

  // Animation values
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateCard = () => {
    scaleAnim.setValue(0.95);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  // --- CARD DRAWING LOGIC ---
  const handleDrawCard = () => {
    if (Platform.OS !== 'web') Vibration.vibrate(30);

    let currentDrawPile = [...drawPile];
    let currentDiscardPile = [...discardPile];

    // Reshuffle if deck empty
    if (currentDrawPile.length === 0) {
      if (currentDiscardPile.length === 0) {
        currentDrawPile = createFreshDeck();
      } else {
        currentDrawPile = shuffle([...currentDiscardPile]);
        currentDiscardPile = [];
      }
    }

    const drawnCard = currentDrawPile.pop();
    if (currentCard) {
      currentDiscardPile.push(currentCard);
    }

    setDrawPile(currentDrawPile);
    setDiscardPile(currentDiscardPile);
    setCurrentCard(drawnCard);
    animateCard();

    // EDGE-CASE 1: STOPP CARD
    if (drawnCard.category === 'stopp') {
      // Turn score for this round becomes 0
      setTurnScore(0);
    }
  };

  // --- ADD DICE POINTS ---
  const handleAddDicePoints = (amount) => {
    if (!currentCard) return;
    if (currentCard.category === 'stopp') return;

    const val = parseInt(amount, 10);
    if (isNaN(val) || val <= 0) return;

    setTurnScore((prev) => prev + val);
    setDiceInput('');
  };

  // --- TUTTO ACHIEVED (AUTOMATIC BONUS CALCULATION) ---
  const handleTuttoAchieved = () => {
    if (!currentCard) return;

    if (Platform.OS !== 'web') Vibration.vibrate([0, 50, 50, 50]);

    let newTurnScore = turnScore;

    // EDGE-CASE 2: BONUS CARDS (+200..+600)
    if (currentCard.category === 'bonus' && currentCard.bonusVal) {
      newTurnScore += currentCard.bonusVal;
    }

    // EDGE-CASE 3: STRASSE CARD (Direct 2000 Pts)
    else if (currentCard.category === 'strasse') {
      newTurnScore += 2000;
    }

    // EDGE-CASE 4: ×2 DOUBLE CARD
    else if (currentCard.category === 'double') {
      newTurnScore = newTurnScore * 2;
    }

    // EDGE-CASE 5: PLUS / MINUS CARD (+1000 to current, -1000 to leader)
    else if (currentCard.category === 'plus_minus') {
      newTurnScore += 1000;

      // Find highest scoring player other than active player
      let maxScore = -1;
      let leaderIdx = -1;

      players.forEach((p, idx) => {
        if (idx !== activePlayerIdx && p.score > maxScore && p.score > 0) {
          maxScore = p.score;
          leaderIdx = idx;
        }
      });

      if (leaderIdx !== -1) {
        const updatedPlayers = [...players];
        const oldScore = updatedPlayers[leaderIdx].score;
        updatedPlayers[leaderIdx].score = Math.max(0, oldScore - 1000);
        setPlayers(updatedPlayers);
      }
    }

    // EDGE-CASE 6: KLEEBLATT CARD (2 Tuttos in a row = Instant Win!)
    else if (currentCard.category === 'kleeblatt') {
      const newCount = kleeblattTuttoCount + 1;
      setKleeblattTuttoCount(newCount);

      if (newCount >= 2) {
        // INSTANT WIN!
        const winner = players[activePlayerIdx];
        setWinnerModal({
          player: winner.name,
          reason: '🍀 SOFORT-SIEG durch 2x Tutto bei Kleeblatt!',
        });
        setTurnScore(newTurnScore);
        return;
      }
    }

    setTurnScore(newTurnScore);
  };

  // --- EDGE-CASE 7: NIETE / GAMBLE LOST (VERZOCKT) ---
  const handleNieteGambleLost = () => {
    if (Platform.OS !== 'web') Vibration.vibrate(200);

    // EDGE-CASE 8: FEUERWERK CARD -> Points accumulated so far ARE KEPT!
    if (currentCard && currentCard.category === 'feuerwerk') {
      saveTurnAndNextPlayer(turnScore);
    } else {
      // Normal Niete: All turn points lost!
      setTurnScore(0);
      setKleeblattTuttoCount(0);
      advanceToNextPlayer();
    }
  };

  // --- SAVE TURN & PASS TO NEXT PLAYER ---
  const handleBankPointsAndEndTurn = () => {
    if (turnScore === 0 && currentCard?.category !== 'stopp') {
      Alert.alert('0 Punkte', 'Möchtest du deinen Zug wirklich mit 0 Punkten beenden?', [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Zug beenden', onPress: () => saveTurnAndNextPlayer(0) },
      ]);
      return;
    }

    saveTurnAndNextPlayer(turnScore);
  };

  const saveTurnAndNextPlayer = (pointsToBank) => {
    const updatedPlayers = [...players];
    const newTotal = updatedPlayers[activePlayerIdx].score + pointsToBank;
    updatedPlayers[activePlayerIdx].score = newTotal;

    setPlayers(updatedPlayers);
    setTurnScore(0);
    setKleeblattTuttoCount(0);

    // Check target score win
    if (newTotal >= targetScore) {
      setWinnerModal({
        player: updatedPlayers[activePlayerIdx].name,
        reason: `Zielpunktzahl von ${targetScore} Punkten erreicht (${newTotal} Pkt)!`,
      });
      return;
    }

    advanceToNextPlayer();
  };

  const advanceToNextPlayer = () => {
    setTurnScore(0);
    setKleeblattTuttoCount(0);
    setCurrentCard(null);
    setActivePlayerIdx((prev) => (prev + 1) % players.length);
  };

  // --- PLAYER MANAGEMENT ---
  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newP = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      score: 0,
    };
    setPlayers([...players, newP]);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (id) => {
    if (players.length <= 1) {
      Alert.alert('Fehler', 'Es muss mindestens 1 Spieler existieren.');
      return;
    }
    const updated = players.filter((p) => p.id !== id);
    setPlayers(updated);
    if (activePlayerIdx >= updated.length) {
      setActivePlayerIdx(0);
    }
  };

  const handleResetScores = () => {
    setPlayers(players.map((p) => ({ ...p, score: 0 })));
    setActivePlayerIdx(0);
    setTurnScore(0);
    setDrawPile(createFreshDeck());
    setDiscardPile([]);
    setCurrentCard(null);
    setWinnerModal(null);
  };

  const activePlayer = players[activePlayerIdx] || players[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* TOP ACTIVE PLAYER BAR */}
      <View style={styles.topPlayerBar}>
        <TouchableOpacity
          style={styles.playerPillActive}
          onPress={() => setShowScoreboard(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="person-circle-outline" size={24} color="#38BDF8" style={{ marginRight: 6 }} />
          <View>
            <Text style={styles.playerPillLabel}>AM ZUG:</Text>
            <Text style={styles.playerPillName}>{activePlayer.name}</Text>
          </View>
          <View style={styles.playerPillScoreBadge}>
            <Text style={styles.playerPillScoreText}>{activePlayer.score} Pkt</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deckBadgeTop}
          onPress={() => setShowInspector(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="layers-outline" size={16} color="#94A3B8" />
          <Text style={styles.deckBadgeTopText}>{drawPile.length} / 56</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN GAME CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* CARD AREA */}
        <View style={styles.cardSection}>
          {currentCard ? (
            <Animated.View
              style={[
                styles.cardBox,
                {
                  backgroundColor: currentCard.bgColor,
                  borderColor: currentCard.color,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={[styles.cardHeader, { backgroundColor: currentCard.color }]}>
                <Text style={styles.cardHeaderTitle}>{currentCard.title}</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={[styles.badgePill, { backgroundColor: currentCard.color }]}>
                  <Text style={styles.badgePillText}>{currentCard.badge}</Text>
                </View>

                <Ionicons
                  name={currentCard.iconName}
                  size={52}
                  color={currentCard.color}
                  style={{ marginVertical: 6 }}
                />

                <Text style={[styles.cardDescText, { color: currentCard.accentColor }]}>
                  {currentCard.description}
                </Text>
              </View>
            </Animated.View>
          ) : (
            <TouchableOpacity
              style={styles.cardBackBox}
              onPress={handleDrawCard}
              activeOpacity={0.8}
            >
              <Ionicons name="help-buoy-outline" size={48} color="#64748B" />
              <Text style={styles.cardBackTitle}>KARTE ZIEHEN</Text>
              <Text style={styles.cardBackSub}>Tippe hier, um für {activePlayer.name} zu ziehen</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* TURN SCORE COUNTER DISPLAY */}
        <View style={styles.turnScoreCard}>
          <Text style={styles.turnScoreLabel}>PUNKTE DIESER RUNDE:</Text>
          <Text style={styles.turnScoreValue}>{turnScore}</Text>

          {/* TUTTO ACTION BUTTON */}
          {currentCard && currentCard.category !== 'stopp' && (
            <TouchableOpacity
              style={styles.tuttoButton}
              onPress={handleTuttoAchieved}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.tuttoButtonText}>TUTTO! (ALLE 6 WÜRFEL)</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* DICE QUICK ADD BUTTONS */}
        {currentCard && currentCard.category !== 'stopp' && (
          <View style={styles.quickAddSection}>
            <Text style={styles.sectionTitleSmall}>WÜRFEL-PUNKTE HINZUFÜGEN:</Text>
            <View style={styles.quickAddGrid}>
              {[50, 100, 200, 300, 400, 500, 600, 1000].map((pts) => (
                <TouchableOpacity
                  key={pts}
                  style={styles.quickAddBtn}
                  onPress={() => handleAddDicePoints(pts)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickAddBtnText}>+{pts}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* MANUAL NUMBER INPUT */}
            <View style={styles.manualInputRow}>
              <TextInput
                style={styles.manualTextInput}
                placeholder="Eigene Punkte..."
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                value={diceInput}
                onChangeText={setDiceInput}
              />
              <TouchableOpacity
                style={styles.manualAddBtn}
                onPress={() => handleAddDicePoints(diceInput)}
              >
                <Text style={styles.manualAddBtnText}>+ Hinzufügen</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM ACTION CONTROL BAR */}
      <View style={styles.bottomControlBar}>
        {!currentCard ? (
          <TouchableOpacity style={styles.btnDrawPrimary} onPress={handleDrawCard}>
            <Ionicons name="card-outline" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnDrawPrimaryText}>KARTE ZIEHEN</Text>
          </TouchableOpacity>
        ) : currentCard.category === 'stopp' ? (
          <TouchableOpacity
            style={styles.btnEndTurnStopp}
            onPress={() => advanceToNextPlayer()}
          >
            <Ionicons name="arrow-forward-circle" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnEndTurnStoppText}>STOPP – NÄCHSTER SPIELER</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionRowSplit}>
            {/* GAMBLE LOST / NIETE BUTTON */}
            <TouchableOpacity
              style={styles.btnNieteRed}
              onPress={handleNieteGambleLost}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={22} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.btnNieteRedText}>NIETE / VERZOCKT!</Text>
            </TouchableOpacity>

            {/* BANK POINTS & END TURN */}
            <TouchableOpacity
              style={styles.btnBankGreen}
              onPress={handleBankPointsAndEndTurn}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.btnBankGreenText}>SICHERN & ENDE</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* MODAL: SCOREBOARD & PLAYERS */}
      <Modal visible={showScoreboard} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🏆 Punktestand (Ziel: {targetScore})</Text>
              <TouchableOpacity onPress={() => setShowScoreboard(false)}>
                <Ionicons name="close-circle" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 260 }}>
              {players
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((p, idx) => (
                  <View
                    key={p.id}
                    style={[
                      styles.scoreRow,
                      players[activePlayerIdx]?.id === p.id && styles.scoreRowActive,
                    ]}
                  >
                    <Text style={styles.rankText}>#{idx + 1}</Text>
                    <Text style={styles.scoreRowName}>{p.name}</Text>
                    <Text style={styles.scoreRowPts}>{p.score} Pkt</Text>
                  </View>
                ))}
            </ScrollView>

            {/* PLAYER SETUP CONTROLS */}
            <View style={styles.playerSetupBox}>
              <Text style={styles.setupTitle}>SPIELER VERWALTEN:</Text>
              <View style={styles.addPlayerRow}>
                <TextInput
                  style={styles.addPlayerInput}
                  placeholder="Neuer Spieler Name..."
                  placeholderTextColor="#64748B"
                  value={newPlayerName}
                  onChangeText={setNewPlayerName}
                />
                <TouchableOpacity style={styles.addPlayerBtn} onPress={handleAddPlayer}>
                  <Text style={styles.addPlayerBtnText}>+ Hinzufügen</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.resetScoresBtn} onPress={handleResetScores}>
                <Ionicons name="refresh-circle-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.resetScoresBtnText}>Spiel & Punkte zurücksetzen</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowScoreboard(false)}>
              <Text style={styles.closeBtnText}>Schließen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: INSPECTOR */}
      <Modal visible={showInspector} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verbleibende Karten ({drawPile.length})</Text>
              <TouchableOpacity onPress={() => setShowInspector(false)}>
                <Ionicons name="close-circle" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 320 }}>
              {Object.values(CARD_TYPES).map((typeObj) => {
                const count = drawPile.filter((c) => c.type === typeObj.type).length;
                return (
                  <View key={typeObj.type} style={styles.inspectorItem}>
                    <Text style={styles.inspectorItemTitle}>{typeObj.title}</Text>
                    <Text style={[styles.inspectorItemCount, { color: typeObj.color }]}>
                      {count} übrig
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowInspector(false)}>
              <Text style={styles.closeBtnText}>Schließen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: WINNER CELEBRATION */}
      <Modal visible={!!winnerModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: '#064E3B', alignItems: 'center' }]}>
            <Ionicons name="trophy" size={72} color="#F59E0B" />
            <Text style={styles.winTitle}>GEWONNEN! 🎉</Text>
            <Text style={styles.winPlayer}>{winnerModal?.player}</Text>
            <Text style={styles.winReason}>{winnerModal?.reason}</Text>

            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: '#10B981', width: '100%', marginTop: 20 }]}
              onPress={handleResetScores}
            >
              <Text style={styles.closeBtnText}>Neues Spiel starten</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topPlayerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  playerPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  playerPillLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
  },
  playerPillName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '900',
  },
  playerPillScoreBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  playerPillScoreText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  deckBadgeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  deckBadgeTopText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  scrollContent: {
    padding: 16,
  },
  cardSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cardBox: {
    width: width - 32,
    height: 250,
    borderRadius: 20,
    borderWidth: 3,
    overflow: 'hidden',
    justifyContent: 'space-between',
    elevation: 4,
  },
  cardHeader: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cardHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardBody: {
    alignItems: 'center',
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
  },
  badgePill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  cardDescText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardBackBox: {
    width: width - 32,
    height: 180,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
  },
  cardBackSub: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  turnScoreCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  turnScoreLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  turnScoreValue: {
    color: '#F59E0B',
    fontSize: 40,
    fontWeight: '900',
    marginVertical: 4,
  },
  tuttoButton: {
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 6,
  },
  tuttoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  quickAddSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  sectionTitleSmall: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 10,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAddBtn: {
    width: '23%',
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAddBtnText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '800',
  },
  manualInputRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  manualTextInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  manualAddBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    marginLeft: 8,
  },
  manualAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  bottomControlBar: {
    padding: 16,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  btnDrawPrimary: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnDrawPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  btnEndTurnStopp: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnEndTurnStoppText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  actionRowSplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnNieteRed: {
    flex: 0.48,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnNieteRedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  btnBankGreen: {
    flex: 0.48,
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnBankGreenText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 12,
    marginBottom: 12,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#334155',
  },
  scoreRowActive: {
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  rankText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '800',
    width: 30,
  },
  scoreRowName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  scoreRowPts: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '900',
  },
  playerSetupBox: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  setupTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
  },
  addPlayerRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  addPlayerInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addPlayerBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: 'center',
    marginLeft: 8,
  },
  addPlayerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  resetScoresBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  resetScoresBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  closeBtn: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeBtnText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  inspectorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  inspectorItemTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  inspectorItemCount: {
    fontSize: 14,
    fontWeight: '800',
  },
  winTitle: {
    color: '#F59E0B',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 12,
  },
  winPlayer: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 6,
  },
  winReason: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
});
