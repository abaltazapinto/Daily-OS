29-08-26

Uma ideia que me lembrei sera conseguirgerar uma pagina ou algo que sera importante ter realizado como hojew acabei de compreender e fazer um exercicio de leetCode e achava genial ter algum check mark para finalmente entender que consegui acabar esse feito. 

22-10-26

O que eu faria primeiro
Não tentava integrar tudo de uma vez. Criava uma fonte de contexto fixa tua dentro do Daily-OS, por exemplo:
UserScheduleContext

com coisas como:

Trabalho:
segunda–sexta
horário habitual

Mestrado:
dias/horários das aulas

Rotinas:
gym
corrida

Deslocações:
casa → ISEP de bicicleta
casa → gym
run location → ISEP

Preferências:
tempo mínimo de almoço
buffer antes das aulas
máximo de blocos longos consecutivos

# ROADMAP 

v0.1 ✅
AI DailyPlan

v0.2
Persistent personal schedule/context

v0.3
Read Google Calendar

v0.4
Read academic context from GitHub repo

v0.5
Context-aware planner

v0.6
Review → export selected blocks to Google Calendar

v0.7
Conflict detection / rescheduling

## 22-10-2026 — Daily execution history and adaptive planning

### Idea

Daily-OS should not only generate a DailyPlan.

It should also record what actually happened during the day and compare:

Plan
→ Execution
→ Result
→ Historical patterns
→ Better future planning

### Possible concepts

- DailyPlan
- DailyExecution
- Achievement
- DailyReflection
- HistoricalPlanningMetrics

### Example

Planned:
- COMCS 90 min
- Gym 60 min
- RTESY 75 min

Actual:
- COMCS 50 min
- Gym completed
- RTESY 35 min

Daily-OS could learn patterns such as:
- 50-minute focus blocks have a higher completion rate than 90-minute blocks
- some study periods are frequently skipped
- travel times differ from planned estimates
- certain routines are consistently completed

### Future feedback loop

PlanningContext
→ DailyPlanner
→ DailyPlan
→ Execution tracking
→ DailyExecution
→ Historical data
→ Insights / adaptation
→ improved PlanningContext

### Achievements

Keep meaningful accomplishments permanently instead of treating them as completed tasks.

Examples:
- First LeetCode problem fully understood
- Completed RTESY lab independently
- Finished COMCS assignment
- Joined UAS
- Daily-OS deployed

### Architectural note

Google Calendar should not be the primary database for this history.

Daily-OS should own its historical planning/execution data and use Google Calendar as an external source and synchronization/export target.

### Status

IDEA — do not implement yet.

Current priority:
#43 Inject planning context into DailyPlanner.
