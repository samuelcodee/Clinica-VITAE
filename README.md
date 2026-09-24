# Clínica Vitae — site institucional

Site estático (HTML, CSS e JavaScript puros, sem build). Para ver, abra `index.html` no navegador.
Hospedado na Vercel a partir deste repositório (import direto, sem configuração — é HTML puro).
Também funciona em qualquer outra hospedagem estática (Netlify, Cloudflare Pages, GitHub Pages, Hostinger etc.).

```
site/
  index.html              página única, com todas as seções
  favicon.ico, robots.txt
  vercel.json             cache e segurança na Vercel
  _headers                mesma coisa para Netlify / Cloudflare Pages (a Vercel ignora este arquivo)
  assets/css/styles.css   identidade visual (cores, tipografia, layout, animações)
  assets/js/config.js     ← DADOS DA CLÍNICA: edite aqui
  assets/js/main.js       agendamento, menu, mapa, FAQ, comparador antes/depois
  assets/fonts/           Playfair Display e Montserrat (hospedadas no próprio site)
  assets/img/             fotos, logotipo e favicons usados no site
  assets/media/           vídeo da Dra. Karolyna (legendado)
```

Fora da pasta do site, em `C:\CLINICA VITAE\marca-logotipos\`, ficam as versões do logotipo com fundo
transparente (dourado, marinho e branco) para usar em outros materiais.

## Como funciona o agendamento

1. O paciente escolhe o serviço (e, se quiser, a profissional), a data, o horário e informa o nome.
2. O site monta a mensagem e abre o WhatsApp `5585988404126` com ela já escrita.
3. Nada é salvo no site. A mensagem é uma **solicitação**: quem confirma o horário é a equipe.

Todos os botões "Agendar" usam o mesmo fluxo e já chegam com o serviço marcado.
Links externos também funcionam, por exemplo: `index.html?servico=implante#agendamento`.

## Ao alterar arquivos depois de publicado

- Mudou `styles.css`, `config.js` ou `main.js`? Aumente o número `?v=6` no `index.html`
  (nas três linhas), para os navegadores buscarem a versão nova.
- Trocou uma foto? Use um **nome de arquivo novo** (as imagens ficam em cache por 30 dias).
- Foto principal: `assets/img/dra-karolyna-{520,760,1080}.{avif,webp}`. O original está em
  `C:\CLINICA VITAE\dra-karolyna-retrato-original.jpg`.

## Desempenho (Lighthouse 13, medido localmente com compressão ativada)

| | Antes | Depois |
|---|---|---|
| Celular — desempenho | 85 | 95–98 |
| Celular — 1ª pintura / conteúdo principal | 2,9 s / 3,1 s | 0,8–1,2 s / 2,0–2,2 s |
| Desktop — desempenho | 98 | 100 |
| Acessibilidade · Boas práticas · SEO | 97 · 100 · 100 | 100 · 100 · 100 |

A nota de celular varia alguns pontos entre medições (é simulação). Na hospedagem, confirme no
PageSpeed Insights (https://pagespeed.web.dev) depois de publicar.

## Pendências (preencher em `assets/js/config.js`)

| Campo | Situação |
|---|---|
| `technicalResponsible.cro` | CRO-CE da responsável técnica. O CFO exige nome e CRO na publicidade odontológica. |
| `instagram` | Confira a grafia de **@clinicavitaceara** (foi informada assim, sem o "e" de "vitae"). |
| `email` | Não informado. |
| `services[].description` | Descrições neutras escritas como rascunho. Revise com a clínica. |
| `geo` | Coordenadas exatas (opcional). Sem elas, o mapa usa o endereço. |
| `googleMapsEmbedKey` | Opcional. Sem chave, o mapa usa o embed público do Google Maps. |

Também:

- **Foto antes/depois**: confirme que existe autorização por escrito do paciente para uso no site (Resolução CFO 196/2019).
- **Política de privacidade**: o texto completo, conforme a LGPD, ainda precisa ser fornecido. Há um espaço reservado no site.
- **Domínio**: quando existir, adicione `<link rel="canonical">` e troque o `og:image` por uma URL absoluta em `index.html`.
- **Depoimentos**: não há seção de depoimentos, porque não existem depoimentos autorizados. Quando houver, liste-os em `testimonials` no `config.js` e adicione a seção visual.
