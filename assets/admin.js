(function () {
  'use strict';
  var sb = window.DIVARIS_SUPABASE;

  var loginView = document.getElementById('admin-login');
  var dashView = document.getElementById('admin-dashboard');
  var loginForm = document.getElementById('login-form');
  var loginError = document.getElementById('login-error');
  var logoutBtn = document.getElementById('logout-btn');
  var whoami = document.getElementById('whoami');

  var postForm = document.getElementById('post-form');
  var formTitle = document.getElementById('form-title');
  var editingId = null;
  var currentCoverUrl = '';

  var postsList = document.getElementById('posts-list');
  var postsEmpty = document.getElementById('posts-empty');
  var saveMsg = document.getElementById('save-msg');
  var newPostBtn = document.getElementById('new-post-btn');

  function slugify(text) {
    return (text || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'article';
  }

  /* ---------- Authentification ---------- */

  function showLoggedIn(user) {
    loginView.hidden = true;
    dashView.hidden = false;
    whoami.textContent = user.email;
    loadPosts();
  }

  function showLoggedOut() {
    loginView.hidden = false;
    dashView.hidden = true;
  }

  sb.auth.getSession().then(function (res) {
    var session = res.data && res.data.session;
    if (session) showLoggedIn(session.user); else showLoggedOut();
  });

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    loginError.hidden = true;
    var email = document.getElementById('login-email').value.trim();
    var password = document.getElementById('login-password').value;
    sb.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
      if (res.error) {
        loginError.textContent = 'Connexion refusée : ' + res.error.message;
        loginError.hidden = false;
        return;
      }
      showLoggedIn(res.data.user);
    });
  });

  logoutBtn.addEventListener('click', function () {
    sb.auth.signOut().then(function () { showLoggedOut(); });
  });

  /* ---------- Liste des articles ---------- */

  function loadPosts() {
    sb.from('posts').select('*').order('date', { ascending: false }).then(function (res) {
      if (res.error) {
        postsList.innerHTML = '';
        postsEmpty.hidden = false;
        postsEmpty.textContent = 'Erreur de chargement : ' + res.error.message;
        return;
      }
      renderPosts(res.data || []);
    });
  }

  function renderPosts(posts) {
    postsList.innerHTML = '';
    postsEmpty.hidden = posts.length > 0;
    posts.forEach(function (post) {
      var row = document.createElement('div');
      row.className = 'admin-row';

      var info = document.createElement('div');
      info.className = 'admin-row-info';
      info.innerHTML =
        '<strong>' + escapeHtml(post.title) + '</strong>' +
        '<span>' + escapeHtml(post.date) + (post.published ? '' : ' — brouillon (non visible sur le site)') + '</span>';
      row.appendChild(info);

      var actions = document.createElement('div');
      actions.className = 'admin-row-actions';

      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn-outline';
      editBtn.textContent = 'Modifier';
      editBtn.addEventListener('click', function () { fillForm(post); });
      actions.appendChild(editBtn);

      var toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'btn btn-outline';
      toggleBtn.textContent = post.published ? 'Dépublier' : 'Publier';
      toggleBtn.addEventListener('click', function () {
        sb.from('posts').update({ published: !post.published }).eq('id', post.id).then(function (res) {
          if (res.error) { alert('Erreur : ' + res.error.message); return; }
          loadPosts();
        });
      });
      actions.appendChild(toggleBtn);

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn btn-outline';
      delBtn.textContent = 'Supprimer';
      delBtn.addEventListener('click', function () {
        if (!confirm('Supprimer définitivement « ' + post.title + ' » ?')) return;
        sb.from('posts').delete().eq('id', post.id).then(function (res) {
          if (res.error) { alert('Erreur : ' + res.error.message); return; }
          if (editingId === post.id) resetForm();
          loadPosts();
        });
      });
      actions.appendChild(delBtn);

      row.appendChild(actions);
      postsList.appendChild(row);
    });
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s == null ? '' : String(s);
    return div.innerHTML;
  }

  /* ---------- Formulaire (création / édition) ---------- */

  function resetForm() {
    editingId = null;
    currentCoverUrl = '';
    postForm.reset();
    formTitle.textContent = 'Nouvel article';
    document.getElementById('current-cover').hidden = true;
  }

  function fillForm(post) {
    editingId = post.id;
    currentCoverUrl = post.cover_url || '';
    formTitle.textContent = 'Modifier l’article';
    document.getElementById('f-title').value = post.title || '';
    document.getElementById('f-date').value = post.date || '';
    document.getElementById('f-excerpt').value = post.excerpt || '';
    document.getElementById('f-content').value = (post.content || []).join('\n\n');
    document.getElementById('f-published').checked = !!post.published;
    var coverPreview = document.getElementById('current-cover');
    if (currentCoverUrl) {
      coverPreview.hidden = false;
      coverPreview.querySelector('img').src = currentCoverUrl;
    } else {
      coverPreview.hidden = true;
    }
    window.scrollTo({ top: postForm.offsetTop - 20, behavior: 'smooth' });
  }

  newPostBtn.addEventListener('click', resetForm);

  postForm.addEventListener('submit', function (e) {
    e.preventDefault();
    saveMsg.hidden = true;
    var submitBtn = postForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enregistrement…';

    var title = document.getElementById('f-title').value.trim();
    var date = document.getElementById('f-date').value;
    var excerpt = document.getElementById('f-excerpt').value.trim();
    var published = document.getElementById('f-published').checked;
    var rawContent = document.getElementById('f-content').value.trim();
    var content = rawContent.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    var file = document.getElementById('f-cover').files[0];

    function saveRecord(coverUrl) {
      var record = {
        title: title,
        date: date,
        excerpt: excerpt,
        content: content,
        published: published,
        cover_url: coverUrl,
        updated_at: new Date().toISOString()
      };

      var query;
      if (editingId) {
        query = sb.from('posts').update(record).eq('id', editingId);
      } else {
        record.slug = slugify(title) + '-' + Date.now().toString(36);
        query = sb.from('posts').insert(record);
      }

      query.then(function (res) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publier';
        if (res.error) {
          saveMsg.textContent = 'Erreur : ' + res.error.message;
          saveMsg.hidden = false;
          return;
        }
        saveMsg.textContent = 'Enregistré ✓';
        saveMsg.hidden = false;
        resetForm();
        loadPosts();
      });
    }

    if (file) {
      var path = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
      sb.storage.from('blog-images').upload(path, file).then(function (res) {
        if (res.error) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Publier';
          saveMsg.textContent = 'Erreur photo : ' + res.error.message;
          saveMsg.hidden = false;
          return;
        }
        var publicUrl = sb.storage.from('blog-images').getPublicUrl(path).data.publicUrl;
        saveRecord(publicUrl);
      });
    } else {
      saveRecord(currentCoverUrl);
    }
  });
}());
