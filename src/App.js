import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";
import Observation from "./components/Observation";

const App = () => {
  const [observations, setObservations] = useState([]);

  

  useEffect(() => {
    axios
      .get("https://whispering-tundra-87610.herokuapp.com/api/observations")
      .then(response => {
        setObservations(response.data);
      });
  }, []);

  const rows = () => observations.map(observation =>
    <Observation
      key={observation.id}
      observation={observation}
    />
    )

  return <h1>{rows()}</h1>;
};

export default App;
