(function () {
  'use strict';
  var grid = document.getElementById('blog-grid');
  var empty = document.getElementById('blog-empty');
  if (!grid) return;

  var formatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  window.DIVARIS_SUPABASE
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false })
    .then(function (res) {
      var posts = res.data || [];
      if (res.error || !posts.length) {
        empty.hidden = false;
        if (res.error) empty.textContent = 'Impossible de charger les articles pour le moment.';
        return;
      }

      posts.forEach(function (post) {
        var a = document.createElement('a');
        a.className = 'card';
        a.href = 'article.html?post=' + encodeURIComponent(post.slug);

        var idx = document.createElement('span');
        idx.className = 'idx';
        var d = new Date(post.date + 'T00:00:00');
        idx.textContent = isNaN(d) ? post.date : formatter.format(d);
        a.appendChild(idx);

        var h3 = document.createElement('h3');
        h3.textContent = post.title;
        a.appendChild(h3);

        var p = document.createElement('p');
        p.textContent = post.excerpt || '';
        a.appendChild(p);

        var arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.textContent = '→';
        a.appendChild(arrow);

        grid.appendChild(a);
      });
    });
}());
