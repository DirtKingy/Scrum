# Eigen Scrum Software (In actieve ontwikkeling)

Dit project is een eigen Scrum-applicatie die ik vanaf scratch heb ontworpen, geleid en gebouwd als Solo Developer en Architect tijdens mijn stageperiode. Alle intellectuele eigendomsrechten van deze specifieke broncode behoren exclusief aan mij toe.

## 🚀 De Architectuur & Hoogtepunten

Het project is organisch gestart, maar groeide al snel uit tot een complexe data-uitdaging. Om wildgroei van data te voorkomen, heb ik de applicatie succesvol omgebouwd naar een strikte **Single Source of Truth (SSoT)** middels een gecentraliseerde Pinia store. 

### Het 'Nested Drag-and-Drop' Probleem Opgetackeld
Het zwaartepunt van dit project lag op het bouwen van een complexe geneste boomstructuur voor drag-and-drop. De library `vuedraggable@next` muteerde standaard de data direct in de DOM, wat zorgde voor 'stale data' en desynchronisatie met de database. 

Ik heb dit fundamenteel opgelost door:
1. De DOM-library uitsluitend te laten werken op lokale, reactieve arrays.
2. De directe mutaties te blokkeren.
3. De acties van de gebruiker af te vangen en via gerichte `emits` als 'mutatieverzoeken' door te sturen naar de centrale Pinia store.

Dit resulteerde in een uiterst voorspelbare datastroom en een robuuste gebruikerservaring.

## 🛠️ Tech Stack
* **Frontend:** Vue 3 (Composition API), `vuedraggable@next`
* **State Management:** Pinia (SSoT)
* **Backend / Database:** Supabase

*Let op: De applicatie bevindt zich momenteel in de funderingsfase. Functies zoals backend user-creation staan nog op de roadmap.*