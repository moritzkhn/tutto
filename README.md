# Tutto! Kartenstapel & Punktezähler Simulator (Expo Go - SDK 57)

Diese App bietet zwei Ausführungen für das Würfelspiel **Tutto** (Volle Lotte), optimiert für **Expo SDK 57**:

---

## 📌 2 App-Versionen verfügbar:

### 1. `App.js` (Reiner Kartenstapel-Simulator)
- Perfekt, wenn ihr die Punkte auf Papier aufschreibt und nur den echten 56-Kartenstapel digital auf dem Handy wollt.

### 2. `App_ScoreTracker.js` (Kartenstapel + Automatischer Punktezähler & Regel-Assistent)
- **Mitspieler-Verwaltung**: Beliebig viele Spieler anlegen.
- **Automatische Bonus-Verrechnung** bei `TUTTO!`:
  - **Bonus 200..600**: Punkte werden direkt addiert.
  - **Straße**: +2.000 Punkte.
  - **×2 (Verdoppeln)**: Verdoppelt Rundenpunkte.
  - **Plus / Minus (±1000)**: Addiert 1.000 Pkt. & zieht dem Führenden 1.000 Pkt. ab!
  - **Kleeblatt (🍀)**: Sofort-Sieg bei 2× Tutto.
- **Edge-Cases**:
  - 💥 **Niete / Verzockt**: Großer roter Button setzt Rundenpunkte auf 0.
  - 🎆 **Feuerwerk Edge-Case**: Niete im Feuerwerk behält gesammelte Punkte.
  - 🔴 **Stopp-Karte**: Beendet Zug sofort mit 0 Punkten.

---

## 🚀 Expo Snack auf SDK 57 speichern & ausführen:

1. Öffne **[snack.expo.dev](https://snack.expo.dev)**.
2. Füge den Code der gewünschten Version (`App.js` oder `App_ScoreTracker.js`) in **`App.js`** auf Snack ein.
3. Öffne **`package.json`** in Snack und füge den Inhalt der [`package.json`](package.json) aus diesem Ordner ein:
   ```json
   {
     "dependencies": {
       "expo": "~57.0.0",
       "expo-status-bar": "~2.0.1",
       "react": "18.3.1",
       "react-native": "0.77.0",
       "@expo/vector-icons": "^14.0.4"
     }
   }
   ```
4. Klicke unten rechts in Expo Snack auf das SDK-Auswahlfeld und wähle **SDK 57**.
5. Klicke auf **Save**, um den Snack auf **SDK 57** zu speichern.
