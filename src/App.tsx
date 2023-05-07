import Grid from "./components/Grid";

function App() {
    return (
        <div className="flex items-center justify-center w-full h-full bg-primary-900">
            <Grid cellSize={64} />
        </div>
    );
}

export default App;
