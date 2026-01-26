

const LoadingScreen = () => {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-darker">
            <div className="spinner-border me-2" role="status" />
            <span>Loading...</span>
        </div>
    );
}

export default LoadingScreen;