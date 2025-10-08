
# Ситим

## Установка зависимостей

```bash
npm install
```

## Prebuild Expo

```bash
npx expo prebuild
```

## Открытие проекта в Xcode

```bash
cd ios
xed .
```

## Подключение iPhone и настройка Xcode

1. Подключите iPhone к Mac через кабель.
2. В Xcode выберите ваш телефон как **Target**.
3. Перейдите в **Signing & Capabilities** → **Team** → **Add an Account**.
4. Войдите с помощью Apple ID.
5. В верхнем меню выберите `sitimtest` → **Edit Scheme** → **Build Configuration** → **Release**.

## Сборка и запуск

- Нажмите на иконку **Play** в Xcode для сборки и запуска приложения на устройстве.
