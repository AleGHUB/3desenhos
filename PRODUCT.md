# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Astro (site estático) + GSAP para motion, deploy na Vercel. Motivo: HTML leve e rápido por padrão (bom para SEO e para o público que chega pelo celular), GSAP roda em qualquer framework, e o site é editável e publicável inteiramente pela nuvem, sem depender da máquina local (MacBook 2013 limitado a macOS Big Sur).

## Users

> Decisão delegada pelo fundador em 2026-09-24 e registrada como recomendação. Pode ser revista.

**Comprador principal:** operações que repetem design em escala. Editoras, redes de franquia, e-commerces com muitos SKUs, infoprodutores, igrejas e ministérios com produção diária, marcas com comunicação em vários idiomas ou lojas. Quem decide é o dono, o gestor de marketing ou o coordenador editorial. Hoje esse gargalo depende de um designer produzindo peça por peça, e o erro humano aparece quando o volume sobe.

**Situação em que chega ao site:** já sente a dor (atraso, custo de equipe, inconsistência de marca entre peças) e quer saber se dá pra resolver sem contratar mais gente.

**Canal secundário:** agências que terceirizam design, motion e automação em white-label. Elas chegam pelo mesmo argumento, mas compram capacidade, não o produto final.

**Fora do público:** recrutadores. O site vende o estúdio, não é currículo.

## Product Purpose

O 3desenhos transforma a identidade visual de um cliente num sistema que produz peças sozinho. O estúdio desenha o padrão, codifica as regras e entrega uma ferramenta que a equipe do cliente roda sem designer. Sucesso para o site: o visitante entende esse mecanismo em segundos, acredita por causa de um case real e pede um diagnóstico.

## Positioning

**Design, sistema e código na mesma cabeça.** Um designer sênior com 17 anos de marca, UI/UX e motion que também constrói a automação: Python, n8n, Bubble e IA generativa. Um estúdio de design comum entrega peças. Uma software house entrega código sem olho de marca. O 3desenhos entrega a fábrica de peças fiel à marca, com salvaguardas editoriais.

Branding, sites premium com motion e conteúdo/ads com IA continuam no portfólio de serviços. Eles funcionam como porta de entrada e como prova de qualidade visual, mas a mensagem principal é a fábrica.

## Operating Context

- Estúdio operado pelo fundador, Alexandre Oliveira. Base em Itajaí, SC, com atendimento presencial e remoto.
- Entregas típicas: identidade visual e templates, pipelines de geração de peças (PDF/DOCX → PNG/MP4/stories), apps de janela para o operador rodar sem terminal, sites e landing pages, vídeos e ads com IA.
- Ferramentas do estúdio: Figma, Adobe (Photoshop, Illustrator, InDesign, After Effects), Python, n8n, Bubble, WordPress, IA generativa (Higgsfield/Nano Banana, Kling, Veo).

## Capabilities and Constraints

- Idioma do site: português do Brasil. Versão em inglês ainda não decidida.
- Nada de conteúdo inventado: todo número, cliente e depoimento publicado precisa ter fonte real.
- **Em aberto:** faixas de preço/pacotes, canal principal de contato (WhatsApp, formulário ou agenda), domínio, e se o nome do fundador aparece em destaque ou só como assinatura.

## Brand Commitments

- Nome público: **3desenhos** (estúdio). O fundador aparece como diretor criativo, não como marca principal.
- Não existe identidade visual do 3desenhos registrada no projeto. O mundo visual será definido na etapa de criação (new-work), não aqui.

## Evidence on Hand

- **Case CCDP — Sistema de Automação Editorial** (cliente Café com Deus Pai · Editora Vélos). Texto em Drive: `Nova pasta/ale3desenhos/case-automacao-ccdp/case-texto-para-colar.md`; página em `case-automacao-ccdp-PORTATIL.html` e `index.html` na mesma pasta.
  - Três ferramentas em pipeline: PDF → DOCX → PNG/MP4 → stories 1080×1920.
  - 7 idiomas no mesmo fluxo; 1.133 stories gerados; 365 dias/ano × 3 formatos; 0 frases inventadas (por regra).
  - O ganho de "~17 h/mês" está marcado no texto original como estimativa a confirmar. Não publicar como fato até ter o número real.
- **Trajetória do fundador** (currículo em Drive): 17 anos; Designer Manager (Grupo Nelson Heusi), Graphic Design Artist na Lacoste (season books), Bureau Veritas (design de informação), Senior Designer YesBras (padronização de marca em franquias), Motion Designer INBRAEP. Essas marcas são experiência profissional do fundador, não clientes do estúdio 3desenhos. O site deve dizer "experiência com", nunca "clientes".
- Portfólio existente: alexandreaofdesigner.myportfolio.com · Instagram @alexandre.visual.
- **Ausentes, não fabricar:** depoimentos, logos de clientes do estúdio, métricas de faturamento/ROI, prêmios.

## Product Principles

1. **O mecanismo vem antes do catálogo.** O visitante precisa entender a fábrica (padrão → regras → ferramenta → escala) antes de ver a lista de serviços.
2. **Prova real ou nada.** Um case com números verificáveis vale mais que dez promessas; nenhum dado sem fonte.
3. **A marca do cliente é sagrada.** Automação nunca pode trair o padrão visual nem o conteúdo. Salvaguardas fazem parte da oferta.
4. **Entregar autonomia, não dependência.** O cliente sai com uma ferramenta que a equipe dele opera sozinha.
5. **O próprio site é a demonstração.** A execução visual e técnica do site é o primeiro argumento de venda de um estúdio de design.

## Accessibility & Inclusion

Mínimo WCAG 2.2 AA. Respeitar `prefers-reduced-motion`: todo motion com GSAP precisa de alternativa estática, porque o site vai ser rico em animação.
