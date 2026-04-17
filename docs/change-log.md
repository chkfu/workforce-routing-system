<!--

Learnt:

The CHANGRLOG.md file records the version-based changes of the system. It
store the trace that how the development teams add, edit, fix and remove
in each release.

While Git commit messages records the details of subsequent changes; however,
this files groups relevant changes into a clearer and human-recognisable
summaries for further maintenance.

-->

# CHANGELOG

This file records the major version changes of the projects.

<br/>

## [1.0.3] - Apr 12, 2026 - In Progress

<i>Objective: implement authentication and candidate selection APIs with secure access control and validation</i>

### Added

- setup redis database connection for fast cache memory, improving effectiveness of frequent and repeated queries
- created routes, controllers and repositories for candidate-supported, selection-supported and probation-supported tables
- implemented lock mechanism at`CacheService.ts` to prevent race condition with redis caching.
- implemented redis store with rate limit for cyber security and prefix for session management.

### Edited

- restructured the project into domain-driven design architecture to improve project maintenance
- improved `BaseController.ts` and `BaseRepository.ts` with abstraction, preventing mistakenly use base classes
- disabled direct password-access methods at `SysUserController`, preventing inappropriate disclosure of confidential information
- extracted service class at `CacheService.ts` for centralising cache management of the server side

## Fixed

- fixed sendCommand syntax caused by specific format requried in node-redis, resumed redis client connection

### Delete

- remove draft schema `schema_draft.sql` after finalised version is confirmed

<br/>

## [1.0.2] - Apr 12, 2026

<i>Objective: establish core API architecture with centralised error handling and structured logging</i>

### Added

- setup postgre database schema for regulating record inputs
- setup centralised logging, global error handlers and its middlewares
- setup centralised types and enums management
- created basic crud for table `departments` and `staff`

### Edited

- improved logging mechanism with rotation setting
- improved error handling with fatal, sepcific postgre and operational errors
- refactored the duplicated repository codes under centralised class at `BaseRepository.ts`
- refactored the duplicated controller codes under centralised class at `BaseController.ts`
- extended affiliated controllers and repositories for each table, inherited from their base classes
- refined sql queries to prevent direct sql injection
- re-organised file structure for the server side

### Fixed

- fixed postgre warning of ssl related settings at `pool.ts`

### Delete

- removed controller and repositories scripts for table `departments` and `staff`

<br/>

## [1.0.1] - Apr 4, 2026

<i>Objective: initialise backend service with database connectivity and secure server configuration</i>

### Added

- setup express server with https, ssl/tls and security settings
- setup neon postgre database connection and structure of schema, routes, controllers and services
- created wrapper function `handle_async` to streamlined repeated try-catch procedures
- created centralised collection for reused types at `/types`

### Fixed

- resolved bug of `create` methods not in async by implementing promise at departments controller

<br/>

## [1.0.0] - Mar 28, 2026

<i>Objective: setup the project base </i>

### Added

- create `server` and `docs` folders for project initialisation
