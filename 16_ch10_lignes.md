## 10) LIGNES DE TRANSMISSION ET ADAPTATIONS

### 10.1) Généralités

La **ligne de transmission** (feeder) transfère l'énergie entre l'émetteur et l'antenne.

**Types de lignes :**
- **Câble coaxial** : ligne asymétrique
- **Ligne bifilaire** : ligne symétrique
- **Microstrip** : pistes sur circuit imprimé

**Caractéristiques :**
- Impédance caractéristique : **Z = √(L/C)**
- Pertes : en dB/m (augmentent avec la fréquence)

**Mode de fonctionnement :**
- **Mode différentiel** : courants conjugués, pas de rayonnement
- **Mode commun** : la ligne rayonne (indésirable)

### 10.2) Impédance et coefficient de vélocité

**Impédance caractéristique : Z(Ω) = √(L(H/m) / C(F/m))**

> **Exemple** : L = 0,5 μH/m, C = 200 pF/m
> Z = √(0,5×10⁻⁶ / 200×10⁻¹²) = **50 Ω**

**Coefficient de vélocité :**

| Diélectrique | ε | Vélocité |
|--------------|---|----------|
| Téflon | 2,1 | ~69% |
| Polyéthylène (PE) | 2,3 | ~66% |
| PE expansé | 1,5 | ~80% |
| Ligne bifilaire | 1,1 | ~95% |
| Microstrip | ~4 | ~50% |

### 10.3) Adaptation et ondes stationnaires

**Désadaptation** = impédances différentes → ondes stationnaires

**Coefficient de réflexion (ρ) :**
- **ρ = UR/UE** ou **ρ = √(PR/PE)**
- **TOS (%) = 100 × ρ**
- **Puissance réfléchie = Pémise × ρ²**

**ROS (Rapport d'Ondes Stationnaires) :**
- **ROS = Zforte / Zfaible = Umax / Umin**

**Formules de conversion :**
- **ROS = (1 + ρ) / (1 - ρ)**
- **ρ = (ROS - 1) / (ROS + 1)**

| ROS | TOS | ρ | Puissance réfléchie |
|-----|-----|---|---------------------|
| 1/1 | 0% | 0 | 0% |
| 1,5/1 | 20% | 0,2 | 4% |
| 2/1 | 33% | 0,33 | 11% |
| 3/1 | 50% | 0,5 | 25% |

### 10.4) Lignes d'adaptation

**Ligne demi-onde (λ/2) :**
- **Ze = Zs** (l'impédance est ramenée telle quelle)

**Ligne quart d'onde (λ/4) :**
- **Zc = √(Ze × Zs)**

> **Exemple** : Adapter Ze = 50 Ω vers Zs = 100 Ω
> Zc = √(50 × 100) = **70,7 Ω**

**Filtres avec lignes :**

| Ligne | Ouverte | Fermée |
|-------|---------|--------|
| λ/4 | Z = 0 (court-circuit) | Z = ∞ (circuit ouvert) |
| λ/2 | Z = ∞ | Z = 0 |

**Symétriseur (Balun) :**
- Adapte ligne asymétrique ↔ antenne symétrique
- Peut transformer l'impédance (rapport 1:1, 1:4, etc.)

---

