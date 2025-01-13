# Dokumentacja Projektu

## Konfiguracja Projektu

Aby skonfigurować projekt, wykonaj następujące kroki:

1. Sklonuj repozytorium:
    ```sh
    git clone https://github.com/lythx/wdai-projekt.git
    ```
2. Przejdź do katalogu `back` i zainstaluj zależności:
    ```sh
    cd back
    npm install
    ```
3. Uruchom serwer backend:
    ```sh
    npm start
    ```
4. Przejdź do katalogu `front` i zainstaluj zależności:
    ```sh
    cd ../front
    npm install
    ```
5. Uruchom serwer deweloperski frontend:
    ```sh
    npm run dev
    ```

## Użyta Technologia i Biblioteki

### Backend
- **Node.js**: Środowisko uruchomieniowe JavaScript
- **Express**: Framework webowy dla Node.js
- **Sequelize**: ORM dla baz danych SQL
- **SQLite**: Baza danych
- **jsonwebtoken**: Obsługa tokenów JWT
- **cors**: Middleware do obsługi CORS

### Frontend
- **Next.js**: Framework React do renderowania po stronie serwera
- **React**: Biblioteka JavaScript do budowy interfejsów użytkownika
- **Material-UI**: Komponenty React
- **TypeScript**: Typowany JS

## Opis Funkcjonalności

- Autoryzacja użytkowników (rejestracja, logowanie, wylogowanie)
- Lista produktów i filtrowanie
- Zarządzanie koszykiem
- Historia zamówień
- Przełącznik trybu ciemnego
- Dodawanie i wyświetlanie opinii

## Autorzy

- **Szymon Żuk**: [Profil GitHub](https://github.com/lythx)
- **Dawid Żak**: [Profil GitHub](https://github.com/depebul)

## Projekt Opublikowany na Git

Projekt jest opublikowany na GitHubie. Repozytorium można znaleźć tutaj. [Repo](https://github.com/lythx/wdai-projekt)
