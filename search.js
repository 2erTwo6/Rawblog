// Rawblog 全文搜索：以首页文章列表为唯一数据源，无需维护索引。
// 输入时并行拉取各篇文章（首页已链接的），对正文做纯文本匹配；
// file:// 或离线时 fetch 失败，自动退化为仅按标题过滤。
(() => {
  const input = document.getElementById('search');
  const list = document.getElementById('posts');
  const empty = document.getElementById('no-result');
  if (!input || !list) return;

  const posts = [...list.querySelectorAll('li')].map(li => {
    const a = li.querySelector('a');
    return { li, url: a.getAttribute('href'), title: a.textContent.toLowerCase() };
  });

  // 正文缓存：url -> Promise<纯文本>。同一篇只拉一次。
  const bodies = new Map();
  const bodyOf = post => {
    if (!bodies.has(post.url)) {
      bodies.set(post.url, fetch(post.url)
        .then(res => res.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const art = doc.querySelector('article') || doc.body;
          return art.textContent.replace(/\s+/g, ' ').toLowerCase();
        })
        .catch(() => '')); // 拉不到就不参与正文匹配
    }
    return bodies.get(post.url);
  };

  const apply = hit => {
    for (const p of posts) p.li.hidden = !hit.has(p);
    empty.hidden = hit.size > 0;
  };

  let seq = 0;
  input.addEventListener('input', async () => {
    const q = input.value.trim().toLowerCase();
    const id = ++seq;

    if (!q) { apply(new Set(posts)); return; }

    const hit = new Set();
    await Promise.all(posts.map(async p => {
      if (p.title.includes(q) || (await bodyOf(p)).includes(q)) hit.add(p);
    }));

    if (id === seq) apply(hit); // 期间有新输入则丢弃本轮结果
  });

  // 快捷键：/ 聚焦搜索框，Esc 清空并失焦
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    } else if (e.key === 'Escape' && document.activeElement === input) {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.blur();
    }
  });
})();