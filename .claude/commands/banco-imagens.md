---
description: Gera um banco de 30 variações 2K 16:9 a partir de uma imagem de referência da pasta, mantendo o DNA visual.
argument-hint: "[caminho da imagem de referência — opcional]"
---

# Banco de imagens a partir de uma referência

Referência: $ARGUMENTS (se vazio, encontre a imagem de referência dentro da pasta atual; se houver mais de uma candidata, pergunte qual usar).

Crie **30 variações** a partir dessa imagem, alterando **personagens, roupas e cenários**, mas mantendo as principais características visuais da original:

- estilo
- composição
- iluminação
- atmosfera
- enquadramento
- linguagem estética

Regras de geração:

- Todas as imagens em **2K, formato 16:9**.
- Em **cada** geração, envie a imagem de referência junto com o respectivo prompt, para garantir consistência visual entre as variações.
- Escreva um prompt distinto por variação (em inglês), variando só personagem/roupa/cenário; o bloco de estilo, luz e enquadramento é idêntico em todos.
- Crie uma pasta `output/` e salve todos os resultados nela, numerados (`01.png` … `30.png`), junto com um `prompts.md` listando o prompt de cada uma.

Motor de geração: Higgsfield CLI com Nano Banana 2 (`higgsfield generate create nano_banana_flash --image <ref> --aspect_ratio 16:9 --resolution 2k`). Se a CLI não estiver logada (`higgsfield account status`), pare e peça pro usuário rodar `higgsfield auth login`. Gere em paralelo, em lotes, e ao final reporte quantas foram geradas e quais falharam.
