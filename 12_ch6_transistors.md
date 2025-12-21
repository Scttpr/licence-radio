## 6) LES TRANSISTORS ET LEURS MONTAGES

### 6.1) Principe de fonctionnement

Un **transistor bipolaire** est composé de deux diodes montées tête-bêche.

**Types :**
- **NPN** : la flèche Ne Pénètre Pas (émetteur au -)
- **PNP** : la flèche Pénètre (émetteur au +)

**Électrodes :**
- **Émetteur** : repéré par la flèche
- **Base** : fine couche dopée en polarité inverse
- **Collecteur** : dopé comme l'émetteur

> Le collecteur est connecté au boîtier métallique s'il y en a un.

### 6.2) Gain d'un transistor

**Formule : Ic = β × Ib**

où :
- **β** (ou hFE) = gain du transistor
- **Ic** = courant collecteur
- **Ib** = courant base

| Relation | Formule |
|----------|---------|
| Ic = | β × Ib |
| Ib = | Ic / β |
| β = | Ic / Ib |

**Caractéristiques du gain :**
- Le gain **augmente avec la température** (risque d'emballement thermique)
- Le gain **diminue quand la fréquence augmente**
- **Fréquence de coupure** : fréquence où le gain n'est plus que 70% du gain initial (atténuation de 3 dB)

> **Exemple** : Transistor β = 80, Ib = 500 μA
> Ic = 500 μA × 80 = 40 000 μA = **40 mA**

### 6.3) Montages des transistors

| Montage | Gain intensité | Gain tension | Impédance entrée | Impédance sortie | Déphasage |
|---------|---------------|--------------|------------------|------------------|-----------|
| **Émetteur commun** | β | ~β | Moyenne (~100 Ω) | Élevée (~kΩ) | **180°** |
| **Collecteur commun** | β+1 | < 1 | Élevée (~kΩ) | Faible (~10 Ω) | 0° |
| **Base commune** | ~1 | Élevé | Faible (~10 Ω) | Très élevée | 0° |

**Émetteur commun :**
- Le plus couramment utilisé
- Signal de sortie **inversé** (déphasé de 180°)

**Collecteur commun (émetteur suiveur) :**
- Amplificateur de courant
- Utilisé pour alimenter les haut-parleurs et dans les alimentations (ballast)

**Base commune :**
- Amplificateur de tension uniquement
- Peu utilisé

### 6.4) Transistors FET

Les **transistors à effet de champ** (Field Effect Transistor) génèrent moins de bruit que les bipolaires.

**Électrodes :**
- **Source** : entrée
- **Drain** : sortie
- **Porte (Gate)** : commande

**Caractéristiques :**
- On parle de **pente** (et non de gain) : **pente = Id / Vg**
- Impédance d'entrée très grande
- Impédance de sortie très faible

**Types :**
- **J-FET** : FET à jonction
- **MOS-FET** : porte isolée par oxyde de silicium, supporte plus de puissance

### 6.5) Diodes thermoïoniques

Tubes à vide avec :
- **Cathode** : chauffée par un filament (souvent 6,3 V), émet des électrons
- **Anode (plaque)** : récupère les électrons quand sa tension est positive

### 6.6) Autres tubes thermoïoniques

| Tube | Électrodes | Particularité |
|------|-----------|---------------|
| **Triode** | Cathode, Grille, Anode | 3 électrodes, grille négative |
| **Tétrode** | + Écran | Évite les effets capacitifs grille-plaque |
| **Pentode** | + Suppresseuse | Reliée à la cathode, évite le rebond des électrons |

- On parle de **pente** = Ip / Vg (comme pour les FET)
- **Neutrodynage** : méthode alternative avec condensateur ajustable

---

