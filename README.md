# Hasan's Döner · Pizza · Kebab – Website

Animierte One-Page-Website für **Hasan's Döner-Pizza-Kebab** in Bad Schussenried –
mit dem **Pom Döner** (Döner mit Pommes drin) als Star.

## Was drin ist

- **Intro-Loader** mit drehendem Dönerspieß
- **Hero** „POM DÖNER“ mit Buchstaben-Animation, schwebenden Pommes und rotierendem Badge
- **Laufbänder** (werden beim Scrollen schneller)
- **Pom-Döner-Baukasten**: beim Scrollen baut sich der Pom Döner Schicht für Schicht zusammen
  (Brot → Fleisch → Salat → Soßen → Pommes → Deckel drauf)
- **Speisekarte** als horizontale Scroll-Galerie (am Handy zum Wischen):
  Pom Döner, Döner, Dürüm, Döner Box, Döner Teller, Döner Pizza
- **Die ganze Karte** (Startseite): Kacheln für alle Kategorien – ein Klick öffnet die Speisekarte
- **Eigene Seite `speisekarte.html`**: alle 100+ Gerichte und Getränke mit Preisen und Allergenen,
  Kategorie-Leiste (springt zur Kategorie und zeigt, wo man gerade ist) und Suchfeld
- **Getränke**, **Galerie mit Lightbox**, **Besuch/Route**
- Eigener Cursor, magnetische Buttons, 3D-Tilt auf Karten (nur am Desktop)
- Respektiert „Bewegung reduzieren“ im Betriebssystem

Reines HTML/CSS/JavaScript – kein Build-Schritt, keine externen Server.
Die Schriften (Unbounded, Manrope – SIL Open Font License) liegen lokal in `assets/fonts/`,
es werden also keine Google-Fonts-Server angefragt.

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Link erstellen (GitHub Pages)

1. Auf GitHub: **Settings → Pages**
2. Bei *Source*: **Deploy from a branch**
3. Branch **main** und Ordner **/ (root)** wählen → **Save**
4. Nach 1–2 Minuten ist die Seite erreichbar unter
   `https://beratyigit2009ay-droid.github.io/Hassan-s-Kebab-D-ner-/`

## Kontaktdaten auf der Seite

- Zeppelinstraße 8, 88427 Bad Schussenried · Tel. 07583 926440
- Täglich 11:00–22:00 Uhr (mit Live-Anzeige „Jetzt geöffnet / Gerade geschlossen“, deutsche Zeit)
- Bar- und Kartenzahlung · Sitzplätze drinnen & draußen · Zum Mitnehmen · keine Reservierungen

Ändern sich die Öffnungszeiten, müssen sie an drei Stellen angepasst werden:
`index.html` (Karte „Öffnungszeiten“ und `openingHoursSpecification`) sowie
`OPENS` / `CLOSES` in `assets/js/main.js`.

## Noch einzutragen

- Name von Pizza Nr. 70 (fehlt in der Karte, daher noch nicht auf der Seite)
- Erklärung der Allergen-/Zusatzstoff-Kürzel (A, C, G … / 2, 3, 5 …)

Impressum und Datenschutz werden aus einem Skript erzeugt; fehlende Angaben würden dort
als `<span class="fehlt">` gelb markiert (aktuell keine).

Die Datenschutzerklärung beschreibt nur, was die Website tatsächlich tut: keine Cookies,
kein Tracking, keine eingebetteten Drittinhalte, Schriften lokal, Hosting über GitHub Pages.
Wird später etwas Externes eingebunden (z. B. Karte, Analyse, Formular), muss sie angepasst werden.

## Struktur

```
index.html                  Startseite
speisekarte.html            Speisekarte (eigene Seite)
impressum.html              Impressum
datenschutz.html            Datenschutzerklärung
assets/css/style.css        Design & Animationen (beide Seiten)
assets/js/common.js         Navigation, Live-Status, Fortschrittsbalken (beide Seiten)
assets/js/main.js           Animationen der Startseite
assets/js/speisekarte.js    Kategorie-Leiste & Suche der Speisekarte
assets/img/                 Fotos (WebP) + Vorschaubild
assets/fonts/               Schriften (lokal)
download/hasans-website.zip Alle Website-Dateien in einem Ordner zum Herunterladen
```

Nach Änderungen an CSS/JS die Versionsnummer `?v=…` in beiden HTML-Dateien erhöhen,
damit Browser nicht die alte Version aus dem Zwischenspeicher zeigen.
