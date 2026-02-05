# ⚔️ Gilgamesh

> *"O verdadeiro legado está no impacto que deixamos na comunidade."*

Um scraper de vagas de **estágio em Tecnologia (TI)** desenvolvido em **Node.js + TypeScript**, com foco em arquitetura reutilizável, extensível e organizada para múltiplas plataformas de coleta.

---

## 🎯 Foco do Projeto

Este projeto tem como objetivo facilitar a busca por vagas de **estágio em Tecnologia** em diferentes plataformas. Os filtros são aplicados automaticamente sempre que a plataforma oferece suporte.

---

## 🔧 Plataformas Suportadas

| Plataforma | Estágio | Tecnologia | Observações |
|------------|:-------:|:----------:|-------------|
| **CIEE** | ✅ | ❌ | Tecnologia não é filtrada (limitação da API) |
| **Solides** | ✅ | ✅ | Filtros completos ✅ |
| **Catho** | ❌ | ✅ | Estágio não é filtrado (limitação da plataforma) |

> **Nota:** Aplicamos os filtros disponíveis em cada plataforma. Onde há limitação, retornamos todas as vagas disponíveis e você pode refinar a busca diretamente na plataforma.

---

## 🚀 Como Usar

```bash
npm run dev
```

Siga as instruções interativas no terminal para selecionar:
1. Plataforma(s) de busca
2. Modalidade(s) de contrato
3. Localidade

Os resultados serão exportados automaticamente em arquivos CSV.

---

## ⚠️ Aviso Importante

- **Links podem expirar rapidamente** - As plataformas atualizam suas vagas constantemente
- **Recomendação:** Caso um link não funcione, busque pelo título da vaga diretamente na plataforma
- Este projeto tem finalidade **exclusivamente educacional**
- Respeite os Termos de Serviço das plataformas utilizadas

---

## 🛠️ Tecnologias

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

<img width="1919" height="1008" alt="Interface do terminal Gilgamesh" src="https://github.com/user-attachments/assets/6aeffeae-3acf-42ea-adb7-d51dcc0826e2" />

---

## 📂 Estrutura do Projeto

```
src/
├── actions/              # Interação com o usuário (Inquirer)
├── adapters/            # Mapeamento de dados para formato unificado
├── constants/           # Configurações e regiões suportadas
├── factories/           # Factory Pattern para criação de scrapers
├── infrastructure/      # Implementação de browser (Puppeteer)
├── interfaces/          # TypeScript interfaces e tipos
├── orchestration/        # Orquestração da coleta
├── scrappers/           # Scrapers específicos por plataforma
├── types/               # Definições de tipos TypeScript
└── utils/              # Utilitários (logger, export, errors)
```

---

## 💡 Dicas

- **Nenhuma vaga encontrada?** Tente outras localidades ou horários diferentes
- **Filtros limitados?** Algumas plataformas não oferecem todos os filtros (veja tabela acima)
- **Quer contribuir?** Adapte a arquitetura para novas plataformas seguindo os padrões existentes

---

## 📄 Licença

MIT
