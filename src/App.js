import React, { useState, useEffect } from "react";
import styled from "styled-components";

import observationService from "./services/observations";
import Notification from './components/notification'
import Table from './components/table'
import "./App.css";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const App = () => {
  const [observations, setObservations] = useState([{}]);
  const [newName, setNewName] = useState("");
  const [newRarity, setNewRarity] = useState("common");
  const [newNotes, setNewNotes] = useState("");

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    observationService.getAll().then(initialObservations => {
      setObservations(initialObservations);
    });
  }, []);

  const addObservation = event => {
    event.preventDefault();

    const observationObject = {
      name: newName,
      rarity: newRarity,
      notes: newNotes,
      timestamp: new Date()
    };

    observationService
      .create(observationObject)
      .then(addedObservation => {
        setObservations(observations.concat(addedObservation));
        setNewName("");
        setNewNotes("");

        setSuccessMessage(`${addedObservation.name} has been added`)
        setTimeout(()=>{
          setSuccessMessage(null)
        },3000)

      })
      .catch(error => {
        setNewName("");
        setNewNotes("");
        setErrorMessage(error.response.data.error)
        setTimeout(()=>{
          setSuccessMessage(null)
        },3000)

      });

  };

 

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleRarityChange = event => {
    setNewRarity(event.target.value);
  };

  const handleNotesChange = event => {
    setNewNotes(event.target.value);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Rarity",
        accessor: "rarity"
      },
      {
        Header: "Notes",
        accessor: "notes"
      },
      {
        Header: "Date",
        accessor: "timestamp"
      },
      {
        Header: 'Delete',
        id: 'delete',
        accessor: (str) => 'delete',

    Cell: (tableProps) => (
      <span style={{cursor:'pointer',color:'blue',textDecoration:'underline'}}
        onClick={() => {

          // id of the object in table
          const id = tableProps.row.original.id

          const toBeDeletedObservation = observations.find(observation=>observation.id === id)

    if (window.confirm(`Delete ${toBeDeletedObservation.name}`)) {
      observationService
          .deleteEntry(id)
          .then( deletedObservation => {
            setObservations(observations.filter(observation => observation.id !== deletedObservation.id ))
            setSuccessMessage(`${toBeDeletedObservation.name} was deleted from the server`)
            setTimeout(()=>{
              setSuccessMessage(null)
            }, 5000)

          }).catch(error => {
            
            setErrorMessage(`the observation '${toBeDeletedObservation.name}' was already deleted from server`)
            setObservations(observations.filter(p=>p.id !== toBeDeletedObservation.id))

            setTimeout(()=>{
              setErrorMessage(null)
            }, 5000)

          })
    }


        }}>
       Delete
      </span>
    ),
  },
    ],
    [observations]
  );

  const data = React.useMemo(() => observations, [observations]);

  return (
    <div class="main-container">
      <Styles>
        <p>
          Clicking on the header sorts the column in ascending or decending
          order !
        </p>
        <h1>Bird Observation Table</h1>
        
        <Notification errorMessage={errorMessage} successMessage={successMessage} />

        <Table columns={columns} data={data} />
        <div class="form-section">
          <h2>Add new observation</h2>
          <form onSubmit={addObservation}>
            Add Name<input value={newName} onChange={handleNameChange} />
            Pick Rarity 
              <select value={newRarity} onChange={handleRarityChange}>
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="extremely rare">Extremely Rare</option>
              </select>
            Add Notes <textarea rows="5" cols="25" value={newNotes} onChange={handleNotesChange}></textarea>
            <br></br>
            <button type="submit">Add Observation</button>
          </form>
        </div>
      </Styles>
    </div>
  );
};

export default App;
