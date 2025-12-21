## 11) LES SYNOPTIQUES

Les synoptiques sont des schémas de principe (non électriques) montrant l'enchaînement des étages.

### 11.1) Récepteur à amplification directe

Antenne → **RF1** → **RF2** → **Démodulateur** → **AF** → Haut-parleur

- Tous les étages RF accordés sur la fréquence à recevoir
- Difficile à régler si plusieurs fréquences

### 11.2) Récepteur superhétérodyne

Antenne → **Filtre** → **Mélangeur** → **FI** → **Démodulateur** → **AF** → HP
                    ↑
              **Oscillateur local**

**Principe :**
- La fréquence à recevoir (HF) est mélangée avec l'oscillateur local (FO)
- Le résultat donne la fréquence intermédiaire (FI) fixe

**Formules :**
- **FI = HF - FO** (infradyne) ou **FI = FO - HF** (supradyne)

**Avantages de la FI :**
- Meilleure **sélectivité** (filtres plus efficaces)
- Meilleure **sensibilité**

### 11.3) Fréquence image

**Fréquence image (Fim)** = fréquence parasite qui donne la même FI

Pour un récepteur infradyne : **Fim = |2×FO - HF|** ou **Fim = |2×FI - HF|**

> Solution : première FI élevée (100 MHz+) pour rejeter la fréquence image

### 11.4) Sensibilité

**Échelle S-mètre :**

| S | dB/S9 | μV/50Ω |
|---|-------|--------|
| S0 | -54 | 0,1 |
| S5 | -24 | 3 |
| S9 | 0 | **50** |
| S9+10 | +10 | 160 |
| S9+20 | +20 | 500 |

- 6 dB entre chaque point S
- S9 = 50 μV = 50 pW = **-73 dBm**

### 11.5) Émetteur

Micro → **AF** → **Modulateur** → **Mélangeur** → **Ampli PA** → **Filtre anti-harmoniques** → Antenne
                       ↑
                 **Oscillateur**

**Transceiver** : émetteur + récepteur avec éléments communs (oscillateur, antenne)

### 11.6) Compatibilité Électromagnétique (CEM)

- **Émission** : générateur de perturbations
- **Susceptibilité** : récepteur de perturbations
- **Conduite** : par les fils
- **Rayonnée** : par l'air

### 11.7) Intermodulation et bruit

**Intermodulation** : mélange parasite dans un étage non linéaire
- Produits du 3ème ordre : 2A-B, 2B-A (les plus gênants)
- **IP3** : point d'interception du 3ème ordre (le plus haut possible)

**Bruit thermique :**
- **P(dBm) = -174 + 10×log(B)** où B = bande passante en Hz

> Exemple : BP = 2500 Hz → P = -174 + 34 = **-140 dBm**

**Facteur de bruit total :**
- F = F₁ + (F₂-1)/G₁ + (F₃-1)/(G₁×G₂) + ...
- Le premier étage est le plus critique

---

