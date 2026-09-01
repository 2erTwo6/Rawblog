# Rawblog

极简博客。哲学：**NoBuild** —— 纯 HTML / CSS /（可选 JS），零依赖、零构建、无 package.json。

## 结构约定

- 一篇博客一个文件夹：`001/`、`002/`……编号只增不减，每篇只有一个 `index.html`
- `index.html`（根）：首页，手动维护的文章列表
- `search.js`：首页全文搜索。以文章列表里的链接为索引，输入时并行拉取各篇 `index.html` 的正文做匹配——加新文章不用改任何搜索相关的东西
- `style.css`：全站唯一样式表，相对路径引用（首页 `style.css`，文章页 `../style.css`）

```
├── 001/
│   └── index.html
├── 002/              ← 以后加
│   └── index.html
├── index.html        ← 首页（文章列表）
├── search.js         ← 首页全文搜索
└── style.css
```

## 新增文章

1. 复制上一个编号文件夹，编号 +1（如 `001/` → `002/`）
2. 改标题、日期、正文
3. 在根 `index.html` 的文章列表 `<ul class="posts">` 里加一个 `<li>`

## 环境

纯静态文件，日常编辑**不需要 Docker、不需要任何构建环境**（用户已明确：本项目豁免全局容器要求）。

预览（可选）：`python3 -m http.server 8000` 后开 http://127.0.0.1:8000 ，或直接双击 `index.html`（相对路径已兼容 file://）。

部署：整个目录扔给任意静态托管即可（GitHub Pages / nginx / 对象存储…）。