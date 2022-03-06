import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const inputRef = useRef();
  const [enteredFilter, setEnteredFilter] = useState("");
  useEffect(() => {
    console.log("useEffect running...");
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          "https://react-hooks-67990-default-rtdb.firebaseio.com/ingredients.json" +
            query
        )
          .then((response) => response.json())
          .then((responseDate) => {
            const loadedIngredients = [];
            for (const key in responseDate) {
              loadedIngredients.push({
                id: key,
                title: responseDate[key].title,
                amount: responseDate[key].amount,
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
