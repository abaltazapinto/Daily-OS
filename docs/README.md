                Daily OS
                     │
        ┌────────────┼────────────┐
        │            │            │
   Planning      Scheduling    Energy
     Engine         Engine      Engine
        │            │            │
        └────────────┼────────────┘
                     │
              Domain Rules
                     │
          ----------------------
          │                    │
     React Native        Future Web
          │                    │
      Expo App          Desktop App
          │                    │
     Google Calendar      API


Clean architeture - Se o motor de planeamento ficar totalmente independente da interface , no futureo poderas reutiliza lo em:

> Expo
> Web
> Desktop
> CLI
> Agentes de IA
> Integracao com Google Calendar

Daily-OS/
│
├── app/                    ← Expo Router
│
├── src/
│   │
│   ├── domain/             ⭐ coração do projeto
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── services/
│   │   ├── rules/
│   │   └── repositories/
│   │
│   ├── application/
│   │   ├── use-cases/
│   │   ├── dto/
│   │   └── ports/
│   │
│   ├── infrastructure/
│   │   ├── storage/
│   │   ├── calendar/
│   │   └── ai/
│   │
│   ├── presentation/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/
│   │   └── theme/
│   │
│   └── shared/
│       ├── utils/
│       ├── constants/
│       └── types/
│
├── docs/
└── package.json
