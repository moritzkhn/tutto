# 🚀 Anleitung: App kostenlos auf GitHub Pages veröffentlichen

Mit dieser Anleitung erstellst du in unter 3 Minuten deinen eigenen kostenlosen Web-Link, den du all deinen Freunden schicken kannst!

---

## 📋 Schritt 1: GitHub Repository erstellen
1. Gehe auf **[github.com](https://github.com)** (falls noch nicht eingeloggt, kurz registrieren).
2. Klicke oben rechts auf das **`+`** Symbol -> **New repository**.
3. Gib als Repository Name z. B. `tutto` ein.
4. Stelle sicher, dass das Repository auf **Public** steht.
5. Klicke auf **Create repository**.

---

## 📤 Schritt 2: Code auf GitHub hochladen
Kopiere diese 3 Befehle in dein Terminal (VS Code / PowerShell) im Ordner `c:\Repositories\tutto`:

```bash
git init
git add .
git commit -m "Tutto Web App fertiggestellt"
git branch -M main
git remote add origin https://github.com/DEIN-BENUTZERNAME/tutto.git
git push -u origin main
```
*(Ersetze `DEIN-BENUTZERNAME` durch deinen tatsächlichen GitHub-Namen)*

---

## ⚡ Schritt 3: GitHub Pages in 3 Klicks aktivieren
1. Gehe in deinem GitHub-Repository oben auf den Tab **Settings** (Einstellungen).
2. Klicke in der linken Seitenleiste auf **Pages**.
3. Unter **Build and deployment** bei **Branch**:
   - Wähle **`main`** aus.
   - Wähle **`/ (root)`** aus.
   - Klicke auf **Save**.

---

## 🎉 Fertig!
Nach ca. 1-2 Minuten ist deine App unter folgendem Link weltweit erreichbar:

👉 **`https://DEIN-BENUTZERNAME.github.io/tutto/`**

### 📱 Wie deine Freunde die App auf dem Handy nutzen:
- **iPhone (Safari)**: Den Link öffnen -> auf den **Teilen-Button** (Viereck mit Pfeil nach oben) tippen -> **„Zum Home-Bildschirm“**.
- **Android (Chrome)**: Den Link öffnen -> oben rechts auf die 3 Punkte tippen -> **„App installieren“** oder **„Zum Startbildschirm hinzufügen“**.

Die App öffnet sich danach wie eine **echte native App** im Vollbild und funktioniert **100% offline**!
