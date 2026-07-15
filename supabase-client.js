/* Connexion partagée à Supabase (base de données du Journal).
   La clé ci-dessous est une clé "publishable" : elle est faite pour être
   visible dans le code d'un site (au même titre qu'une clé Google Maps).
   La vraie protection se joue côté base de données (Row Level Security),
   pas ici. Ne jamais remplacer cette clé par une "secret key". */
window.DIVARIS_SUPABASE = window.supabase.createClient(
  'https://qnvzpumzyuowpgzbvacm.supabase.co',
  'sb_publishable_IHQ_PvY9etzLgQtWA21SyA_2AtAEhqY'
);
