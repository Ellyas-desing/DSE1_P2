# Segurança e estrutura do banco (Realtime Database)

## 1. Publicar as regras
Console → Build → Realtime Database → aba **Regras** → cole o conteúdo de
`database.rules.json` → **Publicar**.

## 2. Estrutura dos dados
```
users/{uid}/
    profile: { name, email }        <- o próprio usuário grava (no cadastro)
    devices/{deviceUid}: true       <- só você, pelo console, vincula

sensores/{deviceUid}/
    owner: "{uid do dono}"          <- só você, pelo console
    ultima: { t, ...campos }        <- o ESP32 sobrescreve
    historico/{pushId}: { t, ... }  <- o ESP32 só acrescenta (não edita/apaga)
```
`t` = horário da leitura em milissegundos (número).

## 3. Quem pode o quê
| Quem | Lê | Escreve |
|---|---|---|
| Usuário logado | só `users/{seu uid}` e `sensores/{dispositivo}` onde `owner` é ele | só `users/{seu uid}/profile` |
| ESP32 (conta própria) | nada | só `ultima` e `historico` do próprio `deviceUid` |
| Visitante sem login | nada | nada |

Nenhum usuário consegue listar nem abrir dados de outro: não há leitura na raiz
nem em `users` ou `sensores` inteiros, só em cada nó individual.

## 4. Vincular um dispositivo a um usuário (manual, pelo console)
1. **Authentication → Users → Adicionar usuário**: crie uma conta para o ESP32
   (ex.: `esp32-sala@dse.local` + senha forte). Copie o **UID** dela (`deviceUid`).
2. Pegue o **UID do usuário dono** (Authentication → Users).
3. No Realtime Database, crie:
   - `sensores/{deviceUid}/owner` = UID do dono
   - `users/{UID do dono}/devices/{deviceUid}` = `true`

Os clientes (site) não conseguem criar nem alterar esses vínculos; só você.

## 5. Observações
- Firestore e Storage, se estiverem ativados, têm regras próprias: deixe-os
  bloqueados (modo produção) enquanto não forem usados.
- Um usuário sem nenhum dispositivo vinculado não vê nenhum dado de sensor.
