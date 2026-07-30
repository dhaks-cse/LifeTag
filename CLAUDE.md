# CLAUDE.md

This file is the permanent project specification for Claude Code. All work performed in this repository must comply with the guidelines below.

## Project

**LifeTag — Emergency Medical Identity Platform**

A hackathon MVP that enables emergency responders to instantly access a patient's critical medical information by tapping an NFC tag or scanning a QR code.

The system consists of a React frontend, a Node.js backend, a MongoDB database, and an ESP32 hardware prototype.

## Objectives

- Build a production-quality MVP.
- The project should look and feel like a real healthcare startup product, not a college CRUD assignment.
- Prioritize clean architecture, maintainability, and a professional user interface.

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- Lucide React

**Backend**
- Node.js
- Express
- MongoDB Atlas
- Mongoose

**Hardware**
- ESP32 DevKit
- NTAG216 NFC Tags
- Push Buttons
- LEDs
- Buzzer

## Architecture

The project follows an MVC architecture.

**Backend**
```
config
controllers
middleware
models
routes
```

**Frontend**
```
api
components
pages
assets
utils
styles
```

## Coding Standards

- Write production-quality code.
- No emojis.
- No placeholder code.
- No lorem ipsum.
- No unnecessary comments.
- Use descriptive naming.
- Keep functions modular.
- Avoid duplication.
- Prefer reusable components.
- Use async/await.
- Handle errors gracefully.
- Use consistent formatting.

## UI Guidelines

- Professional healthcare theme.
- Minimal.
- Modern.
- Clean.
- Responsive.
- White background.
- Blue primary color.
- Red reserved only for emergency actions.
- Rounded cards.
- Good spacing.
- Accessible typography.
- No flashy gradients.
- No excessive animations.

## Backend Standards

- Professional REST API.
- Proper HTTP status codes.
- Consistent JSON response structure.
- Validation where required.
- Meaningful error messages.
- Do not expose implementation details in responses or errors.

## Frontend Standards

- Reusable components.
- Responsive layout.
- Mobile first.
- Avoid inline styles.
- Prefer Tailwind utilities.

## Git Workflow

- Never modify multiple unrelated files in a single change.
- Generate only the requested file.
- Keep commits focused.
- Small commits.
- Professional commit messages.

## Response Rules

When asked to generate code:

- Generate ONLY the requested file.
- Never modify another file unless explicitly requested.
- Do not explain the code.
- Do not generate unnecessary files.
- Always return complete, working code.
- If additional files are required, ask before generating them.

## Goal

Produce code suitable for a professional hackathon demonstration.
