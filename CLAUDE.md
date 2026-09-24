# 3desenhos

Estúdio de design, branding, web e automação. Este repositório concentra o kit de skills, agents e prompts do estúdio, curado a partir da pasta "Nova pasta" do Drive, para que qualquer sessão do Claude Code (local ou na nuvem) já abra com as ferramentas certas.

## Como trabalhar aqui

- Idioma padrão: português do Brasil. Prompts para geradores de imagem/vídeo vão em inglês.
- Estética é requisito, não enfeite: toda interface passa pelo `impeccable` antes de ser dada como pronta.
- Decisão de negócio, preço, oferta ou posicionamento → delegue ao agent `ceo-estrategista` antes de executar.
- Saídas de geração (imagens, takes, vídeos) vão em `output/` e não são versionadas.

## Mapa do kit

### Skills (`.claude/skills/`)

| Quando | Skill | Origem |
|---|---|---|
| Criar, revisar ou polir qualquer UI/landing page (`/impeccable shape`, `audit`, `critique`, `polish`, `bolder`, `animate`…) | `impeccable` | pbakaus/impeccable (Apache-2.0) |
| Animação web com GSAP: tweens, timelines, ScrollTrigger, plugins, React, performance | `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-frameworks`, `gsap-performance` | greensock/gsap-skills (MIT) |
| Foto amadora de produto → ad vertical 15s cinematográfico (Higgsfield + Kling + ffmpeg) | `product-ad-cinema` | Agent Lab |
| Roteiro de Reel com tom extraído de um Instagram de referência + hashtags + trilhas | `reel-roteiro` | Agent Lab |
| Estressar um plano/ideia com perguntas duras (gatilho: "grill") | `grilling` | mattpocock/skills (MIT) |
| Protótipo descartável para validar lógica ou UI | `prototype` | mattpocock/skills |
| Bug difícil ou regressão de performance | `diagnosing-bugs` | mattpocock/skills |
| Feature ou correção guiada por testes | `tdd` | mattpocock/skills |
| Pesquisa em fontes primárias salva em Markdown | `research` | mattpocock/skills |
| Passar o contexto para outra sessão/agente (só via `/handoff`) | `handoff` | mattpocock/skills |

### Agents (`.claude/agents/`)

| Agent | Uso |
|---|---|
| `ceo-estrategista` | Estratégia: veredito honesto + plano tático para negócio, preço, oferta e posicionamento |
| `marketing-agent` | Execução: campanhas, copy de landing/e-mail/social/ads, calendário de conteúdo |
| `seo-specialist` | Auditoria técnica de SEO, schema, Core Web Vitals |
| `impeccable-*` (4) | Subagentes internos do impeccable (documenter, finish-reviewer, asset-producer, manual-edit-applier) |

`marketing-agent` e `seo-specialist` vêm de affaan-m/everything-claude-code (MIT).

### Sem duplicar o que já é nativo

Para estas tarefas, use a ferramenta nativa do Claude Code, não crie agent/skill próprio:

| Tarefa | Use |
|---|---|
| Revisão de código | `/code-review` |
| Revisão de segurança | `/security-review` |
| Plano de implementação | agent nativo `Plan` |
| Acessibilidade e performance de UI | `/impeccable audit` e `/impeccable optimize` |
| Performance de animação | `gsap-performance` |
| Criar ou editar skills | `skill-creator` |

### Comandos (`.claude/commands/`)

- `/banco-imagens [ref]` — 30 variações 2K 16:9 a partir de uma imagem de referência.
- `/briefing-motion [marca] [objetivo]` — briefing de comercial em motion, cena a cena.

## Dependências externas

- `impeccable`: o launcher baixa o próprio binário na primeira execução (`.claude/skills/impeccable/scripts/impeccable context`).
- `product-ad-cinema` e `/banco-imagens`: Higgsfield CLI logada (`higgsfield auth login`), `ffmpeg` e `jq`.
- `reel-roteiro`: WebSearch/WebFetch; para Instagram, um browser (Playwright/Claude in Chrome) funciona melhor.
