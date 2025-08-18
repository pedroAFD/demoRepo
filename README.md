# Demo for Nexton!

## Overview

A simple Angular Material app for managing tasks. You can view, sort, filter, create, and edit tasks in a user-friendly interface.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Start the app:
   ```
   ng s -o
   ```
3. Open [http://localhost:4200]in your browser.

4. For testing use 
   ```
    npx ng test --include src/app/components/sidemenu/sidemenu.component.spec.ts
   ```
5. Demo is available at
    ```
    https://pedroafd.github.io/demoRepo/
    ```

## Completed Extensions

1. **State management** — I've used a simple service pattern, since the program was relatively simple to do
2. **Error and empty states** — There's error states handling issues when fields aren't filled and when data doesn't load correctly
3. **AI workflow demo** — GitHub Copilot can speed up the development process by creating the missing routes for Users and settings mentioned in the practice, a lot can be reused from what we have now
**Pros:** Fast prototyping, fewer errors, and more time for design and polish.  
**Cons:** May require review for accuracy and best practices, and sometimes suggests generic or incomplete code.
You can watch the generated component on the src/app/generatedAI/User file. (testing pending)

## TODO

- Add backend/API integration
- Better error handling and notifications
- More advanced filtering and search
- Improved mobile layout
- Add users/settings routes to the sidebar