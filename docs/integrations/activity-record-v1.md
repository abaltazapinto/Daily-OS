# Integração de atividade física — proposta v1

## Repositórios
- Planeamento: [Organizar_dia_Make_it_stick](https://github.com/abaltazapinto/Organizar_dia_Make_it_stick) (privado, Codex/Claude ativos).
- Interface web: Daily-OS (público).
- Registo de saúde: personal-health-records (privado).

**Esta proposta não ativa sincronização** e não altera modelos ou funcionalidades em produção. O contrato completo e as regras de proveniência estão no repositório privado `personal-health-records/docs/integrations/activity-record-v1.md`.

## Fluxo desejado
1. Utilizador planeia uma atividade.
2. Utilizador confirma que a realizou.
3. Um adaptador autenticado valida e sincroniza um evento com ID idempotente para o arquivo privado.
4. A UI mostra `Atividade física feita` quando existe pelo menos uma atividade concluída nesse dia local.

O estado é **derivado dos eventos concluídos**, nunca de um checkbox autónomo ou de uma atividade apenas planeada.

## Dados públicos vs privados
A aplicação pode mostrar um indicador de conclusão ao próprio utilizador, mas não deve publicar dados pessoais de saúde no repositório público nem guardar credenciais GitHub no cliente. O acesso ao arquivo privado exige backend autenticado e autorização explícita.

## Próximos passos
- Verificar modelos, tarefas e eventos já existentes nas aplicações, sobretudo no `Organizar_dia_Make_it_stick` onde outros agentes trabalham.
- Implementar adaptadores sem criar uma segunda fonte de verdade.
- Testar estados, dias locais, duplicação e segurança antes de ativar sincronização.
