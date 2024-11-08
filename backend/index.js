const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const {
  createRule,
  combineRules,
  evaluateRule,
  astToJson,
  jsonToAst,
  Node,
  Operand,
} = require("./ruleEngine.js");

let rules = [];
let combinedAST = null;

let nextRuleId = 1;

// Route to create a rule
app.post("/api/create_rule", (req, res) => {
  const { ruleString } = req.body;
  try {
    const ast = createRule(ruleString);
    const rule = {
      id: nextRuleId++,
      ruleString,
      astJson: astToJson(ast),
    };
    rules.push(rule);
    res.status(201).json({ message: "Rule created", rule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/combine_rules", (req, res) => {
  const { ruleIds } = req.body;

  // Validate that we have at least two rules to combine
  if (!ruleIds || ruleIds.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two rules must be selected to combine." });
  }

  // Find the selected rules
  const selectedRules = rules.filter((rule) => ruleIds.includes(rule.id));

  if (selectedRules.length !== ruleIds.length) {
    return res
      .status(400)
      .json({ error: "Some selected rule IDs were not found." });
  }

  try {
    // Combine the rules by combining their ASTs
    const asts = selectedRules.map((rule) => jsonToAst(rule.astJson));

    // For simplicity, we will combine the rules using the OR operator
    let combinedAST = asts[0];
    for (let i = 1; i < asts.length; i++) {
      const newRoot = new Node("operator", "OR");
      newRoot.left = combinedAST;
      newRoot.right = asts[i];
      combinedAST = newRoot;
    }

    // Generate a combined rule string
    const combinedRuleString = selectedRules
      .map((rule) => `(${rule.ruleString})`)
      .join(" OR ");

    // Create a new rule entry for the combined rule
    const combinedRule = {
      id: nextRuleId++,
      ruleString: combinedRuleString,
      astJson: astToJson(combinedAST),
    };

    // Add the combined rule to the rules list
    rules.push(combinedRule);

    // Return the combined rule
    res.json({ message: "Rules combined successfully.", combinedRule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to evaluate rule
app.post("/api/evaluate_rule", (req, res) => {
  const { astJson, data } = req.body;
  try {
    const result = evaluateRule(astJson, data);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get all rules
app.get("/api/rules", (req, res) => {
  res.json(rules);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;