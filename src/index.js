import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <Home />
  </ChakraProvider>
);
