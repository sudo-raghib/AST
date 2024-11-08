import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { API_BASE } from "../config";

function RulesList() {
  const [rules, setRules] = useState([]);

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

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Rules List
      </Typography>
      <List>
        {rules.map((rule) => (
          <ListItem key={rule.id} divider>
            <ListItemText primary={`Rule ID ${rule.id}: ${rule.ruleString}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default RulesList;
