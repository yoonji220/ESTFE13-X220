import "./App.css";
import Router from "./Router";
import { useState } from "react";
import { authService } from "../firebase";
import { Container } from "@mui/material";

function App() {
  console.log(authService.currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Container>
        <h1>ESTFE13-X</h1>
        <Router isLoggedIn={isLoggedIn} />
      </Container>
    </>
  );
}

export default App;
