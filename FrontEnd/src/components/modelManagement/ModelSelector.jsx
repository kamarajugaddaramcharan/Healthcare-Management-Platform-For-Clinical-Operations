import "./ModelSelector.css";

function ModelSelector({ models, selectedModel, setSelectedModel }) {

    return (

        <div className="model-selector">

            {models.map((model) => (

                <button
                    key={model.id}
                    className={
                        selectedModel.id === model.id
                            ? "model-btn active"
                            : "model-btn"
                    }
                    onClick={() => setSelectedModel(model)}
                >
                    {model.version}
                </button>

            ))}

        </div>

    );

}

export default ModelSelector;