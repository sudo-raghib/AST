import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import CreateRule from "./components/CreateRule";
import RulesList from "./components/RulesList";
import CombineRules from "./components/CombineRules";
import EvaluateRule from "./components/EvaluateRule";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Rule Engine Application
          </Typography>
          <Button color="inherit" href="/">
            Rules List
          </Button>
          <Button color="inherit" href="/create">
            Create Rule
          </Button>
          <Button color="inherit" href="/combine">
            Combine Rules
          </Button>
          <Button color="inherit" href="/evaluate">
            Evaluate Rule
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<RulesList />} />
          <Route path="/create" element={<CreateRule />} />
          <Route path="/combine" element={<CombineRules />} />
          <Route path="/evaluate" element={<EvaluateRule />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
