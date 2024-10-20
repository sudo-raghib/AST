function Operand(attribute, operator, compareValue) {
  this.attribute = attribute;
  this.operator = operator;
  this.compareValue = compareValue;
}

function Node(type, value) {
  this.type = type; // 'operand' or 'operator'
  this.value = value; // For operand: Operand object, for operator: 'AND' or 'OR'
  this.left = null;
  this.right = null;
}

// Function to convert Node objects to JSON
function astToJson(node) {
  if (!node) return null;
  return {
    type: node.type,
    value:
      node.type === "operand"
        ? {
            attribute: node.value.attribute,
            operator: node.value.operator,
            compareValue: node.value.compareValue,
          }
        : node.value,
    left: astToJson(node.left),
    right: astToJson(node.right),
  };
}

// Function to reconstruct AST from JSON
function jsonToAst(json) {
  if (!json) return null;
  const node = new Node(json.type, json.value);
  if (json.type === "operand") {
    node.value = new Operand(
      json.value.attribute,
      json.value.operator,
      json.value.compareValue
    );
  }
  node.left = jsonToAst(json.left);
  node.right = jsonToAst(json.right);
  return node;
}

// Tokenization function remains the same
function tokenize(ruleString) {
  const pattern =
    /\s*(=>|==|!=|<=|>=|AND|OR|\(|\)|[A-Za-z_][A-Za-z0-9_]*|[\>\<]=?|=|'[^']*'|[0-9]+)\s*/g;
  const tokens = ruleString.match(pattern) || [];
  return tokens
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

function infixToPostfix(tokens) {
  const precedence = { AND: 2, OR: 1 };
  const queue = [];
  const stack = [];

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      while (stack.length > 0 && stack[stack.length - 1] !== "(") {
        queue.push(stack.pop());
      }
      stack.pop(); // Remove '('
    } else if (token === "AND" || token === "OR") {
      while (
        stack.length > 0 &&
        precedence[stack[stack.length - 1]] >= precedence[token]
      ) {
        queue.push(stack.pop());
      }
      stack.push(token);
    } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(token)) {
      // It's an attribute, parse the operand
      const attribute = token;
      const operator = tokens[++i];
      let compareValue = tokens[++i];

      // Remove quotes if it's a string
      if (compareValue.startsWith("'") && compareValue.endsWith("'")) {
        compareValue = compareValue.slice(1, -1);
      } else if (!isNaN(compareValue)) {
        compareValue = parseFloat(compareValue);
      }

      const operand = new Operand(attribute, operator, compareValue);
      queue.push(operand);
    }
    i++;
  }

  while (stack.length > 0) {
    queue.push(stack.pop());
  }

  return queue;
}

function buildAST(postfixTokens) {
  const stack = [];
  postfixTokens.forEach((token) => {
    if (token instanceof Operand) {
      const node = new Node("operand", token);
      stack.push(node);
    } else if (token === "AND" || token === "OR") {
      const right = stack.pop();
      const left = stack.pop();
      const node = new Node("operator", token);
      node.left = left;
      node.right = right;
      stack.push(node);
    }
  });
  return stack.pop();
}

// Adjusted createRule function remains the same
function createRule(ruleString) {
  const tokens = tokenize(ruleString);
  const postfixTokens = infixToPostfix(tokens);
  const ast = buildAST(postfixTokens);
  return ast;
}

// Adjusted combineRules function
function combineRules(ruleStrings) {
  const asts = ruleStrings.map((ruleString) => createRule(ruleString));
  if (asts.length === 0) return null;
  let combinedAST = asts[0];
  for (let i = 1; i < asts.length; i++) {
    const newRoot = new Node("operator", "OR");
    newRoot.left = combinedAST;
    newRoot.right = asts[i];
    combinedAST = newRoot;
  }
  return combinedAST;
}

// Adjusted evaluateRule function
function evaluateRule(astJson, data) {
  const ast = jsonToAst(astJson); // Convert JSON back to AST
  return evaluateAst(ast, data);
}

// Recursive function to evaluate the AST
function evaluateAst(ast, data) {
  if (ast.type === "operand") {
    const operand = ast.value;
    const userValue = data[operand.attribute];
    if (userValue === undefined) return false;
    switch (operand.operator) {
      case ">":
        return userValue > operand.compareValue;
      case "<":
        return userValue < operand.compareValue;
      case ">=":
        return userValue >= operand.compareValue;
      case "<=":
        return userValue <= operand.compareValue;
      case "=":
        return userValue == operand.compareValue;
      case "!=":
        return userValue != operand.compareValue;
      default:
        return false;
    }
  } else if (ast.type === "operator") {
    const leftResult = evaluateAst(ast.left, data);
    const rightResult = evaluateAst(ast.right, data);
    if (ast.value === "AND") {
      return leftResult && rightResult;
    } else if (ast.value === "OR") {
      return leftResult || rightResult;
    }
  }
  return false;
}

module.exports = {
  createRule,
  combineRules,
  evaluateRule,
  astToJson,
  jsonToAst,
  Node,
  Operand,
};
