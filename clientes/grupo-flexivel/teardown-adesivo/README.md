# Teardown · Adesivo Monocomponente (Grupo Flexível)

Simulador 3D da telha termoacústica com o Adesivo Monocomponente, feito com a skill `teardown`. Uma página offline:
o processo (cordões em grade sobre o núcleo → chapa → prensagem com pesos → cura com a umidade do ar) roda sozinho
como tour; o visitante assume com clique, arraste, roda ou teclas (`e` explodir, `i` isolar adesivo, `l` rótulos,
`1`–`4` etapas, espaço pausa). O mesmo código grava o vídeo de 34 s.

Referências: captações FLX-002 do laboratório Flexível, roteiro aprovado do Reels, ilustração de camadas do cliente
e o Guia de Aplicação de Marca Flexível 2026.9 (logo, cores, Titillium Web + IBM Plex Sans). Proporções esquemáticas;
nenhum número de consumo, rendimento ou tempo de cura é afirmado.

| Arquivo | Função |
|---|---|
| `panel.js` | Modelo do processo (uma entrada, `s` de 0 a 19) e geometria do painel |
| `stage.js` | Estúdio, luz, sombras e névoa de umidade |
| `console.js` | Interface na identidade Flexível |
| `main.js` | Roteiro do filme, câmeras, rótulos, cursor e modo ao vivo |
| `score.py` / `timeline.json` | Trilha sincronizada e marcos do filme |

```bash
npm install
```

```bash
node ../../../.claude/skills/teardown/sims/build.mjs .
```

Vídeo (a skill imprime a GPU usada; no PC com placa de vídeo é bem mais rápido):

```bash
node ../../../.claude/skills/teardown/sims/capture.mjs teardown-adesivo --size 1600x900 --dpr 1.2 --out teardown-out/flexivel-adesivo-silent.mp4
```

```bash
python ../../../.claude/skills/teardown/run_sfx.py score.py
```

```bash
ffmpeg -y -i teardown-out/flexivel-adesivo-silent.mp4 -i teardown-out/flexivel-adesivo-score.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart teardown-out/flexivel-adesivo.mp4
```
