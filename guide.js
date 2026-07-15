/* =========================================================
   Guide conversationnel Dr Marc Divaris
   Le visiteur décrit sa préoccupation avec ses mots ;
   on l'oriente vers la ou les interventions pertinentes.

   Moteur v2 :
   - vocabulaire élargi (synonymes, formulations familières)
   - normalisation accents + stemming (pluriels)
   - tolérance aux fautes de frappe (distance d'édition)
   - hook optionnel vers un vrai modèle (API) : window.GUIDE_API_URL

   ⚠ Orientation indicative ne remplace pas une consultation.
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('guide-form');
  if (!form) return;
  var input = document.getElementById('guide-input');
  var thread = document.getElementById('guide-thread');
  var chipsBox = document.getElementById('guide-chips');

  /* =========================================================
     Base de connaissances : chaque service + toutes les façons
     dont un patient peut le formuler (zones, gênes, argot, termes
     médicaux, verbes d'intention).
     ========================================================= */
  var KB = [
    /* ---------- VISAGE ---------- */
    { id: 'rhinoplastie', name: 'Rhinoplastie', pole: 'Visage', href: 'visage.html#rhino',
      blurb: 'Remodelage du nez, en recherche d’harmonie avec l’ensemble du visage.',
      keys: ['nez', 'narine', 'narines', 'rhinoplastie', 'bosse sur le nez', 'bosse au nez', 'nez busque',
        'nez crochu', 'nez de travers', 'nez tordu', 'nez casse', 'nez trop grand', 'nez trop gros',
        'nez trop long', 'nez trop large', 'gros nez', 'pointe du nez', 'arete du nez', 'cloison nasale',
        'refaire mon nez', 'refaire le nez', 'profil du nez', 'complexe du nez', 'naze', 'nait'] },

    { id: 'mirror-lift', name: 'Mirror Face Lift / lifting cervico-facial', pole: 'Visage', href: 'methode.html',
      blurb: 'Le lifting signature : rééquilibre les volumes du visage selon votre asymétrie propre.',
      keys: ['lifting', 'lift', 'visage qui tombe', 'visage qui vieillit', 'visage relache', 'relachement',
        'relachement du visage', 'affaissement', 'visage affaisse', 'joues qui tombent', 'bajoues',
        'ovale', 'ovale du visage', 'ovale relache', 'perte de l ovale', 'contour du visage',
        'machoire', 'ligne de la machoire', 'angle de la machoire', 'jawline', 'machoire asymetrique',
        'asymetrie', 'visage asymetrique', 'asymetrie du visage', 'cote different', 'tete asymetrique', 'figure asymetrique',
        'air fatigue', 'mine fatiguee', 'traits tires', 'visage marque', 'paraitre fatigue',
        'vieillissement', 'vieillir', 'rajeunir', 'rajeunissement', 'coup de vieux',
        'sillons nasogeniens', 'plis d amertume', 'rides profondes', 'peau qui pend visage', 'tete', 'ma tete', 'tête', 'face', 'figure', 'ma figure', 'mon visage', 'visage', 'gueule', 'tronche', 'je fais vieux', 'je fais vieille', 'air vieux', 'air vieille', 'air triste', 'air tire', 'bas du visage', 'joue qui tombe', 'joues basses', 'joue basse', 'visage fatigue', 'visage mou', 'trait du visage'] },

    { id: 'lift-cou', name: 'Lifting du cou', pole: 'Visage', href: 'visage.html#cou',
      blurb: 'Redéfinition de l’angle entre le cou et le menton.',
      keys: ['cou', 'cou qui pend', 'cou relache', 'peau du cou', 'plis du cou', 'cou de dindon',
        'fanons', 'double menton', 'sous le menton', 'angle du cou', 'cou fripé', 'cou fripe',
        'machoire', 'ovale empate', 'gorge qui pend', 'peau fripee du cou', 'cou plisse', 'cou frippe', 'cou vieilli', 'menton double', 'gras sous le menton'] },

    { id: 'lift-temporal', name: 'Lifting temporal & frontal', pole: 'Visage', href: 'visage.html#temporal',
      blurb: 'Rajeunissement du haut du visage : front et position des sourcils.',
      keys: ['front', 'front qui tombe', 'sourcil', 'sourcils', 'sourcils qui tombent', 'sourcils bas',
        'sourcils tombants', 'regard lourd', 'haut du visage', 'tempes', 'front ride'] },

    { id: 'lift-pommettes', name: 'Lifting des pommettes', pole: 'Visage', href: 'visage.html#pommettes',
      blurb: 'Restauration des volumes du milieu du visage.',
      keys: ['pommettes', 'pommette', 'joues creuses', 'visage creux', 'visage creuse', 'perte de volume',
        'volume du visage', 'milieu du visage', 'visage emacie'] },

    { id: 'minilift', name: 'Mini-lift / Soft lift', pole: 'Visage', href: 'visage.html#minilift',
      blurb: 'Option moins invasive pour un relâchement débutant.',
      keys: ['mini lift', 'minilift', 'soft lift', 'petit lifting', 'relachement leger', 'leger relachement',
        'debut de relachement', 'peu invasif', 'sans grosse chirurgie', 'recuperation rapide', 'suites legeres'] },

    { id: 'menton', name: 'Remodeler le menton', pole: 'Visage', href: 'visage.html#menton',
      blurb: 'Ajustement des proportions du bas du visage et du profil.',
      keys: ['menton', 'menton fuyant', 'menton en retrait', 'menton en arriere', 'menton trop petit',
        'menton trop grand', 'menton en galoche', 'genioplastie', 'profil fuyant', 'machoire',
        'machoire de travers', 'bas du visage', 'menton asymetrique'] },

    { id: 'bichectomie', name: 'Bichectomie', pole: 'Visage', href: 'visage.html#bichectomie',
      blurb: 'Affinement des joues.',
      keys: ['bichectomie', 'joues rondes', 'grosses joues', 'joues trop pleines', 'joues pleines',
        'visage rond', 'visage poupin', 'visage poupon', 'affiner les joues', 'affiner le visage',
        'boules de bichat'] },

    { id: 'lipo-visage', name: 'Liposuccion du visage', pole: 'Visage', href: 'visage.html#lipo',
      blurb: 'Redéfinition de l’ovale et de la zone sous le menton.',
      keys: ['graisse du visage', 'visage empate', 'double menton', 'menton gras', 'ovale empate',
        'cou empate', 'joues grasses'] },

    { id: 'peeling', name: 'Peeling', pole: 'Visage', href: 'visage.html#peeling',
      blurb: 'Renouvellement de la qualité de peau, sans chirurgie.',
      keys: ['peeling', 'peau terne', 'teint terne', 'teint brouille', 'taches', 'taches brunes',
        'taches de soleil', 'texture de peau', 'grain de peau', 'peau abimee', 'cicatrices d acne',
        'acne', 'ridules', 'pores', 'pores dilates', 'eclat', 'peau fatiguee', 'peau froissee', 'peau frippee', 'peau fripee', 'teint gris', 'teint triste', 'visage terne', 'petites taches', 'taches visage', 'melasma', 'masque de grossesse'] },

    /* ---------- REGARD ---------- */
    { id: 'blepharoplastie', name: 'Blépharoplastie', pole: 'Regard', href: 'interventions.html#regard',
      blurb: 'Traitement des paupières supérieures et inférieures.',
      keys: ['paupiere', 'paupieres', 'blepharoplastie', 'paupieres tombantes', 'paupieres lourdes',
        'paupieres qui tombent', 'exces de peau paupieres', 'poches', 'poches sous les yeux',
        'yeux', 'yeux fatigues', 'yeux qui tombent', 'yeux gonfles', 'regard fatigue', 'regard triste',
        'regard eteint', 'ouvrir le regard', 'refaire mes yeux', 'refaire les yeux', 'oeil', 'oeils', 'oeille', 'oeilles', 'oeulle', 'oeulles', 'oeuillle', 'yeu', 'yeuxx', 'yeux fatigue', 'paupiere qui tombe', 'paupiere lourde', 'poche yeux', 'poche oeil', 'oeil fatigue', 'paupiere lourde', 'paupiere tombee', 'paupiere basse', 'excedent paupiere', 'peau sur les yeux', 'regard lourd', 'regard ferme', 'petits yeux fatigues'] },

    { id: 'filling', name: 'Filling du regard', pole: 'Regard', href: 'interventions.html#regard',
      blurb: 'Comblement du creux du regard et des cernes creux.',
      keys: ['cerne', 'cernes', 'cernes creux', 'cernes marques', 'yeux cernes', 'creux sous les yeux',
        'vallee des larmes', 'regard creuse', 'regard creux', 'oeil creux', 'oeil cerne', 'yeu cerne', 'oeulle cerne', 'sous les oeils', 'sous les yeux', 'creux des cernes', 'cernes bleus', 'cernes noirs', 'cernes fatigues', 'air fatigue yeux', 'poches et cernes'] },

    /* ---------- SILHOUETTE ---------- */
    { id: 'lipo-ventre', name: 'Liposuccion du ventre', pole: 'Silhouette', href: 'silhouette.html#ventre',
      blurb: 'Traitement de la sangle abdominale et de la taille.',
      keys: ['ventre', 'petit ventre', 'ventre rond', 'bidon', 'abdomen', 'bourrelet', 'bourrelets',
        'poignees d amour', 'graisse du ventre', 'gras du ventre', 'taille', 'taille epaisse',
        'sangle abdominale'] },

    { id: 'culotte', name: 'Culotte de cheval', pole: 'Silhouette', href: 'silhouette.html#culotte',
      blurb: 'Liposuccion des hanches et des faces externes des cuisses.',
      keys: ['culotte de cheval', 'hanche', 'hanches', 'cuisse', 'cuisses', 'graisse des cuisses',
        'faces externes', 'fesses larges', 'affiner mes hanches', 'affiner les hanches'] },

    { id: 'lipo-bras', name: 'Liposuccion des bras', pole: 'Silhouette', href: 'silhouette.html#bras',
      blurb: 'Traitement de la face interne du bras.',
      keys: ['bras', 'bras qui pendent', 'bras relaches', 'graisse des bras', 'gras des bras',
        'ailes de chauve souris', 'dessous de bras', 'liposuccion des bras', 'lipossution des bras', 'liposution des bras', 'lipo des bras', 'graisse bras', 'bras gras'] },

    { id: 'lipo-rfal', name: 'Liposuccion / RFAL', pole: 'Silhouette', href: 'silhouette.html#rfal',
      blurb: 'Amas graisseux localisés ; option radiofréquence (RFAL) pour raffermir la peau.',
      keys: ['liposuccion', 'lipoaspiration', 'lipo', 'graisse localisee', 'amas graisseux',
        'surcharge localisee', 'perdre du gras', 'maigrir localement', 'graisse qui resiste',
        'genoux', 'mollets', 'dos', 'graisse du dos', 'silhouette', 'radiofrequence', 'rfal',
        'raffermir la peau', 'peau relachee corps', 'cellulite', 'graisse hanches', 'gras hanches',
        'graisse localisee hanches', 'poignees amour hanches'] },

    { id: 'lipo-generale', name: 'Liposuccion', pole: 'Silhouette', href: 'silhouette.html#lipo',
      blurb: 'Remodelage des surcharges graisseuses localisées selon la zone concernée.',
      keys: ['liposuccion classique', 'liposuccion generale', 'lipossution', 'liposution', 'liposucion', 'lipo classique', 'aspirer la graisse',
        'enlever la graisse', 'graisse localisee', 'amas graisseux', 'graisse hanches', 'graisse cuisses',
        'graisse ventre', 'graisse bras', 'graisse qui resiste', 'remodeler la silhouette'] },

    { id: 'lipo-douce', name: 'Liposuccion douce', pole: 'Silhouette', href: 'silhouette.html#lipo-douce',
      blurb: 'Option plus limitée pour des zones ciblées et des gestes fins.',
      keys: ['liposuccion douce', 'lipo douce', 'petite liposuccion', 'petite lipo', 'zone limitee',
        'zones limitees', 'graisse legere', 'un peu de graisse', 'suites legeres liposuccion'] },

    { id: 'lipo-homme', name: 'Liposuccion masculine', pole: 'Silhouette', href: 'silhouette.html#homme',
      blurb: 'Prise en compte des spécificités de la silhouette masculine.',
      keys: ['homme', 'silhouette masculine', 'ventre homme', 'graisse homme', 'poignees homme',
        'gynecomastie', 'poitrine homme', 'seins homme', 'pectoraux graisseux', 'torse'] },

    { id: 'abdominoplastie', name: 'Abdominoplastie', pole: 'Silhouette', href: 'silhouette.html#abdomino',
      blurb: 'Excédent de peau et paroi abdominale, souvent après grossesse ou amaigrissement.',
      keys: ['abdominoplastie', 'tablier', 'tablier abdominal', 'peau du ventre', 'peau qui pend ventre',
        'peau qui pend', 'exces de peau', 'apres grossesse', 'apres accouchement', 'post partum',
        'apres amaigrissement', 'apres regime', 'perte de poids importante', 'grosse perte de poids',
        'ventre distendu', 'diastasis', 'vergetures'] },

    { id: 'protheses', name: 'Prothèses mammaires', pole: 'Silhouette', href: 'silhouette.html#protheses',
      blurb: 'Augmentation du volume de la poitrine.',
      keys: ['protheses', 'prothese mammaire', 'implants mammaires', 'implant', 'augmentation mammaire',
        'augmenter la poitrine', 'grossir la poitrine', 'poitrine plate', 'petite poitrine',
        'petits seins', 'seins petits', 'pas de poitrine', 'bonnet', 'volume des seins',
        'seins asymetriques', 'poitrine asymetrique', 'sein', 'seins', 'sain', 'sains', 'potrine', 'poitrinne', 'poitrin', 'poitrine', 'nichon', 'nichons', 'nenes', 'nibard', 'nibards', 'pecs', 'pectoraux', 'poitrail', 'seins plats', 'poitrine vide', 'complexe poitrine', 'pas assez de seins'] },

    { id: 'reduction', name: 'Réduction mammaire', pole: 'Silhouette', href: 'silhouette.html#reduction',
      blurb: 'Allègement d’une poitrine trop volumineuse.',
      keys: ['reduction mammaire', 'seins trop gros', 'poitrine trop grosse', 'poitrine lourde',
        'poitrine trop lourde', 'poitrine volumineuse', 'hypertrophie mammaire', 'mal de dos poitrine',
        'reduire la poitrine', 'diminuer la poitrine', 'grosse poitrine', 'gros seins', 'seins lourds', 'sain trop gros', 'potrine trop grosse', 'poitrinne lourde', 'trop de poitrine', 'seins enormes', 'seins volumineux', 'trop gros seins', 'dos qui fait mal', 'douleur dos seins', 'bretelles qui marquent'] },

    { id: 'ptose', name: 'Ptôse mammaire', pole: 'Silhouette', href: 'silhouette.html#ptose',
      blurb: 'Repositionnement d’une poitrine relâchée.',
      keys: ['ptose', 'seins qui tombent', 'poitrine qui tombe', 'poitrine tombante', 'seins tombants',
        'seins vides', 'seins relaches', 'apres allaitement', 'remonter la poitrine', 'remonter les seins',
        'lifting des seins', 'raffermir la poitrine', 'sain qui tombe', 'potrine qui tombe', 'poitrine basse', 'seins bas', 'sein tombant', 'poitrine vide apres grossesse', 'poitrine vide apres allaitement', 'seins bas apres grossesse', 'seins flasques', 'poitrine flasque'] },

    /* ---------- CHEVEUX ---------- */
    { id: 'greffe', name: 'Greffe de cheveux (FUE / FUT)', pole: 'Cheveux', href: 'cheveux.html',
      blurb: 'Restauration capillaire un domaine que le Dr Divaris enseigne à La Salpêtrière.',
      keys: ['cheveux', 'cheveu', 'perte de cheveux', 'chute de cheveux', 'perdre mes cheveux',
        'je perds mes cheveux', 'cheveux qui tombent', 'calvitie', 'chauve', 'crane degarni',
        'degarni', 'front degarni', 'front qui recule', 'golfes', 'tonsure', 'alopecie',
        'cheveux clairsemes', 'greffe de cheveux', 'greffe capillaire', 'implants capillaires',
        'implant capillaire', 'fue', 'fut', 'ligne frontale', 'golfes degarnis', 'golfes creuses', 'golfes qui reculent', 'tempe degarnie', 'tempes degarnies', 'perte densite cheveux', 'trou cheveux', 'cheveux clairseme'] },

    { id: 'mesogreffe', name: 'Mésogreffe', pole: 'Cheveux', href: 'cheveux.html#meso',
      blurb: 'Stimulation du cuir chevelu, densité capillaire.',
      keys: ['cheveux fins', 'cheveux qui s affinent', 'manque de densite', 'densite capillaire',
        'fortifier les cheveux', 'cuir chevelu', 'mesogreffe', 'cheveux fragiles'] },

    /* ---------- INJECTIONS ---------- */
    { id: 'botox', name: 'Botox', pole: 'Injections', href: 'interventions.html#injections',
      blurb: 'Atténuation des rides d’expression, sans chirurgie.',
      keys: ['botox', 'toxine botulique', 'ride', 'rides', 'rides d expression', 'ride du lion',
        'rides du lion', 'rides du front', 'front plisse', 'pattes d oie', 'patte d oie',
        'rides entre les sourcils', 'rides autour des yeux', 'air severe', 'air fache', 'bottox', 'botoxe', 'botoxx'] },

    { id: 'levres', name: 'Redessiner les lèvres', pole: 'Injections', href: 'interventions.html#injections',
      blurb: 'Volume et contour des lèvres.',
      keys: ['levres', 'levre', 'bouche', 'levres fines', 'bouche fine', 'levres trop fines',
        'volume des levres', 'contour des levres', 'ourlet des levres', 'redessiner les levres',
        'acide hyaluronique levres', 'repulper les levres', 'levres plates', 'levres asymetriques', 'bouche asymetrique', 'ourlet efface', 'bouche ridee', 'ridules levres'] },

    { id: 'hydrafacial', name: 'La Diva Hydrafacial', pole: 'Injections', href: 'interventions.html#injections',
      blurb: 'Soin de la peau, éclat, sans chirurgie.',
      keys: ['hydrafacial', 'soin du visage', 'soin de la peau', 'nettoyage de peau', 'points noirs',
        'peau qui tire', 'hydratation', 'coup d eclat', 'peau deshydratee'] },

    /* ---------- CHIRURGIE INTIME ---------- */
    { id: 'intime-f', name: 'Chirurgie intime féminine', pole: 'Chirurgie intime', href: 'interventions.html#intime',
      blurb: 'Nymphoplastie et interventions associées.',
      keys: ['nymphoplastie', 'petites levres', 'levres genitales', 'chirurgie intime', 'intime feminine',
        'gene intime', 'inconfort intime', 'sexe', 'sex', 'sexualite', 'parties intimes', 'intime', 'vagin', 'vulve', 'vulvaire', 'levres intimes', 'labioplastie', 'levres vaginales', 'sexe femme', 'complexe sexe', 'complexe intime', 'douleur intime', 'frottement intime', 'levres qui depassent', 'grandes petites levres'] },

    { id: 'intime-h', name: 'Chirurgie intime masculine', pole: 'Chirurgie intime', href: 'interventions.html#intime',
      blurb: 'Pénoplastie et interventions associées.',
      keys: ['penoplastie', 'verge', 'penis', 'agrandissement', 'augmentation du gland', 'gland',
        'chirurgie intime homme', 'intime masculine', 'sexe', 'sex', 'sexualite', 'parties intimes', 'intime', 'peni', 'pennis', 'penise', 'zizi', 'sexe homme', 'gland trop petit', 'complexe penis', 'complexe verge', 'taille penis', 'petit sexe', 'petit penis', 'petite verge'] },

    /* ---------- ENTRÉES GÉNÉRIQUES ---------- */
    { id: 'injections-hub', name: 'Médecine esthétique (injections)', pole: 'Injections', href: 'interventions.html#injections',
      blurb: 'Les options sans chirurgie : injections et soins.',
      keys: ['sans chirurgie', 'pas de chirurgie', 'sans operation', 'sans bistouri', 'injection',
        'injections', 'medecine esthetique', 'douceur'] }
  ];

  /* =========================================================
     Normalisation, stemming, distance d'édition
     ========================================================= */
  var STOP = { 'je': 1, 'j': 1, 'ai': 1, 'mon': 1, 'ma': 1, 'mes': 1, 'me': 1, 'moi': 1, 'le': 1, 'la': 1,
    'les': 1, 'un': 1, 'une': 1, 'de': 1, 'du': 1, 'des': 1, 'et': 1, 'ou': 1, 'au': 1, 'aux': 1,
    'en': 1, 'qui': 1, 'que': 1, 'quoi': 1, 'se': 1, 'sa': 1, 'son': 1, 'ses': 1, 'sur': 1, 'sous': 1,
    'dans': 1, 'pour': 1, 'par': 1, 'pas': 1, 'plus': 1, 'trop': 1, 'tres': 1, 'peu': 1, 'avec': 1,
    'sans': 1, 'veux': 1, 'voudrais': 1, 'aimerais': 1, 'aime': 1, 'suis': 1, 'est': 1, 'sont': 1,
    'etre': 1, 'avoir': 1, 'faire': 1, 'fait': 1, 'tout': 1, 'toute': 1, 'bien': 1, 'mal': 1,
    'depuis': 1, 'apres': 1, 'avant': 1, 'quand': 1, 'comme': 1, 'chez': 1, 'cette': 1, 'ce': 1, 'ca': 1,
    'tombe': 1, 'tombent': 1, 'tombant': 1, 'tombante': 1, 'lourd': 1, 'lourde': 1, 'relache': 1, 'relaches': 1, 'bas': 1, 'basse': 1 };

  function norm(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/['’\-]/g, ' ')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // stemming très simple : pluriels et féminins usuels
  function stem(t) {
    if (t.length <= 3) return t;
    t = t.replace(/(aux|eux)$/, 'au');       // chevaux/cheveux -> chevau/cheveu (cohérent des 2 côtés)
    t = t.replace(/(s|x)$/, '');             // pluriels
    return t;
  }

  function meaningful(tokens) {
    var out = [];
    tokens.forEach(function (t) {
      if (t.length > 2 && !STOP[t]) out.push(stem(t));
    });
    return out;
  }

  // distance d'édition avec plafond (tolérance typos)
  function editDist(a, b, max) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    var prev = [], cur = [];
    for (var j = 0; j <= lb; j++) prev[j] = j;
    for (var i = 1; i <= la; i++) {
      cur[0] = i;
      var rowMin = i;
      for (j = 1; j <= lb; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return max + 1;
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[lb];
  }

  /* ---------- Index : token -> items, et liste de phrases ---------- */
  var tokenIndex = {};   // token stemmé -> { itemIdx: poids max }
  var phrases = [];      // { p: phrase normalisée, i: itemIdx }

  function addTok(tok, idx, w) {
    if (!tok || STOP[tok] || tok.length < 3) return;
    var slot = tokenIndex[tok] || (tokenIndex[tok] = {});
    if (!slot[idx] || slot[idx] < w) slot[idx] = w;
  }

  var polesByToken = {}; // token stemmé -> Set (objet) des pôles où il apparaît

  KB.forEach(function (item, idx) {
    item.keys.forEach(function (key) {
      var nk = norm(key);
      if (nk.indexOf(' ') > -1) {
        phrases.push({ p: nk, i: idx });
        nk.split(' ').forEach(function (t) {
          var st = stem(t);
          addTok(t, idx, 1); addTok(st, idx, 1);
          (polesByToken[t] || (polesByToken[t] = {}))[item.pole] = true;
          (polesByToken[st] || (polesByToken[st] = {}))[item.pole] = true;
        });
      } else {
        addTok(nk, idx, 2); addTok(stem(nk), idx, 2);
      }
    });
  });

  // Un mot issu d'une phrase (ex. "asymétrique", "fatigué") qui se retrouve partagé
  // entre 3 pôles ou plus est un descripteur générique, pas un terme distinctif : on le
  // retire de l'index isolé pour qu'il n'oriente plus, seul, vers des soins sans rapport
  // (ex. "asymétrique" apparaît dans "menton asymétrique", "seins asymétriques" ET
  // "lèvres asymétriques" trois pôles différents). La phrase complète tapée telle
  // quelle continue de matcher via la liste `phrases` ci-dessus, qui n'est pas affectée.
  Object.keys(polesByToken).forEach(function (tok) {
    if (Object.keys(polesByToken[tok]).length >= 3) delete tokenIndex[tok];
  });

  var allTokens = Object.keys(tokenIndex);
  var ITEM_BY_ID = {};
  KB.forEach(function (item, idx) { ITEM_BY_ID[item.id] = { item: item, idx: idx }; });

  var CARE_GROUPS = [
    // Vieillissement du visage : une demande vague doit ouvrir les liftings proches.
    ['mirror-lift', 'minilift', 'lift-cou', 'lift-temporal', 'lift-pommettes', 'lipo-visage', 'menton'],

    // Ovale, cou, double menton, bas du visage.
    ['lift-cou', 'lipo-visage', 'menton', 'mirror-lift', 'minilift'],

    // Profil et équilibre facial.
    ['rhinoplastie', 'menton', 'lipo-visage', 'lift-cou'],

    // Joues, pommettes, volumes du milieu du visage.
    ['lift-pommettes', 'bichectomie', 'mirror-lift', 'minilift'],

    // Peau et surface cutanee.
    ['peeling', 'hydrafacial', 'botox'],

    // Regard : paupieres, cernes, front, rides autour des yeux.
    ['blepharoplastie', 'filling', 'lift-temporal', 'botox'],

    // Silhouette graisseuse : zones de liposuccion proches.
    ['lipo-generale', 'lipo-rfal', 'lipo-douce', 'culotte', 'lipo-ventre', 'lipo-bras', 'lipo-homme'],

    // Abdomen : ventre apres grossesse, peau, graisse, paroi.
    ['abdominoplastie', 'lipo-ventre', 'lipo-generale', 'lipo-rfal', 'lipo-douce'],

    // Poitrine : volume, reduction, chute, asymetrie.
    ['protheses', 'reduction', 'ptose'],

    // Cheveux : greffe et stimulation du cuir chevelu.
    ['greffe', 'mesogreffe'],

    // Intime : demandes souvent vagues, proposer les deux familles.
    ['intime-f', 'intime-h'],

    // Medecine esthetique sans chirurgie.
    ['botox', 'levres', 'hydrafacial', 'peeling', 'filling']
  ];

  function relatedIdsFor(itemId, qn) {
    var out = [], seen = {};
    function add(id) {
      if (id === itemId || seen[id] || !ITEM_BY_ID[id]) return;
      seen[id] = true;
      out.push(id);
    }
    function addGroup(group) { group.forEach(add); }

    var lipoGeneric = itemId === 'lipo-generale' || itemId === 'lipo-rfal' || itemId === 'lipo-douce';
    var hasHip = /\b(hanche|hanches|culotte|cheval|cuisse|cuisses)\b/.test(qn);
    var hasBelly = /\b(ventre|ventr|abdomen|abdominal|tablier|grossesse|accouchement|diastasis)\b/.test(qn);
    var hasArm = /\b(bras|dessous de bras)\b/.test(qn);
    var hasMale = /\b(homme|masculin|masculine|torse|pectoraux|poitrine homme|gynecomastie)\b/.test(qn);

    // Silhouette : on garde les soins autour de la zone demandee, pas toute la categorie.
    if (itemId === 'culotte' || (lipoGeneric && hasHip)) {
      addGroup(['culotte', 'lipo-generale', 'lipo-rfal', 'lipo-douce']);
      return out;
    }
    if (itemId === 'lipo-ventre' || itemId === 'abdominoplastie' || (lipoGeneric && hasBelly)) {
      addGroup(['lipo-ventre', 'abdominoplastie', 'lipo-generale', 'lipo-rfal', 'lipo-douce']);
      return out;
    }
    if (itemId === 'lipo-bras' || (lipoGeneric && hasArm)) {
      addGroup(['lipo-bras', 'lipo-generale', 'lipo-rfal', 'lipo-douce']);
      return out;
    }
    if (itemId === 'lipo-homme' || (lipoGeneric && hasMale)) {
      addGroup(['lipo-homme', 'lipo-generale', 'lipo-rfal', 'lipo-douce']);
      return out;
    }

    CARE_GROUPS.forEach(function (group) {
      if (group.indexOf(itemId) === -1) return;
      group.forEach(add);
    });
    return out;
  }

  /* ---------- Scoring hybride local ---------- */
  var SHORT_ROOTS = {
    'yeu': 1, 'oei': 1, 'oeil': 1, 'sex': 1, 'nez': 1, 'sei': 1, 'sein': 1,
    'sain': 1, 'cou': 1, 'bot': 1, 'rfal': 1
  };
  // 'fue'/'fut' volontairement exclus : en tolérance floue (typos) ces racines de
  // 3 lettres entrent en collision avec des mots français courants ("fuit", "faut"...).
  // Les correspondances exactes ("fue", "fut" tapés tels quels) restent gérées via
  // l'index direct des tokens, qui ne dépend pas de SHORT_ROOTS.

  var BAD_FUZZY = {
    'cheval>cheveux': 1, 'cheval>cheveu': 1, 'cheval>chevau': 1, 'cheval>chevelu': 1, 'chevau>cheveux': 1, 'chevau>cheveu': 1, 'face>faces': 1
  };

  var CANON = {
    'yeu': 'yeux', 'oei': 'oeil', 'oeils': 'oeil', 'oeille': 'oeil', 'oeilles': 'oeil',
    'oeulle': 'oeil', 'oeulles': 'oeil', 'oeuillle': 'oeil', 'yeuxx': 'yeux',
    'sex': 'sexe', 'peni': 'penis', 'pennis': 'penis', 'penise': 'penis',
    'sain': 'sein', 'sains': 'sein', 'potrine': 'poitrine', 'poitrin': 'poitrine',
    'poitrinne': 'poitrine', 'bottox': 'botox', 'botoxe': 'botox', 'botoxx': 'botox',
    'cheuveu': 'cheveux', 'cheuveux': 'cheveux', 'cheveu': 'cheveux',
    'ventr': 'ventre', 'ventree': 'ventre', 'lipossution': 'liposuccion', 'liposution': 'liposuccion', 'liposucion': 'liposuccion', 'blefaro': 'blepharoplastie'
  };

  function trigrams(s) {
    s = '  ' + s + '  ';
    var out = [];
    for (var i = 0; i < s.length - 2; i++) out.push(s.slice(i, i + 3));
    return out;
  }

  function trigramSim(a, b) {
    if (a.length < 4 || b.length < 4) return 0;
    var aa = trigrams(a), bb = trigrams(b), seen = {}, hit = 0;
    aa.forEach(function (g) { seen[g] = (seen[g] || 0) + 1; });
    bb.forEach(function (g) { if (seen[g]) { hit++; seen[g]--; } });
    return (2 * hit) / (aa.length + bb.length);
  }

  function addSlot(scores, tok, amount) {
    var slot = tokenIndex[tok];
    if (!slot) return false;
    Object.keys(slot).forEach(function (idx) { scores[idx] = (scores[idx] || 0) + amount * slot[idx]; });
    return true;
  }

  function tokenCandidates(qt) {
    var out = {}, canonical = CANON[qt];
    if (canonical) out[canonical] = 3.4;
    if (tokenIndex[qt]) out[qt] = Math.max(out[qt] || 0, 2.6);

    for (var k = 0; k < allTokens.length; k++) {
      var tok = allTokens[k];
      if (BAD_FUZZY[qt + '>' + tok]) continue;
      var minLen = Math.min(qt.length, tok.length);
      var maxLen = Math.max(qt.length, tok.length);

      // Ctrl-F interne : debut de mot ou fragment, mais seulement sur racines utiles si tres court.
      if (minLen >= 3 && (SHORT_ROOTS[qt] || SHORT_ROOTS[tok] || minLen >= 4)) {
        if (tok.indexOf(qt) === 0 || qt.indexOf(tok) === 0) out[tok] = Math.max(out[tok] || 0, minLen >= 4 ? 2.2 : 1.9);
        else if (tok.indexOf(qt) > -1 || qt.indexOf(tok) > -1) out[tok] = Math.max(out[tok] || 0, minLen >= 4 ? 1.45 : 1.1);
      }

      // Typos classiques. Mots courts limites aux racines utiles pour eviter les faux positifs.
      if (maxLen >= 4 && (minLen >= 5 || SHORT_ROOTS[qt] || SHORT_ROOTS[tok])) {
        var maxD = maxLen >= 8 ? 3 : (maxLen >= 6 ? 2 : 1);
        var d = editDist(qt, tok, maxD);
        if (d <= maxD) out[tok] = Math.max(out[tok] || 0, Math.max(1.05, 2.5 - d * 0.55));
      }

      // Similarite par trigrammes pour les mots deformes (potrine, oeuillle, blefaro...).
      if (maxLen >= 5) {
        var sim = trigramSim(qt, tok);
        if (sim >= 0.48) out[tok] = Math.max(out[tok] || 0, 1 + sim * 1.4);
      }
    }
    return out;
  }

  function applyContextRules(qn, scores) {
    var eyeCtx = /\b(yeu|yeux|oeil|oeille|oeulle|oeuillle|paupiere|paupieres|regard|poches?)\b/.test(qn);
    var breastCtx = /\b(sein|seins|sain|sains|poitrine|potrine|poitrin|poitrinne|nichons?|nenes?)\b/.test(qn);

    function boost(id, amount) {
      for (var i = 0; i < KB.length; i++) if (KB[i].id === id) scores[i] = (scores[i] || 0) + amount;
    }

    if (/\b(sex|sexe|intime|vagin|vulve|penis|peni|verge|gland|zizi)\b/.test(qn)) {
      boost('intime-f', 2.2); boost('intime-h', 2.2);
    }

    if (eyeCtx) {
      boost('blepharoplastie', 1.8); boost('filling', 1.1);
      if (/\b(paupiere|paupieres)\b/.test(qn) && /\b(lourd|lourde|tombe|tombent|tombante)\b/.test(qn)) boost('blepharoplastie', 6);
      if (/\b(cerne|cernes|creux|vallee)\b/.test(qn)) boost('filling', 24);
    }
    if (/\b(cerne|cernes|creux|vallee)\b/.test(qn)) boost('filling', 2.4);

    if (breastCtx) {
      boost('protheses', 1.2); boost('reduction', 1.2); boost('ptose', 1.2);
      if (/\b(tombe|tombent|bas|basse|relache|relaches|vide|vides|remonter)\b/.test(qn)) boost('ptose', 15);
      if (/\b(gros|grosse|lourd|lourde|reduire|diminuer|mal de dos|trop)\b/.test(qn)) boost('reduction', 18);
      if (/\b(petit|petite|plate|augmenter|grossir|volume|bonnet)\b/.test(qn)) boost('protheses', 18);
    }

    if (/\b(cheveux|cheveu|cheuveu|calvitie|chauve|degarni|golfes|tonsure|alopecie)\b/.test(qn)) boost('greffe', 2.2);
    var lipoCtx = /\b(lipo|liposuccion|lipossution|liposution|liposucion|lipoaspiration|graisse|gras)\b/.test(qn);
    if (/\b(culotte|cheval|hanches?|cuisses?)\b/.test(qn)) boost('culotte', lipoCtx || /\b(culotte|cheval)\b/.test(qn) ? 42 : 2.2);
    if (/\b(bras|dessous de bras)\b/.test(qn)) boost('lipo-bras', lipoCtx ? 24 : 3.2);
    if (/\b(ventre|ventr|bidon|abdomen|tablier)\b/.test(qn)) { boost('lipo-ventre', lipoCtx ? 24 : 2.8); boost('abdominoplastie', lipoCtx ? 2 : 1.8); }
  }

  function filterContextualFalsePositives(qn, results) {
    var hasBreast = /\b(sein|seins|sain|sains|poitrine|potrine|poitrin|poitrinne|nichons?|nenes?)\b/.test(qn);
    var hasMouth = /\b(levres?|bouche|ourlet)\b/.test(qn);
    var hasIntime = /\b(intime|sex|sexe|vagin|vulve|vulvaire|genital|genitale|penis|peni|verge|gland|zizi|nymphoplastie|penoplastie|petites levres)\b/.test(qn);
    var hasHip = /\b(hanche|hanches|culotte|cheval|cuisse|cuisses)\b/.test(qn);
    var hasBelly = /\b(ventre|ventr|bidon|abdomen|abdominal|tablier|grossesse|accouchement|diastasis)\b/.test(qn);
    var hasArm = /\b(bras|dessous de bras)\b/.test(qn);
    // Bug corrigé : le double antislash ne matchait jamais rien (hasFaceZone restait
    // toujours false). Liste aussi élargie aux parties du visage explicitement citées
    // dans la base (menton, mâchoire, front, joue, pommette, sourcil...) pour que ce
    // filtre serve réellement à écarter les résultats hors-sujet (Silhouette/Cheveux/
    // Chirurgie intime) quand la demande parle clairement du visage.
    var hasFaceZone = /\b(tete|face|figure|visage|gueule|tronche|menton|machoire|front|joue|joues|pommette|pommettes|sourcil|sourcils|paupiere|paupieres)\b/.test(qn);

    return results.filter(function (r) {
      if (hasBreast && (r.item.id === 'blepharoplastie' || r.item.id === 'filling' || r.item.id === 'lift-temporal')) return false;
      if (hasMouth && !hasIntime && (r.item.id === 'intime-f' || r.item.id === 'intime-h')) return false;
      if (hasHip && (r.item.id === 'lipo-bras' || r.item.id === 'lipo-ventre' || r.item.id === 'abdominoplastie' || r.item.id === 'lipo-homme')) return false;
      if (hasBelly && (r.item.id === 'culotte' || r.item.id === 'lipo-bras' || r.item.id === 'lipo-homme')) return false;
      if (hasArm && (r.item.id === 'culotte' || r.item.id === 'lipo-ventre' || r.item.id === 'abdominoplastie' || r.item.id === 'lipo-homme')) return false;
      if (hasFaceZone && (r.item.pole === 'Silhouette' || r.item.pole === 'Cheveux' || r.item.pole === 'Chirurgie intime')) return false;
      return true;
    });
  }
  function score(query) {
    var qn = norm(query);
    if (!qn) return [];
    var qTokens = meaningful(qn.split(' '));
    var scores = {};

    function add(idx, s) { scores[idx] = (scores[idx] || 0) + s; }

    // 1) expressions entieres contenues dans la requete.
    phrases.forEach(function (ph) {
      if (qn.indexOf(ph.p) > -1) add(ph.i, 5);
    });

    // 2) tokens exacts, aliases, fragments, typos et trigrammes.
    qTokens.forEach(function (qt) {
      var candidates = tokenCandidates(qt);
      Object.keys(candidates).forEach(function (tok) { addSlot(scores, tok, candidates[tok]); });
    });

    // 3) contexte metier pour departager les services.
    applyContextRules(qn, scores);

    var results = Object.keys(scores).map(function (idx) {
      return { item: KB[idx], s: scores[idx] };
    });
    results.sort(function (a, b) { return b.s - a.s; });
    if (!results.length) return results;

    var top = results[0].s;
    var thresh = top >= 5 ? Math.max(3, top * 0.45) : Math.max(1.8, top * 0.52);
    var kept = results.filter(function (r) { return r.s >= thresh; });
    var seen = {};
    kept.forEach(function (r) { seen[r.item.id] = true; });

    // Toute recherche doit rester exploratoire : on ajoute les soins du meme groupe
    // pour que "hanches", "yeux", "nez", "seins", "cheveux" ou "sexe" ouvrent
    // chacun l'univers de soins pertinent au lieu d'afficher une carte isolee.
    kept.slice(0, 4).forEach(function (r) {
      relatedIdsFor(r.item.id, qn).forEach(function (id) {
        if (seen[id]) return;
        seen[id] = true;
        kept.push({ item: ITEM_BY_ID[id].item, s: Math.max(1.15, r.s * 0.32), related: true });
      });
    });

    kept = filterContextualFalsePositives(qn, kept);
    return kept.slice(0, 9);
  }
  /* =========================================================
     Rendu
     ========================================================= */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return (s || '').replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function scrollIn(node) { try { node.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {} }

  function renderResults(res, container) {
    var top = res.slice(0, 9);
    container.appendChild(el('p', 'g-lead', top.length === 1
      ? 'Ce que vous décrivez évoque le plus souvent&nbsp;:'
      : 'Soins à explorer autour de votre demande&nbsp;:'));
    var cards = el('div', 'g-cards');
    top.forEach(function (r) {
      var c = el('a', 'g-card');
      c.href = r.item.href;
      c.innerHTML =
        '<span class="g-pole">' + esc(r.item.pole) + '</span>' +
        '<span class="g-name">' + esc(r.item.name) + '</span>' +
        '<span class="g-blurb">' + esc(r.item.blurb) + '</span>' +
        '<span class="g-more">En savoir plus →</span>';
      cards.appendChild(c);
    });
    container.appendChild(cards);
    container.appendChild(el('p', 'g-disc',
      'Orientation indicative, établie à partir de vos mots elle ne constitue ni un diagnostic ni une promesse de résultat. ' +
      'Seule une consultation permet d’évaluer ce qui est adapté, réalisable, et ses risques.'));
  }

  function renderFallback(container) {
    container.innerHTML =
      '<p class="g-lead">Je ne suis pas sûr de bien cerner votre demande. Vous pouvez reformuler avec vos mots, ' +
      'explorer par zone, ou en parler directement en consultation c’est souvent le plus simple.</p>' +
      '<div class="g-actions">' +
      '<a class="g-pill" href="visage.html">Visage</a>' +
      '<a class="g-pill" href="silhouette.html">Silhouette</a>' +
      '<a class="g-pill" href="cheveux.html">Cheveux</a>' +
      '<a class="g-pill" href="interventions.html">Toutes les interventions</a>' +
      '<a class="g-pill g-pill-dark" href="consultation.html">Prendre rendez-vous</a>' +
      '</div>';
  }

  function respondLocal(query, container) {
    var res = score(query);
    if (res.length) renderResults(res, container);
    else renderFallback(container);
  }

  function respond(query) {
    thread.appendChild(el('div', 'g-msg g-user', '<span>' + esc(query) + '</span>'));
    var a = el('div', 'g-msg g-bot');
    thread.appendChild(a);

    /* Hook "vrai modèle" : si un endpoint est configuré (petit backend
       qui interroge l'API Claude, jamais de clé côté client), on lui
       délègue la compréhension ; repli local en cas d'échec. */
    if (window.GUIDE_API_URL) {
      a.appendChild(el('p', 'g-lead', '…'));
      fetch(window.GUIDE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, ids: KB.map(function (k) { return k.id; }) })
      }).then(function (r) { return r.json(); }).then(function (data) {
        a.innerHTML = '';
        var matched = (data.ids || []).map(function (id) {
          for (var i = 0; i < KB.length; i++) if (KB[i].id === id) return { item: KB[i], s: 5 };
          return null;
        }).filter(Boolean);
        if (matched.length) renderResults(matched, a);
        else respondLocal(query, a);
        scrollIn(a);
      }).catch(function () { a.innerHTML = ''; respondLocal(query, a); scrollIn(a); });
    } else {
      respondLocal(query, a);
      scrollIn(a);
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    respond(v);
    input.value = '';
    input.focus();
  });

  if (chipsBox) {
    chipsBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-concern]');
      if (!b) return;
      respond(b.getAttribute('data-concern'));
    });
  }
})();
