import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  Checkbox,
  Button,
  Paper,
  Typography,
  FormControlLabel,
  Box,
} from "@mui/material";
import { API_BASE } from "../config";

function CombineRules() {
  const [rules, setRules] = useState([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch(`${API_BASE}/rules`);
      if (!response.ok) {
        throw new Error("Error fetching rules");
      }
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const handleCheckboxChange = (ruleId) => {
    setSelectedRuleIds((prevSelected) =>
      prevSelected.includes(ruleId)
        ? prevSelected.filter((id) => id !== ruleId)
        : [...prevSelected, ruleId]
    );
  };

  const handleCombine = async () => {
    try {
      const response = await fetch(`${API_BASE}/combine_rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ruleIds: selectedRuleIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error combining rules");
      }

      const data = await response.json();
      const { combinedRule } = data;
      setRules((prevRules) => [...prevRules, combinedRule]);
      setSelectedRuleIds([]);
      setMessage("Rules combined successfully.");
    } catch (error) {
      setMessage("Error combining rules: " + error.message);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Combine Rules
      </Typography>
      <List>
        {rules.map((rule) => (
          <ListItem key={rule.id} dense>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedRuleIds.includes(rule.id)}
                  onChange={() => handleCheckboxChange(rule.id)}
                />
              }
              label={`Rule ID ${rule.id}: ${rule.ruleString}`}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2 }}>
        <Button
          onClick={handleCombine}
          variant="contained"
          color="primary"
          disabled={selectedRuleIds.length < 2}
        >
          Combine Selected Rules
        </Button>
      </Box>
      {message && (
        <Typography variant="body1" color="secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Paper>
  );
}

export default CombineRules;
