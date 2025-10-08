# Auth + OTP (React + Vite)

Демо двухэтапной авторизации: Email/Password → 6-значный OTP.  
API замокано через TanStack Query. Время действия OTP настраивается через Zustand. UI-компоненты в стиле shadcn/ui (
`Button`, `Input`, `InputOTP`).

---

## Обзор

- Шаг 1: форма **Sign in** (email + password).
- Шаг 2: **Enter code** (6 цифр, авто-сабмит при 6 символах, если код не просрочен).
- Таймер истечения кода (по умолчанию **20 c**). По истечении — «Code expired» и кнопка **Get new** (ресенд мок + сброс
  таймера).
- Панель **Scenarios** (левый верхний угол, absolute): быстрый доступ к тестовым сценариям и полю **OTP expiry (seconds)
  **.

---

## Стек

- **React 18**, **TypeScript**, **Vite**
- **Tailwind CSS**
- **@tanstack/react-query** (+ Devtools)
- **react-hook-form** + **zod**
- **Zustand** (таймер истечения OTP)
- Компоненты в стиле **shadcn/ui**: `Button`, `Input`, `InputOTP`  
  (под капотом `input-otp` для рендеринга слотов)

---

## Возможности

- **Sign in**:
    - Валидация на клиенте (`zod`).
    - Кнопка **Log in** заблокирована, если поля пустые или идёт запрос.
    - Обработка всех веток ошибок: `401/403/422/429/503/Network`.
- **OTP**:
    - 6 слотов, **растягиваются на всю ширину контейнера**, зазоры `12px`.
    - **Автосабмит** при 6 цифрах (если код не просрочен).
    - Сообщение **«Enter 6 digits» не показывается** до ввода 6 символов.
    - При истечении срока — «Code expired» + **Get new** (ресенд мок).
    - Кнопка **Back** — возврат к форме логина.
- **Dev Panel (Scenarios)**:
    - Список тестовых e-mail для сценариев.
    - Поле **OTP expiry (seconds)** — изменение `expirySec` в Zustand на лету (5–300 c).

---

## Как проверять (сценарии)

- **Sign in:**

    - Успешно: user@example.com / Password1!

    - rate@user.com → 429 Too many attempts

    - maint@user.com → 503 Maintenance

    - blocked@user.com → 403 Account is blocked

    - unverified@user.com → 403 Please verify email

    - 422@user.com → 422 ошибки под полями

    - Иное → 401 Invalid email or password

- **Enter code:**

    - Валидный OTP: 123456

    - Любой другой 6-значный → «Invalid code»

    - По истечении таймера → «Code expired» + Get new

- **Конфигурация**

    - Время действия кода по умолчанию: src/shared/store/otp.ts → expirySec: 20
    - Можно менять в Dev Panel (Scenarios) в диапазоне 5–300 сек.

    - Ресенд (мок): mockResendOtp (токен не меняется; сбрасывается таймер и поле ввода).

    - Валидный код: src/shared/api/mock.ts → const okOtp = '123456'.