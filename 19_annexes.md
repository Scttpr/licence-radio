# ANNEXES

## Principales formules à connaître pour l'examen

### Chapitre 0 : Rappel d'algèbre

**Table de conversion des préfixes :**

| G | M | k | unité | m | μ | n | p |
|---|---|---|-------|---|---|---|---|
| 10⁹ | 10⁶ | 10³ | 1 | 10⁻³ | 10⁻⁶ | 10⁻⁹ | 10⁻¹² |

---

### Chapitre 1 : Lois d'Ohm et de Joule

**Loi d'Ohm :** U(V) = R(Ω) × I(A)

**Loi de Joule (Puissance) :**
- P(W) = U(V) × I(A)
- P(W) = U²(V) / R(Ω)
- P(W) = R(Ω) × I²(A)

**Énergie :**
- Q(C) = I(A) × t(s)
- E(J) = P(W) × t(s) = U(V) × Q(C)

**Résistivité :** R(Ω) = ρ(Ω.m) × L(m) / S(m²)

**Code des couleurs :** Ne Mangez Rien Ou Je Vous Battrai VIOlemment Grand BOA
(0-1-2-3-4-5-6-7-8-9 : Noir-Marron-Rouge-Orange-Jaune-Vert-Bleu-Violet-Gris-Blanc)

**Résistances en série :**
- Rt = R1 + R2 + ...
- UR1 = Ut × (R1 / Rt)

**Résistances en parallèle :**
- Rt = (R1 × R2) / (R1 + R2)
- 1/Rt = 1/R1 + 1/R2 + ...
- IR1 = It × (Rt / R1)

---

### Chapitre 2 : Courants alternatifs, bobines et condensateurs

**Courants alternatifs :**
- Période : t(s) = 1 / f(Hz)
- Pulsation : ω(rad/s) = 2π × f(Hz)
- Valeur efficace : Veff = Vmax / √2 = 0,707 × Vmax
- Valeur crête à crête : Vcàc = 2 × Vmax = 2,828 × Veff

**Bobines :**
- Impédance : ZL(Ω) = 2π × f(Hz) × L(H)
- Formule simplifiée : ZL(Ω) = 6,28 × f(MHz) × L(μH)
- Montage série : Lt = L1 + L2 + M

**Condensateurs :**
- Charge : Q(C) = C(F) × U(V)
- Énergie : E(J) = ½ × C(F) × U²(V)
- Impédance : ZC(Ω) = 1 / [2π × f(Hz) × C(F)]
- Formule simplifiée : ZC(Ω) = 159 / [f(MHz) × C(nF)]
- Montage série : 1/Ct = 1/C1 + 1/C2 + ...
- Montage parallèle : Ct = C1 + C2 + ...
- Constante de temps : τ(s) = R(Ω) × C(F)
- Durée de charge/décharge = 5τ

---

### Chapitre 3 : Transformateurs, piles et galvanomètres

**Transformateur (sans perte) :**
- Rapport de transformation : N = ns / np
- Tension : Us = Up × N
- Intensité : Is = Ip / N
- Impédance : Zs = Zp × N²
- Rendement : η = Ps / Pp

**Piles et accumulateurs :**
- Résistance interne : Ri(Ω) = [E(V) - U(V)] / I(A)
- Force électromotrice : E(V) = [R(Ω) + Ri(Ω)] × I(A)
- Capacité : 1 Ah = 3600 C

**Galvanomètres :**
- Voltmètre : R = (UT / Ig) - Ri
- Ampèremètre : R = U / (IT - Ig)
- Qualité : Q(Ω/V) = 1 / Ig

---

### Chapitre 4 : Décibels, circuits RC et LC

**Décibels :**
- G(dB) = 10 × log(Ps / Pe)

| Rapport | 1 | 2 | 4 | 5 | 8 | 10 | 100 |
|---------|---|---|---|---|---|----|----|
| dB | 0 | 3 | 6 | 7 | 9 | 10 | 20 |

**Circuits RC :**
- Fréquence de coupure : f(Hz) = 1 / [2π × R(Ω) × C(F)]
- Formule simplifiée : f(Hz) = 159 / [R(kΩ) × C(μF)]

**Circuits LC (Loi de Thomson) :**
- Fréquence de résonance : f(Hz) = 1 / [2π × √(L(H) × C(F))]
- Formule simplifiée : f(MHz) = 159 / √[L(μH) × C(pF)]
- Impédance à la résonance (série/parallèle) : Z = R
- Impédance circuit bouchon : Z = L / (R × C)
- Facteur Q : Q = √(L/C) / R
- Bande passante : B(Hz) = f0(Hz) / Q

---

### Chapitre 6 : Les transistors

- Gain : **Ic = β × Ib**
- Intensité émetteur : Ie = Ib + Ic

---

### Chapitre 7 : Amplificateurs, oscillateurs et mélangeurs

- Taux de distorsion harmonique : TDH(%) = (Tension parasite / Tension désirée) × 100
- Sortie mélangeur : **Fmax = F1 + F2** et **Fmin = |F1 - F2|**
- Entrée mélangeur : F1 = (Fmax - Fmin) / 2 et F2 = Fmax - F1

---

### Chapitre 8 : Amplificateurs opérationnels

- Gain montage inverseur : **G = -R2 / R1**
- Tension de sortie : Us = Ue × G

---

### Chapitre 9 : Propagation et antennes

- Longueur d'onde : **λ(m) = 300 / f(MHz)**
- Doublet demi-onde : **L(m) = 150 / f(MHz)**
- Quart d'onde : **L(m) = 75 / f(MHz)**
- PAR : **PAR(W) = Pémetteur(W) × Gantenne(rapport)**

---

### Chapitre 10 : Lignes de transmission

- Impédance : **Z(Ω) = √[L(H) / C(F)]**
- ROS : **ROS = Zforte / Zfaible = Vmax / Vmin**
- Coefficient de réflexion : **ρ = (Vmax - Vmin) / (Vmax + Vmin)**
- TOS : **TOS(%) = ρ × 100**
- Puissance réfléchie : **Préfléchie = Pémise × ρ²**
- Ligne λ/4 : **Zc² = Ze × Zs**
- Ligne λ/2 : **Ze = Zs**

---

### Chapitre 11 : Les synoptiques

**Tableau récapitulatif récepteur superhétérodyne :**

| Système | FO/HF | FI = | Repli spectral | Pour ↑ HF | Fim = |
|---------|-------|------|----------------|-----------|-------|
| Infradyne | FO < HF | HF - FO | non | ↑ FO | \|2×FO - HF\| |
| Infradyne | FO < HF | HF + FO | oui | ↓ FO | 2×FO + HF |
| Supradyne | FO > HF | FO - HF | non | ↑ FO | 2×FO - HF |
| Supradyne | FO > HF | FO + HF | oui | ↓ FO | 2×FO + HF |

---

### Chapitre 12 : Les modulations

- Taux de modulation AM : **K(%) = (A - a) / (A + a) = b / B**
- Indice de modulation FM : **m = Excursion(Hz) / BFmax(Hz)**
- Règle de Carson : **B(Hz) = 2 × (m + 1) × BFmax(Hz)**

---

## Bibliographie et ressources

### Réglementation
- Textes français et internationaux : http://f6kgl.f5kff.free.fr/Reglementation.pdf

### Technique
- **Radio REF** : revue du REF-Union
- **QSP** : journal numérique gratuit - http://www.on6ll.be
- Traité d'électronique par F6CRP : http://assoc.orange.fr/f6crp/elec/index.htm
- Manuel des radioamateurs par F5ZV : http://perso.orange.fr/f5zv/RADIO/RM/RM.html

### Entraînement à l'examen
- **Exam'1** (Windows) : https://f6kgl-f5kff.fr/Exam1/
- **Exam'1 Web** : https://exam1.r-e-f.org/
- **Exam'1 Android** : https://play.google.com/store/apps/details?id=dev.favier.exam1radioamateur
- Comptes-rendus d'examen : https://groups.google.com/forum/#!forum/examen-radioamateur
- Synthèse des questions : http://f6kgl.f5kff.free.fr/Regl.pdf et http://f6kgl.f5kff.free.fr/Tech.pdf

---

## Adresses utiles

### Associations

| Nom | Adresse | Téléphone | Site |
|-----|---------|-----------|------|
| REF-Union | 32 rue de Suède, 37074 Tours Cedex 2 | 02 47 41 88 73 | http://www.r-e-f.org |
| URC | 3 rue Saint Lugle, 62190 Lillers | - | http://www.urc.asso.fr |
| Radioamateurs-France | Impasse des Flouns, 83170 Tourves | - | http://www.radioamateurs-france.fr |

### Administration

| Organisme | Adresse | Téléphone | Site |
|-----------|---------|-----------|------|
| ARCEP | 7 square Max Hymans, 75730 Paris Cedex 15 | 01 40 47 71 98 | http://www.arcep.fr |
| ANFR | 4 rue Alphonse Matter, 88108 Saint-Dié-des-Vosges | 03 29 42 20 74 | https://teleservice-amateurs.anfr.fr |

### Centres d'examen ANFR

| Région | Ville | Adresse | Téléphone |
|--------|-------|---------|-----------|
| Paris/Centre | Villejuif (94) | 112 rue Édouard Vaillant | 01 49 58 31 00 |
| Nord | Le Portel (62) | Route du Cap | 03 21 99 71 54 |
| Est | Villers-lès-Nancy (54) | Technopôle de Brabois, 7 allée de Longchamp | 03 83 44 70 24 |
| Rhône-Alpes | St-André-de-Corcy (01) | 522 route de Neuville | 04 72 26 80 03 |
| Sud-Est | Aix-en-Provence (13) | Europarc de Pichaury, 1330 rue G. de la Lauzière | 04 42 12 10 10 |
| Sud-Ouest | Tournefeuille (31) | 4 Bd Marcel Proust, ZI de Pahin | 05 61 15 94 40 |
| Ouest | Donges (44) | 223 La Pommeraie | 02 40 45 36 36 |
| Antilles-Guyane | Baie-Mahault (971) | RN1, Destrellan, Quartier Boisneuf | 05 90 32 21 89 |
| La Réunion | La Possession (974) | 33 rue G. Eiffel, ZAC Ravine à Marquet | 02 62 35 03 94 |
| Nouvelle-Calédonie | Nouméa (988) | Immeuble After C, 3 bis rue A. Barrau | (687) 25 62 60 |
| Polynésie Fr. | Papeete (987) | - | (689) 506 062 |

> Vous pouvez passer l'examen dans n'importe quel centre. L'ANFR peut organiser des sessions hors centres sous conditions (lieu adapté, > 100 km d'un centre, > 10 candidats).

---

**BONNE CHANCE POUR L'EXAMEN ET À BIENTÔT SUR L'AIR !**

*73 de F6GPX, Jean-Luc*

