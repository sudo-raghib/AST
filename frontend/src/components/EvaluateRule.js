import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

function EvaluateRule() {
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [dataInput, setDataInput] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/rules");
      if (!response.ok) {
        throw new Error("Error fetching rules");
      }
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const handleEvaluate = async () => {
    try {
      const data = JSON.parse(dataInput);
      if (!selectedRuleId) {
        alert("Please select a rule to evaluate.");
        return;
      }
      const selectedRule = rules.find((rule) => rule.id === selectedRuleId);
      if (!selectedRule) {
        alert("Selected rule not found.");
        return;
      }

      const response = await fetch("/api/evaluate_rule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          astJson: selectedRule.astJson,
          data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error evaluating rule");
      }

      const responseData = await response.json();
      setResult(responseData.result);
    } catch (error) {
      alert("Error evaluating rule: " + error.message);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Evaluate Rule
      </Typography>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Select Rule</InputLabel>
        <Select
          value={selectedRuleId}
          onChange={(e) => setSelectedRuleId(e.target.value)}
          label="Select Rule"
        >
          <MenuItem value="" disabled>
            -- Select Rule --
          </MenuItem>
          {rules.map((rule) => (
            <MenuItem key={rule.id} value={rule.id}>
              {`Rule ID ${rule.id}: ${rule.ruleString}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="User Data (JSON)"
        multiline
        minRows={6}
        value={dataInput}
        onChange={(e) => setDataInput(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
        placeholder='{"age": 35, "department": "Sales", "salary": 60000, "experience": 3}'
      />
      <Box sx={{ mt: 2 }}>
        <Button onClick={handleEvaluate} variant="contained" color="primary">
          Evaluate Rule
        </Button>
      </Box>
      {result !== null && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Result:{" "}
          {result ? "True (User is eligible)" : "False (User is not eligible)"}
        </Typography>
      )}
    </Paper>
  );
}

export default EvaluateRule;
