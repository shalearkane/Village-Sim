import { useEffect, useRef } from "react";
import "./App.css";
import { render } from "./renderer";

function App() {
  const refContainer = useRef(null);

  useEffect(() => {
    render(refContainer);
  }, []);

  return (
    <>
      <div ref={refContainer}></div>
    </>
  );
}

export default App;
