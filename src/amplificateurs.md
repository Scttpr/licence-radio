## AMPLIFICATEURS, OSCILLATEURS, MÉLANGEURS

### Classes d'amplification

| Classe | Caractéristiques | Usage |
|--------|-----------------|-------|
| **A** | Signal centré sur la plage d'amplification | Le plus courant |
| **B** | Deux transistors, chacun amplifie une alternance | Nécessite transistors appairés |
| **C** | Seule une partie du signal est amplifiée | **Interdit en AM/BLU** |
| **AB** | Comme A mais signal non centré | Étages de puissance |
| **D** | Impulsions à largeur variable | HF forte puissance, audio |

> La classe C est à **prohiber** pour les signaux modulés en amplitude (AM, BLU)

### Résistance de charge

La **résistance de charge (Rc)** permet de récupérer les variations de tension en sortie du transistor.

**Droite de charge :**
- Passe par la tension d'alimentation U(+)
- Intensité maximale = U(+) / Rc
- Le signal d'entrée doit rester dans la zone linéaire (avant saturation)

**Points importants :**
- Le montage émetteur commun génère un **déphasage de 180°**
- Au-delà du **point de compression**, l'amplificateur n'est plus linéaire

### Liaisons entre les étages

| Type de liaison | Utilisation |
|-----------------|-------------|
| Directe | Peu utilisée (problèmes de niveaux) |
| Diodes en série | Courant continu |
| Condensateur | Courant alternatif |
| Transformateur | Adaptation d'impédances |

**Séparateur (tampon)** : étage d'adaptation des niveaux et impédances

### Amplificateurs RF

Composants d'un amplificateur RF :
- **Condensateur de découplage** : empêche la HF de remonter dans l'alimentation
- **Bobine de choc** : arrête les courants HF
- **Résistance de contre-réaction** : empêche les auto-oscillations
- **Résistance d'émetteur (Re)** : protège de l'emballement thermique

**Types de distorsions :**

| Distorsion | Description | Fréquences parasites |
|------------|-------------|---------------------|
| **Fréquences** | Amplification non uniforme selon la fréquence | - |
| **Harmonique** | Génère des harmoniques 2F, 3F... | 2f, 3f... |
| **Quadratique** | Intermodulation du 2nd ordre | f1±f2, 2f1, 2f2 |
| **Cubique** | Intermodulation du 3ème ordre | 2f1±f2, 2f2±f1, 3f1, 3f2 |

### 7.5) Oscillateurs

**Types d'oscillateurs :**
- **VXO** : à quartz (fréquence fixe)
- **VFO** : condensateur variable (mécanique)
- **VCO** : diode Varicap (commandé en tension)
- **PLL** : boucle à verrouillage de phase
- **DDS** : synthèse numérique directe

**Le quartz :**
- Effet piézo-électrique
- Vitesse de propagation : ~5700 m/s
- **f (MHz) = 5,7 / (2 × e)** où e = épaisseur en mm
- Limite pratique : 30 MHz (épaisseur minimale)

**PLL (Phase Lock Loop) :**
- VCO → Diviseur → Comparateur de phase → Filtre passe-bas → VCO
- Comparaison avec un signal de référence (VXO)

**DDS (Direct Digital Synthesis) :**
- Génération par échantillonnage numérique
- **Théorème de Shannon-Nyquist** : fréquence max = fréquence d'échantillonnage / 2

### 7.6) Multiplicateurs de fréquence

- Amplificateur RF en **classe C** avec filtre accordé sur un harmonique
- Multiplication par 2, 3 ou 5 maximum
- Pour ×9 : utiliser deux multiplicateurs (×3 puis ×3)

> **Important** : Un signal AM ou BLU passant par un multiplicateur devient inexploitable.
> Un signal FM voit son excursion multipliée (ex: 3 kHz × 2 = 6 kHz)

### 7.7) Mélangeurs

**Principe :**
- Entrées : F1 et F2
- Sorties : **F1 + F2** et **F1 - F2**
- Un filtre sélectionne la fréquence désirée

**Formules :**
- fmax = f1 + f2
- fmin = |f1 - f2|
- f1 = (fmax - fmin) / 2
- f2 = fmax - f1

> **Exemple** : Entrées 5 MHz et 8 MHz → Sorties 13 MHz et 3 MHz

---

