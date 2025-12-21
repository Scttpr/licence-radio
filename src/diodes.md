# SECTION B : LES COMPOSANTS ACTIFS

## LES DIODES ET LEURS MONTAGES

### Principe de fonctionnement

Les **diodes** sont des composants qui ne laissent passer le courant que dans un sens, indiqué par une flèche sur le schéma.

**Structure :**
- Formées de deux cristaux semi-conducteurs en **Silicium (Si)** ou en **Germanium (Ge)** accolés et dopés N ou P
- Le courant électrique circule dans le sens **P → N**
- Lorsque la diode est passante : anode reliée au **+**, cathode au **-**
- En sens inverse : résistance très importante (plusieurs centaines de kΩ)

**Repérage :**
- La **cathode** est repérée par la lettre K sur le schéma et par une bague de couleur sur le composant
- Le boîtier métallique des diodes de puissance est relié à la cathode

### Courbes et caractéristiques

#### Tensions de seuil

| Type de diode | Tension de seuil |
|--------------|------------------|
| Silicium | **0,6 à 0,7 V** |
| Germanium | **0,3 V** |

#### Comportement

**En sens direct :**
- Dès que la tension dépasse le seuil, l'intensité augmente très vite

**En sens inverse :**
- Résistance interne très élevée
- Plus la tension inverse augmente, plus la barrière de potentiel s'élargit
- La capacité diminue : c'est l'**effet Varicap**
- Au-delà de la **tension de claquage** (ou **tension Zener**), la résistance devient nulle

### Montages des diodes

#### a) Redressement

Les diodes de redressement sont associées à un **condensateur électrochimique** de forte valeur pour lisser la tension.

**Redressement mono-alternance :**
- Une seule diode
- Seule une alternance traverse la diode

**Redressement double alternance :**
- **Pont de diodes** (pont de Graëtz) : 4 diodes, transformateur classique
- **Transformateur à point milieu** : 2 diodes seulement

> Le pont de diodes provoque une chute de tension double (le courant traverse 2 diodes)

#### b) Diode Varicap

- Symbole : double trait sur la cathode (représentant le condensateur)
- Montée en **sens inverse** (non passant)
- Remplace un condensateur variable
- Capacité commandée par la tension inverse
- Plus la tension est élevée → capacité plus faible

#### c) Diode Zener

- Symbole reconnaissable à sa forme en **Z**
- Montée en **sens inverse**
- Utilisée comme **stabilisateur de tension**
- Devient passante quand la tension dépasse sa tension d'avalanche

#### d) LED (Diodes Électroluminescentes)

| Couleur | Tension de seuil | Semi-conducteur |
|---------|-----------------|-----------------|
| Infrarouge | 1,5 V | AlGaAs |
| Rouge | 2 V | AlGaAs |
| Vert | 3 V | GaN |
| Bleu | 3,3 V | SiC |

- Une résistance limite l'intensité à environ **20 mA**

#### e) Autres diodes

- **Diode PIN** : couche isolante entre P et N, utilisée comme commutateur HF
- **Diode Schottky** : commutation rapide, faible tension de seuil (0,25 V), utilisée dans les mélangeurs en anneau
- **Diode Gunn** : oscillateurs hyperfréquence (> 10 GHz)

### 5.4) Alimentation

Dans une alimentation avec pont de diodes :
- Chute de tension d'environ **1,4 V** (2 × 0,7 V)
- Le condensateur de filtrage maintient la tension à sa valeur de crête

**Étages de sortie :**
- **Stabilisateur** : monté en parallèle (ex: diode Zener)
- **Régulateur** : monté en série avec la charge

---

