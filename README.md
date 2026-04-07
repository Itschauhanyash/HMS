# Hub Management System (HMS) - Putting Workflow

A powerful, responsive Hub Management System (HMS) web application built using **Vanilla HTML, CSS, and JavaScript**. This project focuses on a secure, multi-step "Putting" workflow, precisely replicating modern hub management interfaces.

## 🚀 Key Features

### 1. Secure Authentication
- **Flipkart-Themed Login**: A clean, professional login interface with LDAP credential validation.
- **Inline Error Feedback**: Real-time validation error messages instead of disruptive browser popups.
- **Login Credentials**: 
  - **Username**: `ca.1234`
  - **Password**: `1234`

### 2. Gated Navigation (Facility Selection)
- **Facility Requirement**: After login, users are required to select a facility (e.g., `MotherHub_STV_BTS`) before any other navigation or sidebar options are unlocked.
- **Locked Dashboard**: Prevents accidental data entry in the wrong facility context.
- **Muted Dropdown**: Once a facility is selected, the choice is locked to prevent session-mid changes.

### 3. "Putting" Workflow Logic
- **State-Driven Flow**: Implements the sequence of scanning a Shipment ID, then a Bin/Station ID.
- **Auto-Scan Mode**: Features a smart 1.2s debounce timer that automatically processes scans without needing to press "Enter," significantly speeding up high-volume work.
- **Visual Feedback**: Large, color-coded feedback boxes for success (green) and incorrect scans (red), matching screenshots `1.0.png` through `1.10.png`.
- **Skip/Cancel Option**: Allows users to cancel a current "Put" sequence and return to the main scan screen.

### 4. Premium Navigation & UI
- **Overlay Sidebar**: A sliding navigation panel that overlays the content instead of shifting the UI, ensuring focus remains on the task.
- **Sidebar Organization**: Features all sections from the HMS core including Automated Sorter, Dock Management, Sortation, Labels, and Return Handover.
- **Icon Support**: Each sidebar item follows the exact visual style with `+` icon prefixes.
- **Click-Outside-to-Close**: Intuitive UX that closes the sidebar when clicking anywhere on the main content area.

### 5. Session Security
- **Refresh Protection**: Prevents accidental page reloads that would reset the scanning state, prompting users with a confirmation dialog before leaving.

## 🛠️ Technology Stack
- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 (featuring HSL tailored colors, CSS Grid/Flexbox, and smooth transitions)
- **Logic**: Vanilla JavaScript ES6 (State-management, DOM manipulation, and Event Delegation)

## 📁 Project Structure
- `index.html`: Main entry point and SPA structure.
- `style.css`: Comprehensive design system and layout.
- `app.js`: Core application logic and workflow state.
- `.gitignore`: Configured to exclude internal tool files.

## 📦 Setup Instructions
1. Clone this repository:
   ```bash
   git clone https://github.com/Itschauhanyash/HMS.git
   ```
2. Open `index.html` in any modern web browser.
3. Login using `ca.1234` / `1234`.
4. Select a facility from the header to unlock the system.
5. Click **Put** in the navigation menu to start the putting workflow.

## 🖼️ Reference UI
The application is designed to exactly match the provided screenshots (`1.1.png` - `1.10.png`), ensuring 100% fidelity with the original design specs.

---
Built with ❤️ by Antigravity
