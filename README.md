# 🐞 BugFinder

### Bug Bounty Management & Vulnerability Reporting Platform

BugFinder is a modern webbased Bug Bounty Management Platform, connecting security researchers with companies. Researchers can find active bug bounty programs and report their vulnerability findings while companies can set-up programs, review reports, manage submissions and set rewards

The platform also features administrator dashboard for managing users, programs, reports, and platform statistics.

> Note: This is a FRONTEND/DEMO implementation. We use `localStorage` to store all the data for the time being. The MongoDB service layer is structured in such a way that it can be replaced with any real backend/database implementation.
---

## ✨ Features

### 🛡️ Security Researchers / Hackers

Create a researcher account.
Login to the application's UI securely

Find active bug bounty programs

Search across bug bounty programs
See program scope and out-of-scope targets
See rewards associated with a program
Report vulnerability findings
Set a report severity level:
🟢 Low
🟡 Medium
🟠 High
🔴 Critical
Add:
Vulnerability title
Description
Steps to reproduce
Security impact
Track your reported vulnerability reports
View your report status
View rewards
Discuss reports with comments
---
### 🏢 Companies
Companies can create bug bounty programs.
The company dashboard features:
Register companies
Company dashboard
Create company bug bounty programs
Description
In-scope assets
Out-of-scope assets
Define rewards: (By severity)
Set program status: `draft`, `active`, `paused`, `closed`
View submitted reports
Review vulnerability reports
Update report status
Assign bounty rewards
Comments: communicate with security researchers
---
### 👨‍💼 Administrator
This dashboard manages:
Statistics
Users
Programs
Reports
Administrators can:
View platform statistics
Manages users
Search users
Filter users by role
View user status
Block/unblock users
Delete users
Manage programs
Manage reports
View:
Total users
Total hackers
Companies
Active programs
Submitted reports
Resolved reports
Rewards
---
## 📊 Dashboard
BugFinder offers the role-based dashboards:
### Researcher dashboard
The dashboard displays:
Pending reports
Reports under review
Resolved reports
Earnings
Recent submissions
Active bug bounty programs
### Company dashboard
The dashboard displays:
Active programs
Reports awaiting triage
Resolved reports
Rewards
Recent vulnerability submissions
### Admin dashboard
The dashboard displays the statistics and management options of all users and programs.
---
## 🔐 Authentication
BugFinder application allows authentication with three types of users:
| User Type | Description |
|---|---|
| 🛡️ Hacker | Security researchers who discover and report vulnerabilities |
| 🏢 Company | Organizations that create bug bounty programs |
| 👨‍💼 Admin | Platform administrator |
The user is sent to different dashboards depending on their role.
---
## 🧪 Demo Accounts
There are several demo accounts seeded into the application.
### Administrator
```
Email: admin@bugbounty.com
Password: admin123
```
### Company
```
Email: security@techcorp.com
Password: company123
```
### Hacker / Researcher
```
Email: ninja@hacker.com
Password: hacker123
```
> Note: These are demo accounts and should not be used to deploy the application in production.
---
## 🏗️ Tech Stack
### Frontend
React 19
TypeScript
Vite
Tailwind CSS 4
### Development Tools
Vite
TypeScript
Tailwind CSS Vite Plugin
React DOM
ESLint compatible with TypeScript
### Data Layer
We currently use:
```
Browser localStorage
```
The data layer is abstracted using MongoDB-styles services and can be replaced with:
```
React Frontend
↓
REST API / Backend
↓
MongoDB
```
---
## 📁 Project Structure
```
bugfinder/
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
│
└── src/
│
├── App.tsx
├── main.tsx
├── index.css
├── types.ts
│
├── components/
│  ├── Admin.tsx
│  ├── Auth.tsx
│  ├── Dashboards.tsx
│  ├── Navbar.tsx
│  ├── Programs.tsx
│  └── Reports.tsx
│
├── context/
│  └── AppContext.tsx
│
└── services/
└── mongodb.ts
```
---
## 🔄 App Architecture
```
┌─────────────────────┐
│   BugFinder   │
│  React Frontend  │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│  AppContext    │
│ State Management   │
└──────────┬──────────┘
│
┌───────────────┼───────────────┐
│        │        │
▼        ▼        ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Users  │  │ Programs │  │ Reports │
└──────────┘  └──────────┘  └──────────┘
│        │        │
└───────────────┼───────────────┘
│
▼
┌─────────────────────┐
│ mongodb.ts Service │
│ Data Abstraction  │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│  localStorage   │
│  Demo Data Store  │
└─────────────────────┘
```
---
## 🗃️ Data Models
This is a simplified version of all MongoDB document structures defined as TypeScript interfaces:
### User
```
User {
_id
username
email
password
role
bio
reputation
isActive
createdAt
updatedAt
}
```
### Program
```
Program {
_id
companyId
companyName
title
description
scope
outOfScope
rewards
status
submissionCount
createdAt
updatedAt
}
```
### Bug
```
BugReport {
_id
programId
programTitle
hackerId
hackerUsername
title
description
stepsToReproduce
impact
severity
status
reward
rewardPaid
comments
createdAt
updatedAt
}
```
---
## 📋 Report Lifecycle
Vulnerability report can go through this lifecycle:
```
┌─────────┐
│ Pending │
└────┬────┘
│
▼
┌──────────────┐
│ Under Review│
└──────┬───────┘
│
┌────────┴────────┐
▼         ▼
┌────────────┐  ┌──────────┐
│ Resolved │  │ Rejected │
└────────────┘  └──────────┘
```
Valid report statuses:
`pending`
`under_review`
`resolved`
`rejected`
---
## 🎯 Vulnerability Severity
BugFinder defines four levels of severity:
| Severity | Description |
|---|---|
| 🟢 Low | Low-impact security issue |
| 🟡 Medium | Moderate security impact |
| 🟠 High | Significant security vulnerability |
| 🔴 Critical | Severe vulnerability requiring immediate attention |
---
## 🚀 Quick Start
### 1. Clone the repo
```
git clone https://github.com/Mental9411/Bugfinder.git
```
Change directory:
```
cd Bugfinder
```
---
### 2. Install dependencies
Ensure Node.js and npm are installed.
Then:
```
npm install
```
---
### 3. Development server
```
npm run dev
```
This will start the Vite development server and display a local URL like:
```
http://localhost:5173
```
---
## 🏭 Production Build
To generate the app in production:
```
npm run build
```
The build will be generated inside:
```
dist/
```
You can preview the production build locally using:
```
npm run preview
```
---
## 💾 Storage
The current project does not communicate with a MongoDB sever.
We use the browser's `localStorage`.
We store our data with these keys:
```
bb_users
bb_programs
bb_reports
bb_session
bb_init
```
The service layer lives here:
```
src/services/mongodb.ts
```
Which provides operations like:
```
UserDB.findAll()
UserDB.findByEmail()
UserDB.create()
UserDB.update()
UserDB.delete()
```
Similar methods apply to:
```
ProgramDB
ReportDB
SessionDB
```
---
## 🔮 Improvements
This project can be expanded into a complete bug bounty platform.
We can implement a backend by using something like:
```
Node.js / Express or FastAPI
```
We can also deploy it using:
MongoDB Atlas
Authentication & Authorization
Database normalization
JWT
Password hashing (bcrypt/argon2)
Role-based access control
Server-side validations
Other improvements include:
CVSS calculator
Duplicate vulnerability detection
Vulnerability taxonomy
Private programs
Invitation-only programs
Bounty payment integration
Researcher reputation
Hall of Fame
Disclosure management
Email notifications
Webhook integrations
Vulnerability scanners
Nmap
ZAP
Burp Suite
CVE/NVD feeds
Threat intelligence
Automated vulnerability classification
AI-assisted report triage
---
## 🔐 Security Note

As mentioned, this is a FRONTEND/DEMO implementation and stores passwords directly on the browser, which should be avoided in a production application. To deploy this as a production bug bounty/reporting platform requires significant code hardening and should not be done without extensive security and QA reviews.
The following security improvements should be applied in any production environment:
Never store plaintext passwords
Hash passwords in the backend
Never trust role information from the client
Implement server-side authorization
Do not store reports/data in `localStorage`
Transport layer security (HTTPS)
Input filtering/sanitization
Authentication hardening
Session management
API protection
Security headers
File upload protections
Audit logging
Vulnerability disclosure
---
## 🧑‍💻 Development
BugFinder makes use of strict TypeScript compiler options.
We have enabled the following options:
```
strict: true
noUnusedLocals: true
noUnusedParameters: true
noFallthroughCasesInSwitch: true
```
The project makes use of the `@` alias pointing towards `src/`
---
## 📦 Available Scripts
| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
---
## 🖥️ Browsers Support
BugFinder supports all modern browsers that support:
ES2020+
Web Crypto
Local Storage
Modern CSS
React 19
Recommended browsers:
Google Chrome
Microsoft Edge
Mozilla Firefox
Safari
---
## 🤝 Contributions
Contributions are always welcome and can be done in the following way:
### 1. Fork the repo
```
git fork https://github.com/Mental9411/Bugfinder.git
```
### 2. Clone your fork
```
git clone
```
### 3. Create a feature branch
```
git checkout -b feature/new-feature
```
### 4. Make your changes
Implement your changes and ensure they are working as intended.
### 5. Commit your changes
```
git add .
git commit -m "Add new feature"
```
### 6. Push the branch
```
git push origin feature/new-feature
```
### 7. Open a Pull Request
Open a PR to the main repository.
---
## 📜 License
This project does not have a specified license. If you want to make this project open-source, add an appropriate license like the MIT License.
---
## 👨‍💻 Author
Manish
GitHub:
[Mental9411 / Bugfinder](https://github.com/Mental9411/Bugfinder?utm_source=chatgpt.com)
---
## ⭐ Support
If you like this project, please consider:
⭐ starring it
🍴 forking it
🐛 reporting bugs
💡 suggesting new features
🤝 contributing
---
## 🐞 Vision
BugFinder aims to offer a platform where:
```
Security Researchers
│
│ Find Vulnerabilities
▼
┌──────────────────────┐
│   BugFinder    │
│           │
│ Bug Bounty Programs │
│ Vulnerability    │
│ Reports       │
│ Researcher Profiles │
│ Rewards       │
└──────────┬───────────┘
│
│ Responsible Disclosure
▼
Companies
│
▼
Improved Security
```
This way we can transform BugFinder from just a frontend demo into a secure production-grade bug bounty and vulnerability reporting platform.