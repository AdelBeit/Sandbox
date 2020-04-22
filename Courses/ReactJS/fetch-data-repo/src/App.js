import React, { useReducer, useState, useEffect } from "react";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      console.log(state);
      return { ...state, isLoading: true, isError: false };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const response = await fetch(url);
        const json = await response.json();

        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: json });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };

    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};

function App() {
  const rawurl = "https://hn.algolia.com/api/v1/search?query=";

  const [query, setQuery] = useState("redux");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(rawurl, {
    hits: [],
  });

  return (
    <>
      <form
        onSubmit={(event) => {
          doFetch(rawurl + query);
          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        ></input>

        <button type="submit">Search</button>
      </form>
      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map((hit) => (
            <li key={hit.objectID}>
              <p>{hit.title}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
