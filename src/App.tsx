import Grid from "./components/Grid";
import Form from "./components/Form";

function App() {
    return (
        <div className="flex items-center justify-evenly w-full h-full bg-primary-900">
            <Form />
            <Grid cellSize={80} />
        </div>
    );
}

export default App;
