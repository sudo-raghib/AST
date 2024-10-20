# Rule Engine Application
**Demo** https://drive.google.com/file/d/1BdQBywO8eIIpaAHm4fMzaD_0rbK4nCUQ/view?usp=sharing


## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)

## Tech Stack

- **Frontend:** React, Material UI
- **Backend:** Node.js, Express.js

## Installation

1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm run install
    ```

2. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm run install
   ```

## Running the Application

2. Start the backend server:

   ```bash
   npm run start
   ```
4. Start the frontend server:

   ```bash
   npm run start
   ```

Open [http://localhost:3001](http://localhost:3001) to view the application in the browser.

### Data Structures Used

The core data structures used in this application revolve around representing rules as Abstract Syntax Trees (ASTs). Here's an explanation of the main data structures:

- **Node Class**: Represents nodes in the AST.
  - **Properties**:
    - `type`: A string indicating the node type ('operator' or 'operand').
    - `value`: For operator nodes, this is 'AND' or 'OR'. For operand nodes, this is an instance of the Operand class.
    - `left`: Reference to the left child node (another Node instance).
    - `right`: Reference to the right child node (another Node instance).

- **Operand Class**: Represents operands (conditions) in the AST.
  - **Properties**:
    - `attribute`: A string representing the attribute name (e.g., 'age').
    - `operator`: A string representing the comparison operator (e.g., '>', '=').
    - `compareValue`: The value to compare against (e.g., 30, 'Sales').

These classes are used to construct the AST when parsing rule strings. The AST allows for efficient evaluation and combination of rules.

### Data Flow

- **Rule Creation**:
  - Rule strings are input by the user.
  - The application tokenizes the rule string into individual tokens (operands, operators, parentheses).
  - The tokens are parsed into a postfix expression using the Shunting Yard algorithm.
  - The postfix expression is used to build the AST using instances of the Node and Operand classes.

- **Rule Combination**:
  - ASTs of individual rules are combined into a single AST representing the combined rule.
  - Only individual rules (not combined rules) can be selected for combination.
  - Combination is typically done using logical operators (e.g., combining with an 'OR' operator at the root of the new AST).

- **Rule Evaluation**:
  - User-provided data is input in JSON format.
  - The AST is traversed recursively:
    - For operand nodes, the condition is evaluated against the user data.
    - For operator nodes, the results of the left and right child nodes are combined using the specified logical operator.
  - The final result determines whether the user data satisfies the rule.
