# BAGO APP Functional Enhancements Specification

## 1. Multi-Language Support (Implemented)

### Overview
A robust localization feature allowing users to receive guides in their preferred dialect/language. This is crucial for inclusivity across different regions of the Philippines.

### Technical Specifications
-   **Frontend**: Added a `select` dropdown in `Generator.tsx` with options:
    -   `taglish` (Default - Conversational)
    -   `english` (Formal)
    -   `tagalog` (Pure)
    -   `cebuano` (Visayan)
-   **State Management**: React state `language` passed to API payload.
-   **Backend (API)**: `POST /api/generate` accepts `language` field.
-   **Prompt Engineering**: Dynamic prompt injection based on selection:
    -   *Taglish*: "Use 'Taglish' to be friendly."
    -   *English*: "Use formal English."
    -   *Tagalog*: "Use pure Tagalog."
    -   *Cebuano*: "Use Cebuano (Bisaya)."

### Benefits
-   **Accessibility**: Removes language barriers for non-Tagalog speakers.
-   **Trust**: Users feel more comfortable with familiar dialects.
-   **Accuracy**: "Formal English" option useful for official/legal contexts.

---

## 2. Dark Mode / Theme Customization (Implemented)

### Overview
A toggle switch allowing users to switch between Light and Dark modes. This improves usability in low-light environments and saves battery on OLED screens.

### Technical Specifications
-   **Library**: `next-themes` for persistent theme state (localStorage).
-   **Component**: `ThemeToggle.tsx` uses `useTheme` hook.
-   **UI**: Sun/Moon icon toggle located in the header area.
-   **Tailwind**: Utilizes `dark:` class modifiers across all components for consistent styling.

### Benefits
-   **User Experience**: Reduces eye strain.
-   **Modern Feel**: Standard feature in modern SaaS applications.

---

## 3. Client-Side Analytics Dashboard (Proposed / Future Work)

### Overview
A dashboard to visualize search trends (e.g., "Which agency is most popular?") without requiring a heavy backend database yet.

### Implementation Requirements
-   **Data Source**: `localStorage` ("recentSearches") or a lightweight specialized analytics service (e.g., PostHog).
-   **UI**: A new route `/analytics` with `recharts` for visualization.
-   **Metrics**:
    -   Top Agencies
    -   Peak Search Times
    -   Common Actions (Cloud word)

### Benefits
-   **Business Intelligence**: Understand user needs.
-   **Resource Allocation**: Identify which guides need manual verification based on popularity.

---

## 4. Nearby Office Locator (Proposed / Future Work)

### Overview
Integration with mapping services to show the nearest government office based on the user's location.

### Implementation Requirements
-   **API**: Google Maps API or Mapbox.
-   **Logic**:
    1.  Get user coordinates (Geolocation API).
    2.  Query "Nearest [Agency] office".
    3.  Display results in a list or map view.
-   **Fallback**: Static list of regional offices if API quota is exceeded.

### Benefits
-   **Actionable**: Users don't just get *what* to do, but *where* to go.
-   **Convenience**: One-stop shop for requirements and location.
