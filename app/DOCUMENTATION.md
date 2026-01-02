# Licence Radio - Guide d'utilisation

Plateforme d'apprentissage pour la preparation a l'examen de radioamateur francais (Certificat d'Operateur du Service Amateur).

---

## Table des matieres

1. [Presentation](#presentation)
2. [Navigation](#navigation)
3. [Tableau de bord](#tableau-de-bord)
4. [Sessions d'apprentissage](#sessions-dapprentissage)
5. [Mode examen](#mode-examen)
6. [Systeme de repetition espacee](#systeme-de-repetition-espacee)
7. [Statistiques](#statistiques)
8. [Points faibles](#points-faibles)
9. [Reference des formules](#reference-des-formules)
10. [Parametres](#parametres)
11. [Fonctionnement hors ligne](#fonctionnement-hors-ligne)
12. [Conseils d'utilisation](#conseils-dutilisation)

---

## Presentation

Cette plateforme utilise la **repetition espacee** (algorithme SM-2) pour optimiser la memorisation du contenu necessaire a l'examen radioamateur. L'application fonctionne entierement dans le navigateur et sauvegarde automatiquement votre progression.

### Contenu couvert

- **Introduction** : Structure de l'examen
- **Reglementation** : Lois, frequences, indicatifs
- **Technique** : Electricite, composants, electronique radio

---

## Navigation

La barre de navigation en haut de l'ecran propose 7 options :

| Bouton | Fonction |
|--------|----------|
| **Accueil** | Retour au tableau de bord principal |
| **Progression** | Vue detaillee de la progression par section |
| **Stats** | Analytiques d'apprentissage et tendances |
| **Faiblesses** | Identification des sujets problematiques |
| **Examen** | Acces aux examens blancs |
| **Formules** | Reference rapide des formules cles |
| **Parametres** | Configuration de l'application |

---

## Tableau de bord

L'ecran d'accueil affiche :

### Indicateurs rapides

- **Serie** : Jours consecutifs d'etude (emoji selon la progression)
- **Questions repondues** : Nombre total de questions traitees
- **Precision** : Pourcentage global de bonnes reponses
- **Progression generale** : Barre de maitrise globale

### Actions du jour

- **Cartes a reviser** : Nombre de cartes dues pour revision
- **Commencer la session** : Lance une session mixte (apprentissage + revisions)
- **Reviser uniquement** : Se concentre sur les revisions en attente

### Progression par section

Liste des sections avec :
- Barre de progression coloree
- Pourcentage de maitrise
- Acces rapide a la revision du theme

---

## Sessions d'apprentissage

### Types de sessions

#### 1. Session standard (mode entrelace)
**Acces** : Bouton "Commencer la session"

Structure d'une session :
1. 3 questions de revision
2. Lecture d'un segment de cours
3. Questions sur le segment
4. 3 nouvelles revisions
5. (cycle qui se repete)

Cette methode alterne entre nouveau contenu et revisions pour optimiser la memorisation.

#### 2. Session de revision
**Acces** : Bouton "Reviser uniquement"

- Uniquement les cartes dues pour revision
- Aucun nouveau contenu
- Maximum 50 cartes par session

#### 3. Revision par theme
**Acces** : Bouton "Reviser ce theme" dans la progression

- Cible une section specifique
- Revise les cartes non maitrisees du theme
- Ideal pour travailler les points faibles

#### 4. Lecon suivante
**Acces** : Bouton "Lecon suivante" apres une session

- Continue directement avec le prochain segment
- Sans revisions intercalees
- Pour les sessions d'etude intensives

### Deroulement d'une question

1. **Affichage** : Question avec 4 options ou Vrai/Faux
2. **Selection** : Cliquez sur votre reponse
3. **Feedback** :
   - Indication correct/incorrect
   - Explication de la reponse
   - Mise en surbrillance des reponses
4. **Suivant** : Cliquez pour continuer

### Indicateurs pendant la session

- **Badge "Revision"** : Question de revision espacee
- **Badge "Nouveau"** : Premiere rencontre avec la question
- **Compteur** : Position dans la session

---

## Mode examen

### Types d'examens disponibles

| Examen | Questions | Duree | Seuil de reussite | Contenu |
|--------|-----------|-------|-------------------|---------|
| **Technique** | 20 | 30 min | 10/20 | Electricite, composants, electronique |
| **Reglementation** | 20 | 30 min | 10/20 | Reglementation radioamateur |
| **Complet** | 40 | 60 min | 10/20 par partie | Les deux epreuves |

### Deroulement de l'examen

1. **Selection** : Choisissez le type d'examen
2. **Minuteur** : Compte a rebours affiche en haut a droite
3. **Questions** : Repondez dans l'ordre (pas de retour possible)
4. **Fin** : Automatique a expiration ou apres la derniere question

### Alertes de temps

- **Normal** : Affichage vert
- **5 minutes restantes** : Affichage jaune
- **2 minutes restantes** : Affichage rouge

### Ecran de resultats

- Statut reussite/echec
- Score X/20 et pourcentage
- Statistiques (correct, incorrect, temps utilise)
- Revue complete des questions avec explications
- Options : Recommencer ou Retour a l'accueil

---

## Systeme de repetition espacee

L'application utilise l'algorithme **SM-2** (SuperMemo 2) pour planifier les revisions.

### Etats d'une carte

| Etat | Condition | Comportement |
|------|-----------|--------------|
| **Nouveau** | Premiere rencontre | Apparait lors de l'apprentissage |
| **En apprentissage** | 0-1 reponses correctes consecutives | Revisions frequentes |
| **En revision** | 1-2 reponses correctes consecutives | Intervalles moyens |
| **Maitrise** | 3+ reponses correctes consecutives | N'apparait plus en revision |

### Intervalles de revision

- **1ere revision** : 1 jour
- **2eme revision** : 6 jours
- **Suivantes** : Intervalle x Facteur de facilite

### Facteur de facilite

- **Plage** : 1.3 a 3.0
- **Defaut** : 2.5
- **Reponse correcte** : Augmente le facteur
- **Reponse incorrecte** : Diminue le facteur

Un facteur plus eleve = intervalles plus longs = carte plus facile.

### Impact des reponses

| Reponse | Effet sur l'intervalle | Effet sur le compteur |
|---------|------------------------|------------------------|
| Correcte | Multiplie par le facteur | +1 consecutif (max 3) |
| Incorrecte | Reinitialise a 1 jour | Remise a 0 |

### Maitrise

Une carte atteint le statut "Maitrisee" apres 3 reponses correctes consecutives. Elle ne reapparaitra plus dans les sessions de revision.

---

## Statistiques

### Vue des statistiques

**Acces** : Bouton "Stats" dans la navigation

#### Cartes de resume

| Indicateur | Description |
|------------|-------------|
| **Jours consecutifs** | Serie actuelle + record personnel |
| **Questions totales** | Cumul total + cette semaine |
| **Precision globale** | Moyenne generale + cette semaine |
| **Maitrise globale** | Pourcentage + nombre de cartes |

#### Graphique d'activite (14 jours)

- Histogramme des questions repondues par jour
- Mise en evidence du jour actuel
- Valeurs numeriques sur les barres

#### Tendance de precision

- Moyenne glissante sur 7 jours
- Affiche quand suffisamment de donnees disponibles

### Donnees suivies

- Historique quotidien (90 derniers jours)
- Precision par section
- Statistiques de chaque carte (intervalle, facilite, etc.)

---

## Points faibles

### Vue des faiblesses

**Acces** : Bouton "Faiblesses" dans la navigation

#### Sections sous le seuil (80%)

Liste des sections avec :
- Pourcentage actuel de maitrise
- Barre de progression coloree
- Ecart par rapport au seuil de 80%
- Bouton "Reviser ce theme"

Triees par ecart (plus grand ecart = plus urgent).

#### Questions problematiques

Les 10 cartes les plus urgentes basees sur :
- Facteur de facilite < 2.0 (difficulte elevee)
- Bloquees en apprentissage sans progression
- Nombreuses repetitions sans atteindre la maitrise

Pour chaque question :
- Theme/segment concerne
- Etat actuel
- Facteur de facilite (EF)
- Progression vers la maitrise (X/3)

---

## Reference des formules

### Acces

**Bouton "Formules"** dans la navigation ou pendant une session.

### Fonctionnalites

- **Recherche** : Filtrage en temps reel par nom, unite ou note
- **6 categories** de formules essentielles

### Categories

#### 1. Electricite - Bases
- Loi d'Ohm : U = R x I
- Puissance : P = U x I
- Resistances serie/parallele
- Loi de Joule
- Capacites serie/parallele

#### 2. Decibels
- dB (puissance) : G = 10 x log(P2/P1)
- dB (tension) : G = 20 x log(U2/U1)
- Valeurs cles : +3dB = x2, +10dB = x10

#### 3. Frequences et circuits LC
- Formule de Thomson : f = 1 / (2pi x racine(LC))
- Longueur d'onde : lambda = 300/f(MHz)
- Reactances XL et XC
- Facteur Q

#### 4. Antennes
- Dipole demi-onde : L = 150/f(MHz)
- Quart d'onde : L = 75/f(MHz)
- ROS (Rapport d'Ondes Stationnaires)
- Puissance reflechie

#### 5. Puissance et propagation
- PAR = Pemetteur x Gantenne
- Conversions dBm/Watts
- Affaiblissement en espace libre

#### 6. Securite
- Tensions de securite (50V sec, 24V humide, 12V immersion)
- Couleurs des fils (Vert-Jaune = Terre, Bleu = Neutre)

---

## Parametres

### Acces

**Bouton "Parametres"** dans la navigation.

### Theme

- **Clair** : Interface lumineuse
- **Sombre** : Interface sombre (confort visuel)

Le theme est sauvegarde et persiste entre les sessions.

### Notifications

**Prerequis** : Navigateur compatible + autorisation accordee

| Option | Description |
|--------|-------------|
| **Activer les rappels** | Active/desactive toutes les notifications |
| **Heure du rappel** | Heure du rappel quotidien (defaut: 19:00) |
| **Alerte serie en danger** | Notification si vous risquez de perdre votre serie |
| **Rappel revisions** | Notification quand des revisions sont en attente |

### Gestion des donnees

| Action | Description |
|--------|-------------|
| **Exporter** | Telecharge toute la progression en fichier JSON |
| **Importer** | Charge une progression precedemment exportee |
| **Reinitialiser** | Efface toutes les donnees (irreversible) |

---

## Fonctionnement hors ligne

L'application utilise un **Service Worker** pour fonctionner sans connexion.

### Fonctionnalites

- Cache automatique des ressources essentielles
- Fonctionnement complet hors ligne apres le premier chargement
- Mise a jour automatique lors de la reconnexion

### Mise a jour

Quand une nouvelle version est disponible :
1. Bandeau de notification en bas de l'ecran
2. Cliquez "Mettre a jour" pour actualiser

---

## Conseils d'utilisation

### Pour une preparation efficace

1. **Regularite** : Etudiez chaque jour, meme 10-15 minutes
2. **Revisions d'abord** : Traitez les cartes dues avant d'apprendre du nouveau
3. **Points faibles** : Consultez regulierement la vue "Faiblesses"
4. **Examens blancs** : Testez-vous regulierement en conditions reelles

### Objectif de maitrise

- **80% de maitrise** = Pret pour l'examen
- Badge "Pret pour l'examen" affiche quand l'objectif est atteint

### Indicateurs de serie

| Emoji | Signification |
|-------|---------------|
| Calendrier | Serie de base |
| Etoile | 3+ jours consecutifs |
| Feu | 7+ jours consecutifs |

### Strategie recommandee

1. **Semaine 1-2** : Parcourir tout le contenu une premiere fois
2. **Semaine 3-4** : Revisions quotidiennes + focus sur les faiblesses
3. **Derniere semaine** : Examens blancs quotidiens

### En cas de difficulte

- Les cartes difficiles reapparaissent plus frequemment
- Le facteur de facilite s'ajuste automatiquement
- Utilisez la vue "Faiblesses" pour identifier les sujets a revoir

---

## Support technique

### Sauvegarde

La progression est sauvegardee automatiquement dans le navigateur (localStorage).

**Important** : Exportez regulierement vos donnees pour eviter toute perte en cas de probleme.

### Compatibilite

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Fonctionne sur ordinateur, tablette et mobile
- Support des formules mathematiques (KaTeX)

### Problemes courants

| Probleme | Solution |
|----------|----------|
| Donnees perdues | Importez une sauvegarde precedente |
| Notifications inactives | Verifiez les autorisations du navigateur |
| Affichage incorrect | Videz le cache et rechargez la page |

---

## Raccourcis

| Action | Methode |
|--------|---------|
| Fermer une fenetre modale | Clic en dehors ou touche Echap |
| Selectionner une reponse | Clic sur l'option |
| Passer a la question suivante | Clic sur "Suivant" |

---

*Bonne preparation et bonne chance pour votre examen !*
