import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Error");
  }
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.error };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw Error("Should not be here");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  //const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
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
        // setUserIngredients(loadedIngredients);
      });
  }, []);
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    fetch(
      "https://react-hooks-67990-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        return response.json();
      })
      .then((responseData) => {
        // setIsLoading(false);
        /* setUserIngredients((prev) => [
          ...prev,
          { id: responseData.name, ...ingredient },
        ]); */
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient },
        });
      });
  }, []);

  const onDeleteHandler = useCallback((id) => {
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });

    fetch(
      `https://react-hooks-67990-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });

        // setIsLoading(false);
        console.log(response);
        // setUserIngredients((prev) => prev.filter((i) => i.id !== id));
        dispatch({ type: "DELETE", id: id });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", error: error.message });

        // setError(error.message);
      });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
    // setError(null);
    // setIsLoading(false);
  }, []);

  const ingredientList = useMemo(() => {
    <IngredientList
      ingredients={userIngredients}
      onRemoveItem={onDeleteHandler}
    />;
  }, [userIngredients, onDeleteHandler]);

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
