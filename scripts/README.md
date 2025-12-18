# Scripts

## Protect Main Branch

Защищает ветку `main` от прямых пушей. Только через Pull Request можно мерджить в main.

### Использование:

```bash
# Вариант 1: Передать токен как аргумент
./scripts/protect-main-branch.sh YOUR_GITHUB_TOKEN

# Вариант 2: Использовать переменную окружения
export GITHUB_TOKEN=your_token_here
./scripts/protect-main-branch.sh
```

### Как получить GitHub Token:

1. Перейдите в GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Создайте новый токен с правами `repo`
3. Скопируйте токен и используйте в скрипте

### Альтернативный способ (через веб-интерфейс):

1. Перейдите в репозиторий: https://github.com/khudyakv/vue-wave-player
2. Settings → Branches
3. Add rule для ветки `main`
4. Включите:
   - ✅ Require a pull request before merging
   - ✅ Do not allow bypassing the above settings
5. Save changes



