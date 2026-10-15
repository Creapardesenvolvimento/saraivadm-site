# Site Saraiva Design (saraivadm.com.br)

Site estático feito em [Astro](https://astro.build), sem WordPress e sem Elementor.
Cada alteração enviada ao GitHub é publicada automaticamente no cPanel.

## Onde fica cada coisa

| O que | Onde |
|---|---|
| Telefones, e-mail, endereço, redes sociais, menus | `src/data/site.ts` |
| Home | `src/pages/index.astro` |
| Posts do blog (um arquivo por post) | `src/content/blog/*.md` |
| Imagens | `src/assets/img/` (convertidas para WebP automaticamente) |
| Cabeçalho / rodapé | `src/components/Header.astro` / `Footer.astro` |
| SEO padrão (title, description, Open Graph, canonical) | `src/layouts/Base.astro` |
| Formulário → e-mail | `src/components/ContactForm.astro` + `public/enviar.php` |
| Redirecionamentos 301, HTTPS, cache | `public/.htaccess` |
| Registro das alterações de SEO | `docs/seo-log.md` |

## Novo post no blog

Crie `src/content/blog/nome-do-post.md` (o nome do arquivo vira a URL `/blog/nome-do-post/`):

```md
---
titulo: Título que aparece na página (H1)
seoTitulo: Título para o Google, até 60 caracteres (opcional)
descricao: Meta description, até 155 caracteres.
resumo: Texto curto do card.
imagem: ../../assets/img/nome-da-imagem.jpg
imagemAlt: Descrição da imagem
publicado: 2026-10-15
rascunho: false
---

Texto do post em Markdown...
```

Com `rascunho: true` o post aparece só no ambiente local, nunca no site publicado.

## Rodar no computador

```bash
npm install
npm run dev
```

Abre em http://localhost:4321.

## Publicação (GitHub → Easypanel)

O site roda no Easypanel a partir do `Dockerfile`: o Astro gera o site e o Apache + PHP o serve
(com o `.htaccess` e o formulário `enviar.php`). A cada `git push` na branch `main`, o Easypanel publica de novo
(com o deploy automático ligado).

**No Easypanel:**
1. Crie um serviço do tipo **App** → Source: **GitHub** → este repositório, branch `main`.
2. Build: **Dockerfile** (caminho `Dockerfile`).
3. Domínios: aponte `saraivadm.com.br` para a porta **80** do app.
4. Environment (para o formulário enviar e-mail):

```
SMTP_HOST=smtp.seuprovedor.com.br
SMTP_PORT=587
SMTP_USER=site@saraivadm.com.br
SMTP_PASS=senha-do-email
SMTP_FROM=site@saraivadm.com.br
EMAIL_DESTINO=contato@saraivadm.com.br
```

Sem essas variáveis o site funciona normalmente, mas o formulário não envia e-mail.

**Alternativa cPanel:** o workflow `.github/workflows/deploy.yml` envia o site por FTP quando acionado manualmente
em GitHub → Actions (precisa dos secrets `FTP_SERVER`, `FTP_USERNAME` e `FTP_PASSWORD`).

## Node.js

O projeto usa Astro 5, compatível com o Node 22.18 instalado neste computador.
Para migrar para o Astro 7, atualize o Node para 22.22 ou mais novo.
