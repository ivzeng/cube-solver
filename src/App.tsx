import "./scss/App.css";
import Message from "./components/Message";
import RCube from "./components/RCube";

function App() {
  return (
    <div className="app">
      {/*<Message children="Features are still under development ~" />*/}
      <RCube />
    </div>
  );
}

export default App;
