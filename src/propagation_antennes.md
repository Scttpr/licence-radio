# SECTION C : RADIOÉLECTRICITÉ

## PROPAGATION ET ANTENNES

### Relation longueur d'onde / fréquence

**Formule fondamentale :**

**λ(m) = 300 / f(MHz)** ou **f(MHz) = 300 / λ(m)**

où :
- λ = longueur d'onde (en mètres)
- f = fréquence (en MHz)
- 300 = vitesse de la lumière (arrondie à 300 000 km/s)

> **Exemple** : f = 14,1 MHz → λ = 300/14,1 = **21,27 m**
> **Exemple** : λ = 3 cm = 0,03 m → f = 300/0,03 = **10 GHz**

**Effet Doppler :**
- Stations qui se rapprochent → fréquence reçue plus haute
- Stations qui s'éloignent → fréquence reçue plus basse

### Modes de propagation

| Mode | Description | Fréquences |
|------|-------------|------------|
| **Ondes de sol** | Suivent le relief terrestre | Basses fréquences (< 2 MHz) |
| **Ondes réfléchies** | Rebondissent sur l'ionosphère | Ondes courtes (HF) |
| **Ondes directes** | Antennes en vue | VHF et au-delà (> 100 MHz) |

### Propagation en ondes réfléchies

**Couches de l'ionosphère :**

| Couche | Altitude | Caractéristiques |
|--------|----------|------------------|
| **D** | 50-90 km | Atténue les bandes basses, disparaît la nuit |
| **E** | 90-130 km | Réflexion HF |
| **F** | 130-650 km | Réflexion principale, se divise en F1/F2 le jour |

**Caractéristiques :**
- Un bond maximum : ~4000 km
- L'ionisation augmente rapidement à l'aube
- L'ionisation diminue lentement au crépuscule
- Couche D : atténue fortement les bandes basses (40m et +)

**Fréquences de propagation :**
- **FMU** : Fréquence Maximum Utilisable
- **LUF** : Fréquence Minimum Utilisable (limite couche D)
- **ECOF** : Fréquence de coupure couche E
- **FOT** : Fréquence Optimum de Travail = 80% de la FMU

**Indices de propagation :**

| Indice | Mesure | Valeurs |
|--------|--------|---------|
| **Fs (φ)** | Flux solaire (bruit sur 2,8 GHz) | 60-300 |
| **R** | Nombre de taches solaires (Wolf) | 0-200 |
| **K** | Champ magnétique terrestre | 0-9 |
| **A** | Activité géomagnétique | variable |

### 9.4) Antenne doublet demi-onde (dipôle)

**Longueur totale : L(m) = 150 / f(MHz)**

Caractéristiques :
- Aux extrémités : intensité nulle, tension maximale
- Au centre : intensité maximale, tension minimale
- Tension et intensité déphasées de 90°

**Impédance au centre :**
- Brins alignés (180°) : **73 Ω**
- Brins à 120° : **52 Ω**

> En pratique, les brins sont ~5% plus courts que la dimension théorique

### 9.5) Antenne quart d'onde (Ground Plane)

**Longueur du brin : L(m) = 75 / f(MHz)**

Nécessite un plan de sol (radiants, masse, carrosserie...)

**Impédance :**
- Radiants à 90° : **36 Ω**
- Radiants à 120° : **52 Ω**

### 9.6) Antenne Yagi

- **Dipôle** : élément alimenté
- **Directeurs** : plus courts que le dipôle (vers l'avant)
- **Réflecteur** : plus long que le dipôle (vers l'arrière)

Plus d'éléments = plus de gain mais impédance plus faible

### 9.7) Gain d'une antenne

Mesuré dans la direction de rayonnement maximum.

**Unités :**
- **dBd** : par rapport au dipôle
- **dBi** : par rapport à l'antenne isotropique

> Le dipôle a un gain de **2,14 dBi** par rapport à l'isotrope

### 9.8) Puissance Apparente Rayonnée (PAR)

**PAR = Puissance × Coefficient de directivité**

Relations :
- **PIRE = PAR × 1,64** (ou PAR + 2,14 dB)
- **E(V/m) = √(30 × PIRE) / d(m)**

> **Exemple** : 100 W avec antenne 13 dBd
> Coefficient = 20, PAR = 100 × 20 = **2000 W**

### 9.9) Angle d'ouverture

**Angle d'ouverture** = écart d'angle pour lequel la puissance = moitié (-3 dB)

**Rapport avant/arrière** = puissance avant / puissance arrière (en dB)

---

