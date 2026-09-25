---
title: "Flutter Clean Architecture Combination Pattern Style YoClean"
publishedAt: "2025-09-28"
summary: "Clean Architecture with GetX (DDD-style), adhering strictly to SOLID principles and testability. A Flutter project implementing Clean Architecture with GetX, following SOLID and Onion principles (Domain-Driven), with clear separation of Data, Domain, and Presentation layers."
---

## Refactor ☕

this concept is Combination pattern style between Kauê and Arktekko thats i applied on open source project by mani53-dev. For a detailed explanation, check out the Medium article: [Implementing Clean Architecture with GetX and MVVM in Flutter](https://medium.com/@manikhan53/implementing-clean-architecture-with-getx-and-mvvm-in-flutter-adhering-to-solid-principles-8487994b993a). write by the owner of code starterpack thats i modified.

## Purpose & Why ☕

The goals make the project code is testability, more clean, and readable easy scaleable and maintained.

## 🕵🏼‍♂️ Before After 💡

### BEFORE

Clean Architecture using GetX and MVVM, adhering to SOLID principles. project follows a structured approach to building scalable Flutter applications with GetX for state management and dependency injection. It implements Clean Architecture to separate concerns and improve maintainability.

- **GetX for State Management**
- **MVVM Architecture**
- **Dio for API Calls**
- **Interceptor for API Authorization**
- **Caching with DioCacheInterceptor**
- **Shared Preferences for Local Storage**
- **SOLID Principles Implementation**

## 📂 Project Structure (BEFORE Modified)

```
lib/
│
├── common/                # Shared utilities, themes, constants
│
├── app/
│   ├── exceptions/        # Custom exception handling
│   ├── global_widgets/    # Reusable UI components
│   ├── middlewares/       # Route guards and middlewares
│   ├── models/            # Entity definitions (business models)
│   ├── modules/           # Feature-based segregation
│   │   ├── auth/
│   │   │   ├── bindings/      # Dependency bindings
│   │   │   ├── controllers/   # State management using GetX
│   │   │   ├── services/      # Business logic and use cases
│   │   │   ├── views/         # UI components
│   │   │   ├── widgets/       # Reusable widgets on module level
│   │   ├── dashboard/
│   │   ├── root/          # Root navigation & app entry point
│   ├── providers/         # API services and data sources
│   ├── routes/            # Navigation and route management
│   ├── services/          # Global services (e.g., Auth, Storage)
│
├── main.dart              # Application entry point
```

### AFTER

Clean Architecture with GetX (DDD-style), adhering strictly to SOLID principles and testability. A Flutter project implementing Clean Architecture with GetX, following SOLID and Onion principles (Domain-Driven), with clear separation of Data, Domain, and Presentation layers.

## 📂 Project Structure (AFTER Modified)

```
lib/
│
├── common/                   # Shared utilities, themes, constants (colors, styles, helpers)
│
├── app/
│   ├── exceptions/            # Custom exception classes (e.g., AuthException, NetworkException)
│   ├── global_widgets/        # Reusable UI widgets used across modules (e.g., Button, TextField)
│   ├── middlewares/           # GetX middlewares (auth guard, onboarding guard, etc.)
│   ├── models/                # Pure business models/entities (domain-level extends, yes/no JSON here depends on requirement, mapping)
│   ├── modules/               # Feature-based separation (DDD style)
│   │   ├── auth/              # Authentication module
│   │   │   ├── bindings/          # Dependency Injection for controllers & usecases
│   │   │   ├── data/              # Data layer (API, DB, RepositoryImpl, DTOs)
│   │   │   │   ├── datasources/       # Remote/local sources (e.g., AuthRemoteDataSource)
│   │   │   │   ├── dto/               # Data Transfer Objects (login_result_dto.dart)
│   │   │   │   ├── payload/           # Request payloads (login_payload.dart)
│   │   │   │   └── repositories/      # Repository implementations
│   │   │   ├── domain/            # Domain layer (rules, contracts)
│   │   │   │   ├── entities/          # Business entities (User, no JSON here)
│   │   │   │   ├── repositories/      # Repository interfaces (AuthRepository)
│   │   │   │   └── usecase/           # Use cases (LoginUseCase, RegisterUseCase)
│   │   │   ├── presentation/     # Presentation layer
│   │   │   │   ├── controllers/  # GetX Controllers (LoginController, RegisterController)
│   │   │   │   ├── views/        # UI screens (LoginView, RegisterView)
│   │   │   │   └── widgets/      # Module-specific reusable widgets (LoginForm, RegisterForm)
│   │   │   ├── services/          # Local business services (optional helpers, e.g., AggregateService)
│   │   │   ├── controllers/       # GetX Controllers (LoginController, RegisterController)
│   │   │   ├── views/             # UI screens (LoginView, RegisterView)
│   │   ├── dashboard/         # Example: Dashboard module with same structure
│   │   └── root/              # Root module (main navigation, splash, app entry)
│   │
│   ├── providers/             # Global API clients, interceptors, and HTTP providers
│   ├── routes/                # App routes & navigation configuration
│   ├── services/              # App-wide services (LocalStorageService, UserService, NotificationService, CrashReportingService)
│
├── main.dart                  # Application entry point (init DI, runApp, setup services)
│
integration_test/          # Full app flows (needs device/emulator)
│   └── login_flow_test.dart   # E2E test for login journey
test/                      # Unit & widget tests (run in memory, fast)
│
├── unit/                  # Business logic only (no UI, no Flutter engine)
│   └── login_usecase_test.dart   # Tests domain logic of login usecase
│
└── widget/                # UI components in isolation (with fake dependencies)
    └── login_view_test.dart     # Tests rendering & interactions of login view

```

## 🚦 Comparison Overview (Testability)

| Folder            | Runs On         | Scope                 | Speed  | Example                |
| ----------------- | --------------- | --------------------- | ------ | ---------------------- |
| integration_test/ | Emulator/Device | Full app flows        | Slow   | Login end-to-end       |
| test/unit/        | Dart VM         | Single class/function | Fast   | UseCase logic          |
| test/widget/      | Dart VM         | Widget in isolation   | Medium | LoginView UI rendering |

## 🔄 Alur Data (contoh login flow)

```jsx
[ UI Layer ]               [ Domain Layer ]                [ Data Layer ]              [ External ]
┌───────────────┐        ┌──────────────────┐           ┌─────────────────┐        ┌───────────────┐
│ LoginView     │        │ LoginUseCase     │           │ AuthRepository  │        │ API / Storage │
│ (presentation)│◀──────▶│ (business logic) │◀────────▶│ Impl            │◀──────▶│ (Dio / DB)    │
└───────────────┘        └──────────────────┘           └─────────────────┘        └───────────────┘
        ▲                          ▲                           ▲
        │                          │                           │
        │                          │                           │
┌───────────────┐        ┌──────────────────┐           ┌─────────────────┐
│ LoginController│        │ AuthRepository   │           │ DataSources     │
│ (GetX State)   │◀──────▶│ (interface)      │◀────────▶│ Remote/Local    │
└───────────────┘        └──────────────────┘           └─────────────────┘
```

---

### 📌 Penjelasan Flow

1. **User input di UI**

   - User isi email & password di `LoginView`.
   - `LoginController` (state management) handle event tombol login.

2. **Controller memanggil UseCase**

   - `controller.login()` → panggil `LoginUseCase.execute(LoginPayload)`.

3. **UseCase panggil Repository Interface**

   - `LoginUseCase` butuh kontrak dari `AuthRepository`.
   - Interface ini ada di **domain/repositories/**.

4. **Repository Impl (Data Layer)**

   - `AuthRepositoryImpl` (di `data/repositories/`) implement interface tadi.
   - Dia yang menentukan data diambil dari **RemoteDataSource** (API) atau **LocalDataSource** (cache).

5. **Datasource**

   - `AuthRemoteDataSource` → call API pakai `DioProvider`.
   - `AuthLocalDataSource` → simpan ambil token di `SharedPreferences/Hive`.

6. **Balik ke atas**

   - Response API → diubah ke **DTO** → di-mapping ke **Entity**.
   - Entity dikirim ke UseCase → Controller → update `Rx<User>` → UI otomatis refresh (`Obx`).

---

### 🧩 Layer Responsibility

- **UI (Presentation)** = Tampilan & interaksi user.
- **Controller (GetX)** = State & event handler.
- **Domain (Entities & UseCase)** = Business logic murni.
- **Repository Interface** = Kontrak data.
- **Repository Impl** = Bridge antara Domain ↔ Data.
- **DataSource** = Tempat asli ambil data (API, DB, cache).

---

```jsx
flowchart TD
    A[LoginView<br>(UI Layer)] --> B[LoginController<br>(GetX State)]
    B --> C[LoginUseCase<br>(Domain)]
    C --> D[AuthRepository<br>(Interface)]
    D --> E[AuthRepositoryImpl<br>(Data Layer)]
    E --> F1[AuthRemoteDataSource<br>(API)]
    E --> F2[AuthLocalDataSource<br>(Storage)]
    F1 --> G[External API<br>(Dio/HTTP)]
    F2 --> H[Local Storage<br>(SharedPref/Hive)]

    %% Return flow
    G --> F1
    H --> F2
    F1 --> E
    F2 --> E
    E --> D
    D --> C
    C --> B
    B --> A
```

---

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/R6R3LMURG)

Thanks for being here 🙌
Stay sharp, ship clean code, and don’t forget to take a break.

– just for eat developer 🍽️ 👨‍🍳 🍕

---

I’ll be publishing an open-source project soon! I’ll also clean up the old code and put it in the navigation menu under Open Source Projects. Stay tune https://github.com/yogithesymbian

## Source Also From

### 📖 Referensi

- Uncle Bob-Clean Architecture (2012) → Entities ada di paling dalam, paling stabil, bebas framework.
- ResoCoder-Flutter TDD Clean Architecture Course → implementasi di Flutter yang populer.
- Very Good Ventures (VGV)-Flutter Best Practices → banyak dipakai buat production apps.
- Stacked architecture (FilledStacks) → agak mirip tapi lebih pragmatis.

---

- from www.yogiveloper.com
- old blog https://scodeid.blogspot.com/
