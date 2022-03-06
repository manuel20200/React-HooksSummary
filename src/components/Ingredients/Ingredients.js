import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetch(
      "https://react-hooks-67990-default-rtdb.firebaseio.com/ingredients.json"
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
        setUserIngredients(loadedIngredients);
      });
  }, []);
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);
  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch(
      "https://react-hooks-67990-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setIsLoading(false);
        setUserIngredients((prev) => [
          ...prev,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };
  const onDeleteHandler = (id) => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-67990-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      setIsLoading(false);
      console.log(response);
      setUserIngredients((prev) => prev.filter((i) => i.id !== id));
    });
  };
  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={onDeleteHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
