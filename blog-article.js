(function () {
  'use strict';
  var slug = new URLSearchParams(window.location.search).get('post');
  if (!slug) {
    window.location.replace('blog.html');
    return;
  }

  window.DIVARIS_SUPABASE
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
    .then(function (res) {
      var post = res.data;
      if (res.error || !post) {
        window.location.replace('blog.html');
        return;
      }

      var formatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      var d = new Date(post.date + 'T00:00:00');
      var dateLabel = isNaN(d) ? post.date : formatter.format(d);

      document.title = post.title + ' — Journal du Dr Marc Divaris';
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = post.excerpt || post.title;

      document.getElementById('blog-date').textContent = dateLabel;
      document.getElementById('blog-title').textContent = post.title;
      document.getElementById('blog-excerpt').textContent = post.excerpt || '';

      var cover = document.getElementById('blog-cover');
      if (post.cover_url) {
        cover.src = post.cover_url;
        cover.alt = post.title;
      } else {
        cover.remove();
      }

      var body = document.getElementById('blog-body');
      (post.content || []).forEach(function (text) {
        var p = document.createElement('p');
        p.textContent = text;
        body.appendChild(p);
      });
    });
}());
