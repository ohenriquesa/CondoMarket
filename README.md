# CondoMarket

Sistema de mercado para condomínio, com área de cliente, vendedor e administrador.

## Estrutura

```txt
CondoMarket/
├── backend/     API em Java com Spring Boot
└── frontend/    Interface em React com Vite
```

## Tecnologias

- Backend: Java 17, Spring Boot, Spring Data JPA e H2
- Frontend: React, Vite, JavaScript e CSS

## Como rodar o backend

Abra o CMD dentro da pasta `backend` e rode:

```cmd
cmd /c mvnw.cmd spring-boot:run
```

O backend roda em:

```txt
http://localhost:8080
```

## Como rodar o frontend

Abra o PowerShell dentro da pasta `frontend` e rode:

```powershell
npm install
npm run dev
```

O frontend roda em:

```txt
http://localhost:5173
```

## Usuário administrador

```txt
Email: admin@email.com
Senha: 123456
```
