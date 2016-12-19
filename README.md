
# INT-WAW Boilerplate

Boilerplate fuer das Projekt. Dieses Projekt muss geforked werden,
Meilensteinabgabe wird realisiert via Pull Request.

Pull Requests dienen hierbei der Bewertung, Abnahme und dem Auffinden
von Plagiaten. Meilensteine sind zudem in der [Meilensteinuebersicht](https://github.com/INT-WAW/Boilerplate/milestones)
einsehbar.

Diese werden bei Bekanntgabe im Kurs angepasst, so dass jeder auf
dem gleichen Informationsstand ist.

# Meilensteine

![Overview Chart](./guides/asset/readme-overview.png)

Fuer die erfolgreiche Bewertung des Projekts
sind die Erfuellung der folgenden Meilensteine
notwendig.

Studienleistung des INT-WAW Kurses ist erbracht
bei Antreten des ersten Meilensteins.

## Meilenstein 1

- Verstaendnis von Git, GitHub, Branches, Triangularer Workflow
- Pull-Request auf dieses Projekt mit Teamname im Issue und alle Mitglieder haben schon einmal commited.
- Interface: Status Tabelle Bots (ID, IP, Auftrag, Workload, Aktion)
- Interface: Sidebar-Menu (Status, Auftrag, Bots)
- Interface: GET integration zu CNC Server (/api/Status)

## Meilenstein 2

- Interface: Uebersicht Status Toggle Button (Start/Stop) in Spalte Aktion
- Interface: Uebersicht Tasks (Loeschen)
- Interface: Formular Tasks (Hinzufuegen)
- Interface: POST integration zu CNC Server (/api/Tasks)

## Meilenstein 3

- CNC: Implementierung mit [Babel](https://babeljs.io/), ES7 und [KOA.js](https://github.com/koajs/koa)
- CNC: GET API fuer /api/Status (Interface &lt;= CNC, Status von Bots)
- CNC: POST API fuer /api/Status (BOT =&gt; CNC, Registrierung von Bots)
- CNC: GET API fuer /api/Tasks (Bot &lt;= CNC, Abnahme von Arbeit)
- CNC: POST API fuer /api/Tasks (Interface =&gt; CNC, Erstellen von Arbeit)
- Interface: Uebersicht Tasks Loeschen Button (Remove) in Spalte Aktion
- CNC: DELETE API fuer /api/Tasks (Interface =&gt; CNC, Loeschen von Arbeit)

## Meilenstein 4

- CNC: GET /api/Tasks/new fuer unbearbeitete Auftraege (Tasks mit `output == null`)
- BOT: GET /api/Tasks/new
- BOT: POST /api/Tasks/:id fuer Bearbeitung der Tasks


# Terminologie

## CNC Interface (kurz: Interface)

Das CNC Interface ist eine lokale HTML5 Applikation. Es dient zur
Kontrolle der Bots via deren CNC Server. Typischerweise ist diese
lokale Applikation dafuer ausgelegt, mehrere (n) Server und mehrere
(n * n) Bots zu kontrollieren und zu verwalten.

Den notwendigen Exploiting-Aspekt und wie diese Bots in der Regel
auf Rechner gelangen ignorieren wir in dieser Vorlesung. In der
Projektabnahme (Testate) werden mehrere Bots (ca. 100 - 200, davon
ca. 2 lokal) zur Verfuegung sein, um das Projekt zu testen.

## CNC Server (kurz: CNC)

Der CNC Server ist der sogenannte Command and Control Server. Dieser
Server kontrolliert eine ihm bekannte Menge an Bots, welche sich, bei
Aktivierung bzw. Ausfuehrung, registrieren.

Sinn des CNC Servers ist die intelligente Aufgabenverteilung fuer
potenzielle Ausfaelle von Bots. Dementsprechend sollen Aufgaben
redundant verteilt und bearbeitet werden, um die Auswertung dahinter
zu ueberpruefen und bei Kalkulationen den Mittelwert der Reports
(Resultate) zu errechnen.

## Bot (kurz: BOT)

Ein Bot ist in unserem Fall ein stumpfes Programm, welches zur
Ausgliederung von Arbeit (Workload) einer zentralen Architektur
verwendet wird. Dies kann z.B. rechenintensive Arbeit, wie z.B. das
Berechnen von Hashes oder das Bruteforcen von Kennwoerten zu ihren
Hashes sein.

In der Projektabnahme (Testate) werden diese Bots mit dem letzten
Verfuegbaren Stable Release von [node.js](https://nodejs.org)
bestueckt sein.

