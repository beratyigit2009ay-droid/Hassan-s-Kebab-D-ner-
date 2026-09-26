# Hasan's Döner · Pizza · Kebab – Website

Animierte One-Page-Website für **Hasan's Döner-Pizza-Kebab** in Bad Schussenried –
mit dem **Pom Döner** (Döner mit Pommes drin) als Star.

## Was drin ist

- **Intro-Loader** mit drehendem Dönerspieß
- **Hero** „POM DÖNER“ mit Buchstaben-Animation, schwebenden Pommes und rotierendem Badge
- **Laufbänder** (werden beim Scrollen schneller)
- **Pom-Döner-Baukasten**: beim Scrollen baut sich der Pom Döner Schicht für Schicht zusammen
  (Brot → Fleisch → Salat → Soßen → Pommes → Deckel drauf)
- **Menü** als horizontale Scroll-Galerie (am Handy zum Wischen)
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

## Noch einzutragen

Diese Infos kenne ich nicht, deshalb sind sie (noch) nicht auf der Seite:

- Adresse (Straße), Telefonnummer, Öffnungszeiten
- Preise im Menü
- **Impressum** und **Datenschutzerklärung** – für eine geschäftliche Website in Deutschland Pflicht

## Struktur

```
index.html            Seite
assets/css/style.css  Design & Animationen
assets/js/main.js     Scroll- und Interaktions-Animationen
assets/img/           Fotos (WebP) + Vorschaubild
assets/fonts/         Schriften (lokal)
```
