// 代码块一键复制：纯原生实现，无依赖。
// JS 会把每个 <pre> 包进 .code-block，按钮挂在包裹层（而不是 pre 内部），
// 这样代码横向滚动时按钮不会被卷走；禁用 JS 时页面照常，只是没按钮。
(() => {
  document.querySelectorAll('article pre').forEach(pre => {
    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    pre.replaceWith(wrap);
    wrap.appendChild(pre);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = '复制';
    btn.setAttribute('aria-label', '复制代码');

    btn.addEventListener('click', async () => {
      // 从 code 子元素取文本，避开按钮自己的文字
      const code = (pre.querySelector('code') || pre).textContent.replace(/\n$/, '');
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(code);
        } else {
          // 非安全上下文（如局域网 HTTP 预览）的兜底
          const ta = document.createElement('textarea');
          ta.value = code;
          ta.style.cssText = 'position:fixed;opacity:0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        btn.textContent = '已复制 ✓';
        btn.classList.add('ok');
      } catch {
        btn.textContent = '复制失败';
        btn.classList.add('err');
      }
      setTimeout(() => { btn.textContent = '复制'; btn.className = 'copy-btn'; }, 1600);
    });

    wrap.appendChild(btn);
  });
})();