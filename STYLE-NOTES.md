# Notes de la passe de style — assets/style.css

## Mise à jour — Direction « galerie » (remplace la direction précédente)

Refonte complète des tokens et des interactions, validée sur maquette comparative (3 directions proposées, « galerie pure » retenue). Aucun changement de HTML ni de sélecteur : mêmes classes, nouvelles valeurs.

**Palette** : blanc d'accrochage `#FBFAF7` (fond), blanc pur (surfaces), pierre `#F4F2EC` (fonds secondaires), encre `#16130F`, un seul accent bronze `#7A5C33` (cartels, eyebrows, liens, survols de CTA). Les anciens sauge/terracotta sont supprimés ; `--accent-warm` est désormais un alias de l'encre (toutes les interactions fortes sont noires).

**Typographie** : Fraunces passe en graisse 300 sur les h1/h2 (l'axe optique de la variable fait le reste), hero agrandi (`clamp` max 4.5rem). Corps Inter et mono JetBrains inchangés.

**Interactions** : suppression de tous les effets de mouvement décoratifs — plus de pilules (`border-radius` à 0 partout), plus de `translateY` au survol, plus de zooms d'image, plus d'ombres portées au survol, plus d'effet « fantôme » sur les titres (remplacé par un unique fondu d'entrée de 0,7 s). Le seul langage de survol : changement de couleur (encre → bronze pour les CTA pleins, inversion fond/texte pour les outlines) et glissement de flèche de 4 px sur les liens de détail.

**Photos** : couleurs conservées (un passage N&B a été tenté puis retiré à la demande). Les fonds dégradés terracotta derrière les portraits sont remplacés par des aplats pierre.

**Divers** : vignette vidéo passée de l'aplat sauge rayé à une surface pierre bordée d'un filet ; carte consultation en encre ; lecteur PDF et boutons de fermeture équerrés ; bandeau « provisoire » teinté bronze.

---

## Ancienne direction (obsolète) — collage/photo, boutons animés, photos placeholder

**Important — sourcing des photos.** Les recherches automatiques sur Unsplash pour des requêtes génériques ("skin texture", "back natural light") ont renvoyé du contenu clairement inapproprié (nudité) pour un site de cabinet médical. J'ai donc changé de méthode : requêtes ancrées cliniquement ("doctor patient office", "eye exam clinical", "scalp examination"), et **chaque photo a été téléchargée et vérifiée visuellement par mes soins avant utilisation** — aucune n'a été choisie sur la seule foi du texte alternatif. Résultat : 6 photos distinctes, toutes vérifiées (contexte clinique crédible, pas de nudité, pas de glamour publicitaire). Toutes viennent d'Unsplash (images.unsplash.com, hotlink direct — usage gratuit, pas de clé API requise), et sont marquées `<!-- placeholder photo, à remplacer -->` dans le code comme demandé.

**Limite assumée à connaître** : je n'ai sourcé que 6 photos, pas une par intervention individuelle (il y a 35 cartes sur `interventions.html`). Chaque photo est réutilisée sur toutes les cartes d'un même pôle (ex. la même photo d'examen oculaire sur les 10 cartes du pôle Visage). C'est visuellement répétitif si on scrolle toute la page — c'était le compromis nécessaire pour rester dans un temps raisonnable sans sacrifier la vérification visuelle de chaque photo. À vrai remplacement, prévoir une photo par intervention ou au moins 3-4 par pôle.

**Photos utilisées (à remplacer par de vraies photos du cabinet) :**

| Usage | URL | Contenu vérifié |
|---|---|---|
| Hero accueil + cartes pôles Regard/Injections + collage (grande) methode/parcours | `https://images.unsplash.com/photo-1758691461935-202e2ef6b69f` | Médecin senior en consultation, bureau clinique, lunettes/stéthoscope |
| Cartes pôle Chirurgie intime (volontairement générique, pas de photo corporelle) + collage (grande) alternative | `https://images.unsplash.com/photo-1758691462858-f1286e5daf40` | Médecin + patient âgé consultant un dossier |
| Cartes pôle Visage/Regard + collage (petite, carrée) methode/parcours + bannière page Visage | `https://images.unsplash.com/photo-1770221797827-839d22db4a1b` | Photo d'archive N&B, examen de l'œil en gros plan, candide |
| Cartes pôle Silhouette + bannière page Silhouette | `https://images.unsplash.com/photo-1758691462123-8a17ae95d203` | Prise de tension artérielle, cabinet médical |
| Cartes pôle Cheveux + bannière page Cheveux | `https://images.unsplash.com/photo-1761819921384-819b969a6dfc` | Gros plan mains sur cuir chevelu, examen capillaire — image assez frontale/clinique, à reconsidérer si jugée trop crue pour une première impression |

### Changements par page

- **`index.html`** — Hero refait en deux colonnes : texte (accroche + titre) à gauche, photo à droite avec deux blocs de couleur décalés en arrière-plan (`var(--charcoal)` + `var(--accent-light)`). **Le formulaire du guide conversationnel n'a pas été touché** (reste pleine largeur, sous le hero, logique JS intacte) — seuls ses boutons (`M'orienter`, chips) héritent du nouveau style pilule global. Empile en une colonne sous 900px, photo au-dessus du texte.
- **`methode.html` / `parcours.html`** — Nouvelle section collage juste après le titre de page : grande photo rectangulaire + petite photo carrée en chevauchement (bordure 6px `var(--paper)`, ombre douce), texte à côté (principe de la méthode / résumé du parcours).
- **`interventions.html`** — Les 35 cartes ont maintenant une photo en tête (pleine largeur de la carte, ratio 4/3, zoom `scale(1.06)` au survol, transition 0.4s). Une photo par pôle, réutilisée sur toutes les cartes de ce pôle (voir limite assumée ci-dessus).
- **`visage.html` / `silhouette.html` / `cheveux.html`** — **Écart au brief, assumé et documenté** : ces 3 pages ne sont pas construites en grille de cartes mais en liste longue (titre + paragraphe + lien "En savoir plus" par intervention). Restructurer chaque entrée en carte-photo aurait changé leur structure HTML de fond, hors du périmètre demandé. À la place, j'ai ajouté une seule bannière photo large (ratio 21:9, pleine largeur) juste sous le titre de page, représentative du pôle.
- **Tous les boutons (`.btn`, donc CTA principal, `.btn-outline`, `.btn-light`, nav, footer)** : forme pilule (`border-radius:999px`), lift au survol (`translateY(-2px)`). Bouton plein : passe en `var(--accent)` au survol (remplace l'ancien changement d'opacité). Bouton outline : s'inverse en `var(--charcoal)`/`var(--paper)` au survol (déjà le cas avant, `--ink`/`--charcoal` et `--bg`/`--paper` étant des alias de mêmes valeurs). `.ref-link` garde son style texte discret mais gagne un léger déplacement horizontal au survol.
- **`blog.html` / `article.html` / `admin.html`** — Aucun changement structurel. Héritent des boutons pilule via `style.css` partagé. Logique Supabase intacte.

---

Méthodologie appliquée avant le détail page par page (pour comprendre les écarts listés ensuite) :

- **Espacement** : chaque `margin`/`padding`/`gap` en dur a été remplacé par la variable `--space-*` la plus proche (0.5 / 1 / 2 / 4 / 6 / 8 rem). Pour les valeurs en `clamp()`, j'ai utilisé le maximum du clamp comme valeur de référence. Cas d'égalité exacte entre deux tokens (ex. 7rem entre `--space-xl` et `--space-2xl`) : arrondi au supérieur.
- **Typographie** : chaque `font-size` classé selon des seuils fixes : `< 0.89rem` → `--text-meta`, `0.89–1.29rem` → `--text-body`, `1.3–2.19rem` → `--text-h2`, `≥ 2.2rem` → `--text-hero`. Un cas limite a été intercepté et corrigé à la main (voir plus bas).
- **Couleurs** : tout hex en dur remplacé par le token existant le plus proche. Aucune couleur créée. Deux cas n'avaient pas de correspondance exacte (`#ececea`, `#dededb`, `#a34`) — mappés au token neutre/accent le plus proche, documentés ci-dessous.
- **Exception technique documentée** : `gap:1px` sur `.card-grid`, `.pole-list`, `.g-cards`, `.axes` n'a **pas** été tokenisé. Ce n'est pas un espacement au sens design (ce serait `--space-xs` = 8px au plus proche), c'est une technique de liseré d'1px entre cellules de grille (le fond `--line` traverse ce gap d'1px pour dessiner une bordure fine). Le tokeniser aurait cassé visuellement ces 4 grilles.

---

## Page par page

**index.html** — Conforme. Section `.meet` et `.guide` avaient un padding-block personnalisé qui contournait la règle générique de section ; retiré, elles héritent maintenant de `--space-xl`/`--space-lg` comme les autres.

**methode.html** — Conforme pour tout ce qui est dans le périmètre de cette passe. **Écart pré-existant repéré, non corrigé** : `.research-proof` (et `.proof-intro`, `.proof-portrait`, `.proof-copy h2`, `.publication-grid`...) est défini deux fois dans la feuille de style avec des valeurs contradictoires — une version "grande" pensée pour cette page, et une version "compacte" plus bas dans le fichier pensée pour `parcours.html`/`publications.html`. Les deux blocs utilisent exactement les mêmes sélecteurs : en CSS, c'est le second qui gagne, sur **toutes** les pages qui utilisent `.research-proof`, y compris celle-ci. Résultat : la section recherche de `methode.html` s'affiche probablement plus petite que prévu à l'origine. Ce n'est pas quelque chose que j'ai introduit et je ne l'ai pas corrigé — le réparer proprement demande de distinguer les deux contextes (renommer une classe, ou scoper par page), ce qui touche la structure HTML et sort du périmètre "style uniquement" de cette tâche. À traiter séparément si vous voulez.

**interventions.html** — Conforme.

**intervention.html** — Conforme.

**visage.html** — Conforme. Le `fill="#AEBBC4"` du SVG de la vignette vidéo a été remplacé par `style="fill:var(--accent-light)"` (un attribut `fill` seul ne peut pas lire une variable CSS).

**silhouette.html** — Conforme (même correction SVG que visage.html).

**cheveux.html** — Conforme (même correction SVG).

**consultation.html** — Conforme (même correction SVG).

**parcours.html** — Conforme. Hérite du même écart `.research-proof` que methode.html (voir plus haut), mais dans son cas la version "compacte" qui gagne est celle qui lui était destinée à l'origine — donc pas de changement visuel pour cette page.

**publications.html** — Conforme. Page déjà construite selon la structure standard (footer partagé, police complète) au moment de cette passe.

**blog.html** — Conforme.

**article.html** — Conforme.

**admin.html** — **Traité en version simplifiée, comme demandé.** J'ai uniquement corrigé la couleur d'erreur codée en dur (`#a34` → `var(--accent)`, seule couleur existante approchante — il n'y a pas de token "erreur/danger" dans le système, donc ce rouge-brique perd sa fonction de signal distinct ; à garder en tête si les messages d'erreur doivent rester visuellement distincts). Le `<style>` interne de cette page garde ses `padding`/`margin`/`font-size` en dur (non tokenisés) : c'est un choix délibéré pour rester dans le périmètre "lisible et fonctionnel" demandé, pas une omission. Elle hérite quand même de `style.css` donc des états interactifs (ÉTAPE 4) et des transitions (ÉTAPE 5) globaux.

---

## Écarts et décisions transversales (concernent plusieurs pages)

1. **`h2` générique classé par erreur en `--text-hero` puis corrigé.** Le `h2{}` de base (utilisé comme titre de section standard partout) avait un `clamp()` dont le maximum tombait exactement sur mon seuil de classification (2.2rem), ce qui l'aurait fait basculer en taille "hero" sur tout le site. Repéré en relisant le fichier généré, corrigé en `--text-h2`.

2. **Espace titre → texte suivant** (règle : jamais moins de `--space-sm`, jamais plus de `--space-md`) : plusieurs titres avaient un espacement de `--space-xs` ou `0` avec le texte qui suit (`h3` générique, `.card h3`, `.pole h3`, `.tl-title`, `h4`, `.method-steps h3`+`p`). Tous remontés à `--space-sm` minimum.

3. **`.site-nav` écrasait le padding latéral de `.wrap` sur mobile — bug pré-existant, corrigé.** `.site-nav{padding:var(--space-sm) 0}` mettait la marge gauche/droite à 0, collant le logo au bord de l'écran sous 640px. Ce n'était pas causé par la tokenisation (le `0` était déjà là dans le fichier d'origine) mais je l'ai trouvé et corrigé pendant la vérification responsive de l'ÉTAPE 6 (`padding` → `padding-block`, ne touche plus l'axe horizontal).

4. **États interactifs (ÉTAPE 4)** : le brief cite des classes `.nav-link` et `.btn-cta` qui n'existent pas dans ce codebase. Équivalence utilisée : `.nav-link` → `.nav-links a, .nav-links .top` ; `.btn-cta` → `.btn`. `.ref-link:hover` utilisait `var(--ink)` au lieu de `var(--accent)` — corrigé (c'était le seul lien texte hors-règle trouvé). `#guide-input` avait un `outline:none` sans remplacement — un `:focus-visible` dédié a été ajouté (`outline-offset` négatif pour ne pas dédoubler le cadre de `.guide-box`).

5. **`.btn:hover{opacity:.85}` s'ajoute à l'inversion fond/texte déjà existante sur les boutons** (`.btn:hover` faisait déjà `background:transparent;color:var(--ink)`). Les deux effets se cumulent maintenant. Comportement demandé tel quel par le brief — à vérifier visuellement, ça peut rendre le survol un peu plus doux/atténué que prévu sur un bouton déjà en train de changer de couleur.

6. **Animation d'entrée du titre miroir (`.mirror-line`) ralentie de 1.7s à 0.8s.** C'est l'effet "fantôme qui se referme" sur le grand titre de chaque page. Le brief impose 300–800ms pour toute transition/animation sans exception ; l'ancienne durée (1.7s, `cubic-bezier(.2,.8,.2,1)` sur mesure) dépassait largement cette fourchette. J'ai plafonné à 800ms avec `var(--ease)`. C'est le changement le plus visible de toute la passe — à voir en vrai avant de valider : si c'est trop rapide, c'est une seule valeur à ajuster (`.8s` dans les deux `animation:` de `.mirror-line`).

7. **Points de rupture consolidés partiellement.** 9 valeurs différentes étaient utilisées (520/560/600/640/760/800/820/860/1080). J'ai fusionné 520/560/600 dans 640 (aucune perte visuelle, ces trois-là faisaient la même chose à quelques pixels près). Je n'ai **pas** forcé 760/800/820/860 dans le système à 2 paliers strict (640/1024) : ce sont des points de bascule "3 colonnes → 2 colonnes" sur des grilles (`.pole-list`, `.proof-intro`, `.care-layout`, `.two-col`, `.consult`) — les fondre dans 640 ou 1024 aurait fait sauter directement de 3 colonnes à 1, ou étiré une mise en page pensée pour un écran plus étroit. Le seuil `1080px` du menu (bascule vers le hamburger) n'a pas non plus été touché : il correspond à la largeur réelle où le menu déborde, pas à un choix arbitraire. Testé sans débordement ni menu cassé à 375px, 768px et desktop.

8. **Couleurs sans correspondance exacte, mappées au plus proche existant** (aucune couleur créée, comme demandé) :
   - `#ececea` (fond de vignette PDF) et `#dededb` (fond du lecteur PDF avant chargement) → `var(--bg)`.
   - `#a34` (texte d'erreur, `admin.html`) → `var(--accent)` (voir note admin.html plus haut : perte de la distinction visuelle "erreur").
