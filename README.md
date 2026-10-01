# Hasans Kebab – Website

Animierte Website für **Hasans Kebab** (Döner-Pizza-Kebab Hasans) in Bad Schussenried –
„Frisch vom Spieß, direkt auf die Hand“, mit dem **Pom Döner** (Döner mit Pommes drin) als Star.

## Was drin ist

- **Intro-Loader** mit drehendem Dönerspieß
- **Kopfbereich** „HASANS KEBAB“ mit großem Dönerspieß, der sich **nur während der Öffnungszeiten
  (täglich 11–22 Uhr, deutsche Zeit)** langsam dreht und nachts stillsteht. Daneben der Status
  „Jetzt geöffnet“ (grüner Punkt) bzw. „Geschlossen“ (roter Punkt); die Uhrzeit wird beim Laden
  und danach jede Minute geprüft. Buttons „Speisekarte ansehen“ und „Jetzt bestellen“ (ruft 07583 926440 an)
- **Laufbänder** (werden beim Scrollen schneller)
- **Pom-Döner-Baukasten**: beim Scrollen baut sich der Pom Döner Schicht für Schicht zusammen
  (Brot → Fleisch → Salat → Soßen → Pommes → Deckel drauf)
- **Unsere Spezialitäten** als horizontale Scroll-Galerie (am Handy zum Wischen):
  Pom Döner, Döner, Dürüm, Lahmacun, Falafel, Vegetarisch, Döner Box, Döner Teller, Döner Pizza –
  jeweils mit Preis und Allergen-Buchstaben
- **Über uns**: frische Zutaten, hausgemachte Soßen, täglich frisch zubereitet
- **Öffnungszeiten** mit Wochentabelle (heutiger Tag markiert) und Live-Status
- **Standort & Kontakt** mit Adresse, Telefon, „Route planen“ und „Anrufen“
- **Allergenhinweise**: Legende A–N als Tabelle und Hinweis zu Kreuzkontamination
  (auch am Ende der Speisekarte)
- **Die ganze Karte** (Startseite): Kacheln für alle Kategorien – ein Klick öffnet die Speisekarte
- **Eigene Seite `speisekarte.html`**: alle 100+ Gerichte und Getränke mit Preisen und Allergenen,
  Kategorie-Leiste (springt zur Kategorie und zeigt, wo man gerade ist) und Suchfeld
- **Getränke**, **Galerie mit Lightbox**
- Eigener Cursor, magnetische Buttons, 3D-Tilt auf Karten (nur am Desktop)
- Barrierearm: „Zum Inhalt springen“-Link, sichtbare Tastatur-Fokusrahmen, Alt-Texte,
  ausgeschriebene Allergen-Namen für Screenreader
- Respektiert „Bewegung reduzieren“ im Betriebssystem (der Spieß steht dann immer still)

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
4. Nach 1–2 Minuten ist die Seite erreichbar unter **https://hasans-kebab.store**
   (eigene Domain, festgelegt in der Datei `CNAME`)

## Kontaktdaten auf der Seite

- Zeppelinstraße 8, 88427 Bad Schussenried · Tel. 07583 926440
- Täglich 11:00–22:00 Uhr (mit Live-Anzeige „Jetzt geöffnet / Geschlossen“, deutsche Zeit)
- Bar- und Kartenzahlung · Sitzplätze drinnen & draußen · Zum Mitnehmen · keine Reservierungen

Ändern sich die Öffnungszeiten, müssen sie angepasst werden in:
`index.html` (Kopfbereich, Abschnitt „Öffnungszeiten“ und `openingHoursSpecification`) sowie
`OPENS` / `CLOSES` und die Status-Texte in `assets/js/common.js`.

## Noch einzutragen

- Name von Pizza Nr. 70 (fehlt in der Karte, daher noch nicht auf der Seite)

Lahmacun, Falafel und Vegetarisch zeigen auf der Startseite ein großes Symbol statt eines Fotos.
Kommen später Fotos dazu, können sie wie bei den anderen Karten eingesetzt werden.

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
assets/js/common.js         Navigation, Live-Status & Spieß-Drehung, Fortschrittsbalken (alle Seiten)
assets/js/main.js           Animationen der Startseite
assets/js/speisekarte.js    Kategorie-Leiste & Suche der Speisekarte
assets/img/                 Fotos (WebP) + Vorschaubild
assets/fonts/               Schriften (lokal)
download/hasans-website.zip Alle Website-Dateien in einem Ordner zum Herunterladen
```

Nach Änderungen an CSS/JS die Versionsnummer `?v=…` in allen HTML-Dateien erhöhen,
damit Browser nicht die alte Version aus dem Zwischenspeicher zeigen.
