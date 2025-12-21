## 8) AMPLIFICATEURS OPÉRATIONNELS ET CIRCUITS LOGIQUES

### 8.1) Caractéristiques des amplificateurs opérationnels

Les **ampli-op** sont des amplificateurs linéaires représentés par un triangle.

**Caractéristiques idéales :**
- **Impédance d'entrée** : infinie (aucun courant dans les entrées)
- **Impédance de sortie** : nulle (très faible en pratique)
- **Gain en tension** : infini

**Deux entrées :**
- Entrée normale (+)
- Entrée inverseuse (-)

### 8.2) Montage inverseur (fondamental)

**Formule du gain : G = -R2 / R1**

Le gain est négatif (inversion de phase).

| Grandeur | Formule |
|----------|---------|
| Gain | G = -R2 / R1 |
| R2 | R2 = -G × R1 |
| R1 | R1 = -R2 / G |
| Tension sortie | Us = Ue × G |

> **Exemple** : R1 = 5 kΩ, R2 = 25 kΩ
> G = -25000/5000 = **-5**

### 8.3) Montage non inverseur

**Gain : G = (R2 / R1) + 1** ou **G = (R2 + R1) / R1**

### 8.4) Circuits logiques

Les portes logiques ne connaissent que deux états : **0** (0 V) et **1** (5 V en logique TTL).

| Porte | Symbole | Sortie = 1 si... |
|-------|---------|------------------|
| **ET (AND)** | & | Toutes les entrées = 1 |
| **OU (OR)** | ≥1 | Au moins une entrée = 1 |
| **NON (NOT)** | ○ | Entrée = 0 |
| **OU EXCLUSIF (XOR)** | =1 | Une seule entrée = 1 |
| **NON ET (NAND)** | &○ | Au moins une entrée = 0 |
| **NON OU (NOR)** | ≥1○ | Toutes les entrées = 0 |

**Trigger de Schmitt :**
- Évite les oscillations lors des transitions 0/1
- Tension montante ≠ tension descendante (hystérésis)

**Bascule R/S :**
- Mémorise la dernière valeur (Set/Reset)

### 8.5) Système binaire et traitement numérique

**Conversions :**

| Décimal | Binaire | Hexadécimal |
|---------|---------|-------------|
| 0 | 0000 | 0 |
| 9 | 1001 | 9 |
| 10 | 1010 | A |
| 15 | 1111 | F |

- **1 octet** = 8 bits
- **1 ko** = 1024 octets (2^10)
- **1 Mo** = 1024 ko

**Convertisseurs :**
- **CAN (ADC)** : Analogique → Numérique
- **CNA (DAC)** : Numérique → Analogique

**Fréquence de Nyquist** = Fréquence d'échantillonnage / 2

**Types de filtres numériques :**
- **FIR** : Réponse Impulsionnelle Finie
- **IIR** : Réponse Impulsionnelle Infinie (avec rétroaction)

**Filtre SAW** : Filtre à ondes de surface (utilise un cristal piézoélectrique)

---

