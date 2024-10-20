# Rule Engine Application

## Overview

This is a Rule Engine application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) but modified to store data in-memory without using a database. The application allows users to:

- Create individual rules based on user attributes (e.g., age, department, salary).
- Combine multiple rules into a single, more complex rule.
- Evaluate rules against user-provided data to determine eligibility.
- Utilize an intuitive user interface built with React.js and Material UI.

## Table of Contents

- [Features](#features)
- [Design Choices](#design-choices)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Usage](#usage)
  - [1. Create Rules](#1-create-rules)
  - [2. Combine Rules](#2-combine-rules)
  - [3. Evaluate Rules](#3-evaluate-rules)
- [Dependencies](#dependencies)
  - [Backend Dependencies](#backend-dependencies)
  - [Frontend Dependencies](#frontend-dependencies)
- [Project Structure](#project-structure)
- [Important Notes](#important-notes)
- [Design Choices Explained](#design-choices-explained)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Contact](#contact)

## Features

- **Rule Creation:** Define rules using logical expressions involving user attributes.
- **Rule Combination:** Combine existing rules into more complex rules (individual rules only).
- **Rule Evaluation:** Evaluate rules against sample user data to check eligibility.
- **In-Memory Data Storage:** All data is stored in-memory for simplicity.
- **Material UI Integration:** A modern, responsive UI using Material UI components.

## Design Choices

- **In-Memory Storage:** Data is stored in memory instead of using a database, simplifying setup and focusing on core functionality.
- **Separation of Concerns:** The application is divided into a backend (API server) and frontend (client application) for modularity and maintainability.
- **Material UI:** Used to enhance the user interface, providing a consistent and modern look and feel.
- **Fetch API for HTTP Requests:** The Fetch API is used instead of Axios to reduce dependencies and leverage native browser capabilities.
- **Abstract Syntax Tree (AST):** Rules are parsed into an AST to facilitate evaluation and combination, allowing for complex rule structures.
- **Distinction Between Rule Types:** Individual rules and combined rules are distinguished, with combined rules only generated through the combination of individual rules.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 14 or higher recommended)
- npm (comes with Node.js)
- Git (optional but recommended for version control)

## Installation

### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/rule-engine.git
   cd rule-engine/backend
   ```
