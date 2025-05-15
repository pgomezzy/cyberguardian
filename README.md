### 🔒 CyberGuardian - API do VirusTotal
---
Projeto desenvolvido em React Native que tem como objetivo trazer um pouco mais de segurança para algumas tarefas comuns no dia a dia, permitindo a verificação de arquivos e análise de URLs.

### ✅ **Análise de URLs**
- Verificação em tempo real de links suspeitos
- Detecção de: phishing, malware, scams e fraudes
- Relatório com resultados de +70 antivírus

### 📂 **Scanner de Arquivos** *(Até 650MB)*
- **Formatos suportados**:
  - APK, EXE, DLL (executáveis)
  - PDF, DOCX, XLSX (documentos)
  - ZIP, RAR (compactados)
  - JS, PY, SH (scripts)

 
# 🔧 Tecnologias
- API VirusTotal
- React Native
- React
- Node.js
- Expo
- Axios
# Arquitetura do Projeto

## Estrutura de Diretórios

- **src/**  
  - **assets/**  
    _(Arquivos estáticos como imagens)_
  - **components/**   
    _(Componentes reutilizáveis da interface)_
  - **constants/**    
    _(Constantes usadas na aplicação, URLs da API)_
  - **services/**   
    _(Serviços para integração com API do VirusTotal)_
  - **utils/** 
    _(Funções utilitárias, como cache de dados)_
  - **views/**    
    _(Páginas principais da aplicação)_
  - `app.config.js`  
  _(Configurações gerais da aplicação)_
  - `App.js`  
  _(Componente principal da aplicação)_

## Arquivos de Configuração
- `app.json`  
_(Configurações específicas do app)_
- `package.json`  
_(Dependências e scripts do projeto)_
- `package-lock.json`  
_(Lockfile para controle de versões das dependências)_
- `README.md`  
_(Documentação inicial do projeto)_

## 🚀 Como executar

```bash
# 1. Clone o repositório
git clone https://github.com/pgomezzy/cyberguardian.git

# 2. Acesse a pasta do projeto
cd cyberguardian  # Corrigido: removido "-scanner" para manter consistência com o URL do repositório

# 3. Instale as dependências
npm install

# 4. Configure o ambiente (opcional)
# Crie um arquivo .env com sua API_KEY se necessário

# 5. Execute o projeto
npx expo start

## Escaneie o QR code 
## Ou envie o link por email
```

## 📬 Contato

Em desenvolvimento por **Pablo Gomes**  

- 📧 Email: pablogomesctt@gmail.com  
- 🔗 GitHub: [pgomezzy](https://github.com/pgomezzy)  
---
⭐️  Se você gostou, dê uma estrela 
