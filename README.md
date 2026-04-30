# Atrium - Workforce Routing System

<br/>

## Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Workflow](#workflow)
- [Installation / Initialisation](#installation--initialisation)
- [Technical Consideration and Limitations](#technical-consideration-and-limitations)
- [Dependencies](#dependencies)

<br/>

## Overview

Companies often lack consistent procedures on assigning the new hires for internal re-training and jobs, leading to high dropout rates, poor role fits and the waste of resources.

The Atrium Platform is a full-stack web application that systematically matches candidates with departments throughout the probation period, while enabling management to monitor assignment outcomes during the probation period.

It gives top management the structured visibility into assignment outcomes during probation, and lets them make smart changes to how things work.

<br/>

## Features

### A. Weighted Score and Evaluation Mechanism

Calculating candidate scores with configurable factors (e.g. background, interview performance, and training results). Adjustable weightings support flexible and consistent evaluation with comparisons.

### B. Preference-oriented Multi-Round Matching

Matching candidates and departments according to their preferences and department priorities. Unmatched candidates will be reassigned based on remaining quota after serveral rounds of screening.

### C. Comparable Evaluation of selection strategies

Systematically re-running the selection process with different configurations, comparing various outcomes (e.g. passing rate, dropout rate, preference satisfaction) for management decision.

<br/>

## Architecture

<i>\* Read `architecture.md` for further information of design and module reponsibilities. </i>

### A. Overall Design

The Atrium Platform follows Domain-Driven Design, with a modular API pipeline of routes, controllers, services and repositories. Each layer focuses on their module specialties for clarifying boundaries between request handling, business logic and data access.

### B. Module-Based Organisation

RESTful API modules has been grouped into five key categories:

| Module Group     | Description                                       |
| ---------------- | ------------------------------------------------- |
| group_system     | System operational settings related.              |
| group_candidate  | New hires related, and their related information. |
| group_department | Departmental structure and agenda.                |
| group_selection  | Considerations related to pre-training intakes    |
| group_probation  | Considerations related to probational performance |
| group_hiring     | Considerations related to official hiring         |
| group_final      | Final Result of Intakes                           |

These core modules will support the two-tiered workflows for candidate selection as shown in below:

#### (1) Candidate Selection Flow

<p>
  <img src="docs/charts/chart_domain_logic.png" width="100%">
</p>

### C. Layered Architecture

Each module contains API layers to ensure clear division of responsibilities between application flow and domain logic:

| Layer              | Responsibility                                                            |
| ------------------ | ------------------------------------------------------------------------- |
| Routes Layer       | Defines the API entry points and forward https requests to controllers.   |
| Controllers Layer  | Validates client inputs and https requests, forwarding tasks to services. |
| Services Layer     | Handles core business logics, receiving data for further transformation.  |
| Repositories Layer | Manages queries for direct database access.                               |

<br/>

## Project Structure

<i>\* Read `architecture.md` for further information of design and module reponsibilities. </i>

<br/>

## Workflow

<i>\* Read `architecture.md` for further information of design and module reponsibilities. </i>

<br/>

## Installation / Initialisation

For project setup, you need to install Node.js v18+, PostgreSQL, and Redis to proceed further.

Please clone the project at the <a href='https://github.com/chkfu/atrium-workforce-routing-system.git'>Github repository</a>.

### A. Server side setup (development environment)

Beginning with a new terminal, and run the CLI with the commands below:

```
$ cd server
$ npm install
$ npm run dev
```

The server will be available at `https://localhost:8080` (or specified).

### B. Client side setup (development environment)

For browser display, please start the second terminal and run the below commands:

```
$ cd client
$ npm install
$ npm run dev
```

The client will be available at `http://localhost:5173` (or specified).

<br/>

## Technical Consideration and Limitations

### A. Design Trade-off

#### (1) Managing Complex Modular Structure

- Solution: Converted to layered structure with model, controller, service and repository modules, decoupling functionalities and logics for better maintenance.
- Tradeoff: New features requires to updates in more layers with additional efforts on managing module coordination and ensuring their completeness.

#### (2) Prevent Database Overloading

- Solution: Implemented Redis caching, rate limiting and lock, as the database-level shelter reducing loads and against race competition.
- Tradeoff: Requires additional redis handlers for the querying methods with more complex modular relations, plus extra costs for setup and maintain the redis server.

### B. Limitations

#### (1) Long-term Data Dependency

- The design has limitation handling frequent strategy changes, as each recruitment batch presented as vaiable factors. Lack of data consistency could harm the reliability and failed to match the fair test requirements.

<br/>

## Dependencies

| Scope  | Category  | Package            | Version |
| ------ | --------- | ------------------ | ------- |
| Client | Framework | react              | ^18.3.1 |
| Client | Styling   | tailwindcss        | ^4.2.4  |
| Server | Framework | express            | ^5.2.1  |
| Server | Security  | express-rate-limit | ^8.3.1  |
| Server | Database  | pg                 | ^8.20.0 |
| Server | Cache     | redis              | ^5.12.1 |
| Server | Logging   | winston            | ^3.19.0 |

See `client/package.json` and `server/package.json` for the full package list.

<br/>

<i> Author: kchan </i>
</br>
<i> Last Updated: Apr 18, 2026 </i>
