# Salesforce Calendar Management System

A modern enterprise-level calendar and scheduling application built on Salesforce using LWC, Apex, FullCalendar, Flows, Queueable Apex, Batch Apex, Reports, Dashboards, and Platform Events.

---

## Features

* FullCalendar integration
* Drag & Drop scheduling
* Event resizing
* Event CRUD operations
* Conflict detection
* Approval workflow
* Reminder automation
* Queueable Apex
* Batch Apex + Scheduler
* Reports & Dashboards
* Platform Events
* Mobile responsive UI

---

## Tech Stack

* Lightning Web Components (LWC)
* Apex
* FullCalendar
* Salesforce Flows
* Queueable Apex
* Batch Apex
* Platform Events
* Reports & Dashboards

---

## Architecture

```text
LWC Frontend
   ↓
Apex Controller
   ↓
Salesforce Objects
   ↓
Triggers & Validation
   ↓
Async Processing
   ↓
Reports & Dashboards
```

---

## Key Modules

### Event Management

* Create, edit, delete events
* Drag & Drop calendar updates
* Event resizing
* Sidebar navigation

### Automation

* Reminder email flow
* Approval process for Client Meetings
* Scheduled Batch Apex jobs

### Analytics

* Upcoming Events Report
* Completed Events Report
* Resource Usage Dashboard

---

## Setup

```bash
git clone <repo-url>
sf org login web
sf project deploy start --source-dir force-app
```

---

## Author

Amit Mehta

---

## License

Educational and portfolio project.
