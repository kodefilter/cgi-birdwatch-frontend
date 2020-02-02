import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTable, useSortBy } from "react-table";
import ObservationForm from "./components/ObservationForm";
import observationService from "./services/observations";

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

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useSortBy
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  );
}

const App = () => {
  const [observations, setObservations] = useState([]);
  const [newName, setNewName] = useState("");
  const [newRarity, setNewRarity] = useState("");
  const [newNotes, setNewNotes] = useState("");

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
        setNewRarity("");
        setNewNotes("");
      })
      .catch(error => {
        setNewName("");
        setNewRarity("");
        setNewNotes("");
      });

    //need to implement error or success message
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
      }
    ],
    []
  );

  const data = React.useMemo(() => observations, [observations]);

  return (
    <Styles>
      <h1>Bird Observation Table</h1>
      <Table columns={columns} data={data} />
      <h2>Add new observation</h2>
      <form onSubmit={addObservation}>
        <div>
          <h3>Name</h3>
          <input value={newName} onChange={handleNameChange} />
        </div>

        <div>
          <h3>Rarity</h3>
          <select name="rarity" value={newRarity} onChange={handleRarityChange}>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="extremely rare">Extremely Rare</option>
          </select>
        </div>

        <h3>Notes</h3>
        <textarea
          rows="5"
          cols="25"
          value={newNotes}
          onChange={handleNotesChange}
        ></textarea>

        <div>
        <button type="submit">Add</button>
        </div>
      </form>
    </Styles>
  );
};

export default App;
