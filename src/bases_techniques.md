## Section B : Connaissances techniques de base

## CONNAISSANCES TECHNIQUES DE BASE

### Puissances, rapports de puissance et décibels (dB)

Le **décibel (dB)** est une unité permettant d'exprimer un rapport entre deux grandeurs de même nature.

#### Tableau des rapports en puissance

| Gain (dB) | -20 dB | -10 dB | -6 dB | -3 dB | 0 dB | +3 dB | +6 dB | +10 dB | +20 dB |
|-----------|--------|--------|-------|-------|------|-------|-------|--------|--------|
| Rapport | ÷100 | ÷10 | ÷4 | ÷2 | =1 | ×2 | ×4 | ×10 | ×100 |

> **Exemple** : Un amplificateur a un gain de 6 dB. Sa puissance d'entrée est de 15 W.
> Quelle est sa puissance de sortie ?
> **Réponse** : 6 dB = ×4, donc 15 W × 4 = **60 W**

Les décibels peuvent exprimer des niveaux relatifs :
- **dBW** : décibel par rapport à 1 watt
- **dBm** : décibel par rapport à 1 milliwatt
- **dBμ** : décibel par rapport à 1 microwatt
- **dBc** : décibel par rapport à la puissance d'émission

Conversion : **dBW = dBm + 30 = dBμ + 60**

#### Rendement

Le **rendement**, exprimé en %, est le rapport entre la puissance utile et la puissance consommée totale :

**Rendement (%) = (Puissance utile × 100) / Puissance consommée**

> **Exemple** : Un émetteur consomme 50 watts. Sa puissance de sortie est 30 watts.
> **Rendement** = (30 × 100) / 50 = **60%**

---

### Types et caractéristiques des antennes

#### a) Relation longueur d'onde / fréquence

Dans le vide (ou dans l'air), les ondes radio se déplacent à la **vitesse de la lumière** (300 000 km/s).

**f(MHz) = 300 / λ(m)** et **λ(m) = 300 / f(MHz)**

> **Exemples** :
> - Longueur d'onde de 150 MHz ? → 300 / 150 = **2 mètres**
> - Fréquence pour 100 mètres ? → 300 / 100 = **3 MHz**

#### b) Gammes d'ondes

| Gamme | Ondes | Longueurs d'onde | Fréquences |
|-------|-------|------------------|------------|
| **VLF** | Myriamétriques | > 10 km | < 30 kHz |
| **LF** | Kilométriques | 1 à 10 km | 30 à 300 kHz |
| **MF** | Hectométriques | 100 m à 1 km | 300 kHz à 3 MHz |
| **HF** | Décamétriques | 10 à 100 m | 3 à 30 MHz |
| **VHF** | Métriques | 1 à 10 m | 30 à 300 MHz |
| **UHF** | Décimétriques | 10 cm à 1 m | 300 MHz à 3 GHz |
| **SHF** | Centimétriques | 1 à 10 cm | 3 à 30 GHz |
| **EHF** | Millimétriques | 1 mm à 1 cm | 30 à 300 GHz |

#### c) Antenne doublet demi-onde (dipôle)

L'antenne de base. Elle est constituée d'un fil d'une longueur égale à une **demi-longueur d'onde** alimenté en son milieu.

Impédance au point d'alimentation :
- Brins alignés (180°) : **73 Ω**
- Angle de 120° : **52 Ω**
- Angle droit (90°) : **36 Ω**

#### d) Antenne doublet demi-onde replié (trombone)

Les extrémités libres du dipôle sont reliées par un fil parallèle. La longueur totale du fil est égale à une longueur d'onde.

Impédance : environ **300 Ω** au point d'alimentation.

#### e) Antenne quart d'onde verticale (Ground Plane)

Une moitié de dipôle avec un plan de sol ou une masse.

Impédance :
- Radiants perpendiculaires (90°) : **36 Ω**
- Radiants à 120° : **52 Ω**

> **Exemple** : Longueur d'une antenne quart d'onde pour 150 MHz ?
> λ = 300 / 150 = 2 m → Quart d'onde = 2 m / 4 = **50 cm**

#### f) Antenne Yagi (Beam)

Antenne directionnelle avec :
- **Éléments directeurs** : plus courts que le dipôle (devant)
- **Éléments réflecteurs** : plus longs que le dipôle (derrière)

Plus il y a d'éléments, plus le gain augmente et l'impédance diminue.

#### g) Gain d'une antenne

Le gain se mesure dans la direction maximum de rayonnement :
- **dBd** : par rapport au doublet
- **dBiso** : par rapport à l'antenne isotropique

Le doublet a un gain de **2,14 dB** par rapport à l'antenne isotropique.

#### h) Puissance apparente rayonnée (PAR)

**PAR = Puissance d'alimentation × Gain de l'antenne (rapport)**

La **PIRE** (Puissance Isotrope Rayonnée Équivalente) prend pour référence l'antenne isotropique.

#### i) Angle d'ouverture

L'écart d'angle entre les directions pour lesquelles la puissance rayonnée est la moitié (**-3 dB**) de la puissance rayonnée dans la direction la plus favorable.

---

### Lignes de transmission

#### a) Caractéristiques

La **ligne de transmission** peut être :
- **Asymétrique** : câble coaxial
- **Symétrique** : twin-lead ou « échelle à grenouille »

L'**affaiblissement linéique** (perte) est exprimé en **dB/m** et augmente avec la fréquence.

> **Exemple** : Câble de 20 m avec perte de 0,1 dB/m :
> - Perte totale = 20 × 0,1 = **2 dB**
> - Si antenne = 8 dBd, gain ensemble = 8 - 2 = **6 dB**
> - Si puissance = 50 W, PAR = 50 × 4 = **200 W** (6 dB = ×4)

#### b) TOS et désadaptation

Lorsque la ligne et la charge n'ont pas la même impédance, il apparaît des **ondes stationnaires**.

**Coefficient de réflexion (ρ)** = U réfléchie / U émise

**TOS (%)** = 100 × ρ

**ROS** = Z plus forte / Z plus faible

> **Exemple** : Antenne 100 Ω, câble 50 Ω → ROS = 100 / 50 = **2:1**

#### c) Adaptation d'impédance

- **Boîte de couplage** (ou boîte d'accord)
- **Balun** : adaptation symétrique/asymétrique
- **Ligne quart d'onde** : Zligne = √(Zentrée × Zsortie)

---

### Brouillage et protections des équipements électroniques

#### a) Compatibilité Électromagnétique (CEM)

Aptitude d'équipements à fonctionner dans leur environnement électromagnétique sans produire de perturbations intolérables.

Types de perturbations :
- **Conduite** : véhiculée par les conducteurs
- **Rayonnée** : propagée par champ électromagnétique

#### b) Moyens de protection

- **Filtrage** de l'alimentation secteur
- **Blindages** des étages de puissance
- **Filtres passe-bas** pour bloquer les harmoniques
- **Filtres passe-haut** pour les récepteurs TV

#### c) Intermodulation

Mélange de fréquences créé par un étage non linéaire. Produit des fréquences [A+B], [A-B], [2A-B], [2B-A]...

#### d) Transmodulation

Un signal puissant provoque une surcharge de l'étage d'entrée du récepteur et module le signal désiré.

---

### Protection électrique

#### a) Protection des personnes

- La HF (particulièrement SHF et EHF) peut être dangereuse
- Tensions importantes dans l'antenne pendant l'émission
- Sécurité pour l'installation des aériens (baudrier, casque, etc.)

#### b) Risques électriques

Tensions de sécurité maximales :
- Milieu sec : **50 V**
- Milieu humide : **24 V**
- Immersion : **12 V**

Couleurs des fils 50 Hz :
- **Jaune-vert** : terre (protection)
- **Bleu** : neutre
- **Rouge/marron/noir** : phase (le plus dangereux)

Moyens de protection :
- Mise à la terre des parties métalliques
- Disjoncteurs différentiels

#### c) Protection contre la foudre

- Câble coaxial disposé avec des coudes francs
- Parafoudre si paratonnerre sur le bâtiment
- Par temps d'orage : cesser d'émettre et débrancher les câbles

---

