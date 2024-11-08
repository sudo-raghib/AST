import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { API_BASE } from '../config'

function CreateRule() {
  const [ruleString, setRuleString] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/create_rule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Methods": "*",
          // "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ ruleString }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error creating rule");
      }

      const data = await response.json();
      setMessage("Rule created successfully.");
      setRuleString("");
    } catch (error) {
      setMessage("Error creating rule: " + error.message);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create Rule
      </Typography>
      <Box component="form" onSubmit={handleCreateRule} noValidate>
        <TextField
          label="Rule String"
          multiline
          minRows={3}
          value={ruleString}
          onChange={(e) => setRuleString(e.target.value)}
          fullWidth
          required
          variant="outlined"
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Create Rule
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

export default CreateRule;
