import React from "react";
import "./search.css";

export const Search = (props) => {
  const handleChange = (e) => {
    props.setSearch(e.target.value);
  };

  const clearSearch = () => {
    props.setSearch("");
  };

  return (
    <div className="search">
      <input
        id="search"
        type="text"
        onChange={handleChange}
        placeholder="Buscar ..."
        value={props.search}
        autoFocus
      />
      {props.search && <i className="fas fa-times" onClick={clearSearch}></i>}
    </div>
  );
};
