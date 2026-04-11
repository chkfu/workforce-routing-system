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

## [1.0.2] - Apr 11, 2026

<i>Objective: setup basic api structure, and implement error handling and logging</i>

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
- refined sql queries to prevent direct sql injection

### Fixed

- fixed postgre warning of ssl related settings at `pool.ts`

### Delete

- removed controller and repositories scripts for table `departments` and `staff`

<br/>

## [1.0.1] - Apr 4, 2026

<i>Objective: setup backend server and database connection</i>

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
