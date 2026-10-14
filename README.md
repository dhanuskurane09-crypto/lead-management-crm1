# LeadFlow CRM – Lead Management System

A modern, responsive Lead Management CRM built using React and Vite to help manage business leads, track their progress, and monitor sales performance from a single dashboard.

## 📌 Project Overview

LeadFlow CRM is a web-based application designed to simplify lead management. Users can add new leads, update existing lead information, track lead statuses, search and filter records, and view a summary of business performance.

The application uses browser LocalStorage to preserve lead information across page refreshes without requiring a backend server or database.

## ✨ Features

### 1. Dashboard

- View an overview of lead management activities.
- Display summary cards for lead statistics.
- Monitor leads by status.
- Access lead management sections from the dashboard.

### 2. Lead Management

- Add new leads.
- View lead information in a structured table.
- Edit and update existing leads.
- Delete leads with confirmation.
- Manage lead details such as name, email, company, job title, source, and status.

### 3. Lead Status Tracking

Track leads through the following stages:

- New
- Contacted
- Qualified
- Converted
- Disqualified

### 4. Search and Filters

- Search leads by name, email, or company.
- Filter leads by status.
- Filter leads by source.
- Combine search and filters to find specific records.

### 5. Form Validation

- Validate required fields.
- Validate email addresses.
- Check for duplicate email addresses.
- Display appropriate validation messages.

### 6. Pagination

- Display leads across multiple pages.
- Navigate between pages of lead records.
- Make large lead lists easier to manage.

### 7. Data Persistence

- Save lead records in browser LocalStorage.
- Restore saved records after refreshing the page.
- Maintain lead data between browser sessions on the same browser and origin.

### 8. Responsive Design

- Adapt the interface for desktop, tablet, and mobile screens.
- Provide a more convenient layout for smaller devices.

## 🛠️ Technology Stack

| Technology           | Purpose                             |
| -------------------- | ----------------------------------- |
| React                | Building the user interface         |
| JavaScript (ES6+)    | Application logic and functionality |
| Vite                 | Development server and build tool   |
| HTML5                | Application structure               |
| CSS3                 | Styling and responsive layout       |
| Browser LocalStorage | Client-side data persistence        |
| Git                  | Version control                     |
| GitHub               | Source code hosting                 |

## 📂 Project Structure

```text
lead-management-crm1/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```


## ⚙️ Installation and Setup

### Prerequisites

Install the following software before running the project:

- Node.js
- npm
- Visual Studio Code (recommended)
- A modern web browser

### Step 1: Clone the Repository

```bash
git clone https://github.com/dhanuskurane09-crypto/lead-management-crm1.git

```

### Step 2: Navigate to the Project Folder

```bash
cd lead-management-crm1
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Development Server

```bash
npm run dev
```

### Step 5: Open the Application

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173/
```

## 📱 Running the Application on a Mobile Device

To test the application on a phone:

1. Connect the laptop and phone to the same network that permits communication between devices.
2. Start the Vite server with:

   ```bash
   npm run dev -- --host 0.0.0.0
   ```

3. Find the laptop's current IPv4 address using:

   ```bash
   ipconfig
   ```

4. Open Chrome on the phone and enter:

   ```text
   http://YOUR_LAPTOP_IP:5173/
   ```

Replace `YOUR_LAPTOP_IP` with the laptop's current IPv4 address. Windows Firewall or hotspot restrictions may prevent access.

## 💾 Data Storage

This project uses browser LocalStorage to save lead information.

**Important:** LocalStorage is browser-specific and is not a shared database. Data is not automatically synchronized between different devices or browsers. Clearing browser data may remove saved records.

## 🧪 Testing Checklist

- [ ] Dashboard loads successfully.
- [ ] New leads can be added.
- [ ] Existing leads can be edited.
- [ ] Leads can be deleted.
- [ ] Form validation works correctly.
- [ ] Duplicate email addresses are handled.
- [ ] Search and filters work together.
- [ ] Pagination works correctly.
- [ ] Lead information remains after refreshing the page.
- [ ] The layout works on different screen sizes.

## 🚀 Future Enhancements

- Backend API integration.
- Database integration using MongoDB or MySQL.
- User authentication and role-based access.
- Cloud-based data synchronization.
- Email and follow-up reminders.
- Advanced analytics and reporting.

## 🔒 Limitations

- The current application stores data locally in the browser.
- There is no shared server-side database.
- Data is not synchronized between multiple users or devices.
- Access to the development server from a phone depends on network and firewall settings.

## 👩‍💻 Author

**Project:** LeadFlow CRM – Lead Management System

**Type:** React Mini CRM Project

**Purpose:** To manage business leads efficiently and demonstrate front-end development, CRUD operations, form validation, data persistence, and responsive design.

## 📄 License

This project was developed for learning and project demonstration purposes.
