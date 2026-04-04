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

## [1.0.1] - Apr 4, 2026

### Added

- setup express server with https, ssl/tls and security settings
- setup neon postgre database connection and structure of schema, routes, controllers and services
- created wrapper function `handle_async` to streamlined repeated try-catch procedures
- created centralised collection for reused types at `/types`

### Fixed

- resolved bug of `create` methods not in async by implementing promise at departments controller

<br/>

## [1.0.0] - Mar 28, 2026

### Added

- create `server` and `docs` folders for project initialisation
