# Notes accessibilite

Audit manuel realise sur les pages statiques du site du Dr Marc Divaris.

## Corrections globales

- Contraste faible des textes secondaires -> `--ink-55` passe de 55 % a 65 % d'opacite dans `assets/style.css`.
- Focus clavier -> confirmation du `:focus-visible` global existant, applique aux liens, boutons, cartes, chips, boutons PDF et nav.
- Titres de page -> les grands titres visuels `.mirror-line` sont maintenant de vrais `h1`.
- Titres de section invisibles utiles -> ajout de `.sr-only` pour corriger les listes qui passaient directement de `h1` a `h3`.
- Boutons non soumis -> ajout de `type="button"` sur les boutons de nav mobile et emplacements video.
- Lecteurs PDF -> ajout de `aria-modal="true"`, fermeture au clic sur fond, fermeture via Echap natif du dialog, retour du focus au bouton qui a ouvert le PDF.
- Navigation partagee -> ajout de `Publications` dans le menu et le footer, correction de `aria-current` sur le CTA consultation, fermeture du menu mobile et du dropdown avec Echap.
- Liens externes -> verification des `target="_blank"`, tous les liens controles ont `rel="noopener"`.
- Images -> verification des `alt`, aucune image sans `alt` dans les pages modifiees.
- Tirets longs -> aucun tiret long conserve dans les fichiers modifies.

## index.html

- Absence de vrai `h1` sur le titre principal -> conversion du titre visuel en `h1`.
- Bouton menu mobile sans type explicite -> ajout de `type="button"`.
- Guide conversationnel -> `aria-live="polite"` deja present, conserve.
- Champ de recherche -> `aria-label` deja present, conserve.

## methode.html

- Absence de vrai `h1` sur le titre principal -> conversion du titre visuel en `h1`.
- Lecteur PDF -> ajout de `aria-modal="true"` et retour focus gere dans `main.js`.
- Boutons PDF -> types explicites deja presents, verification du focus visible.
- Bouton menu mobile sans type explicite -> ajout de `type="button"`.

## interventions.html

- Titre principal deja structure apres correction globale -> `h1` present.
- Cartes d'intervention -> liens clavier natifs conserves, focus visible confirme.
- Bouton menu mobile sans type explicite -> ajout de `type="button"`.

## visage.html

- Saut de hierarchie `h1` vers `h3` dans la liste d'interventions -> ajout d'un `h2` accessible masque : "Interventions du visage".
- Bouton video sans type explicite -> ajout de `type="button"`.
- Titres d'interventions cliquables -> liens natifs conserves, focus visible confirme.

## silhouette.html

- Saut de hierarchie `h1` vers `h3` dans la liste d'interventions -> ajout d'un `h2` accessible masque : "Interventions de la silhouette".
- Bouton video sans type explicite -> ajout de `type="button"`.
- Titres d'interventions cliquables -> liens natifs conserves, focus visible confirme.

## cheveux.html

- Saut de hierarchie `h1` vers `h3` dans la liste d'interventions -> ajout d'un `h2` accessible masque : "Interventions capillaires".
- Bouton video sans type explicite -> ajout de `type="button"`.
- Titres d'interventions cliquables -> liens natifs conserves, focus visible confirme.

## intervention.html

- Titre dynamique de l'intervention -> `h1` present avec `id="care-title"`.
- Section secondaire -> ordre `h1`, `h2` confirme.
- Bouton menu mobile sans type explicite -> ajout de `type="button"`.

## consultation.html

- Titre principal -> `h1` present.
- Bouton video sans type explicite -> ajout de `type="button"`.
- Champs de formulaire -> aucun formulaire de saisie present sur cette page, uniquement des liens de contact.

## parcours.html

- Section publications trop dense dans le parcours -> section `#fel` extraite vers `publications.html`.
- Renvoi court ajoute -> bloc "Documents, presse et ouvrages" avec lien vers la nouvelle page.
- Lecteur PDF retire de cette page -> plus de modal inutile sur le parcours.
- Titre principal -> `h1` present.

## publications.html

- Nouvelle page creee depuis la section `#fel` de `parcours.html` -> conservation des groupes "Recherche et distinctions", "Presse", "Ouvrages".
- Boutons `data-pdf` et liens externes -> contenu conserve, focus visible confirme.
- Lecteur PDF -> `dialog` avec `aria-labelledby`, `aria-modal`, bouton de fermeture accessible et retour focus.
- Liens externes -> `rel="noopener"` present.

## blog.html

- Page blog existante non modifiee par consigne projet.
- Verification manuelle limitee -> pas d'image sans `alt`, pas de lien externe sans `noopener`.
- Point note -> le contenu semble construit dynamiquement par les scripts de blog.

## article.html

- Page article existante non modifiee par consigne projet.
- Verification manuelle limitee -> image de couverture avec `alt`, pas de lien externe sans `noopener`.
- Point note -> le titre principal semble injecte dynamiquement par le script article.

## admin.html

- Page admin existante non modifiee par consigne projet.
- Labels de formulaire -> champs contenus dans des `label`, verification OK.
- Verification manuelle limitee -> pas d'image sans `alt`, pas de lien externe sans `noopener`.

