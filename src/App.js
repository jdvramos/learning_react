import Header from "./Header";
import SearchItem from "./SearchItem";
import AddItem from "./AddItem";
import Content from "./Content";
import Footer from "./Footer";
import { useState, useEffect, useRef } from "react";

function App() {
  // useEffect fix
  const effectRan = useRef(false);

  const API_URL = "http://localhost:3500/items";

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("mounted");

    if (effectRan.current === false) {
      const fetchItems = async () => {
        try {
          const response = await fetch(API_URL);

          // Guard clause (manual error handling)
          if (!response.ok) throw Error("Did not receive expected data");

          const listItems = await response.json();
          setItems(listItems);

          // If we have a successful request we will set the fetchError to null
          setFetchError(null);
        } catch (err) {
          // Set the fetchError to err.message
          setFetchError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      // This is just to simulate the slow loading times when we get data from a real server
      setTimeout(() => {
        // This is an async IIFE (this is the same as calling: fetchItems())
        (async () => await fetchItems())();
      }, 2000);

      return () => {
        console.log("unmounted");
        effectRan.current = true;
      };
    }
  }, []);

  const addItem = (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);
  };

  const handleCheck = (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);
  };

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
  };

  const handleSubmit = (e) => {
    // Prevents the page from loading after a form submit
    e.preventDefault();

    // To make sure we will not get a blank list item (guard clause)
    if (!newItem) return;

    // Adding a new item by calling the addItem() function
    addItem(newItem);

    // Clearing the input after submit
    setNewItem("");
  };

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch} />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && (
          <Content
            items={items.filter((item) =>
              item.item.toLowerCase().includes(search.toLowerCase())
            )}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;
