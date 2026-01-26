import PageTitle from "../hooks/PageTitle";

function HomePage() {
    PageTitle("Home");

    const cards = [
        {
            title: "Card title 1",
            text: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
            link: "#",
        },
        {
            title: "Card title 2",
            text: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
            link: "#",
        },
        {
            title: "Card title 3",
            text: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
            link: "#",
        },
        {
            title: "Card title 4",
            text: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
            link: "#",
        },
        {
            title: "Card title 4",
            text: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
            link: "#",
        },
        {
            title: "Card title 4",
            text: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
            link: "#",
        },
        {
            title: "Card title 4",
            text: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
            link: "#",
        },
        {
            title: "Card title 4",
            text: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
            link: "#",
        },
    ];

    return (
        <div className="container  min-vh-100">
          
            <h5 className="text-center text-danger mb-4">Under Construction!</h5>

            <div className="d-flex flex-wrap justify-content-center gap-3">
                {cards.map((card, index) => (
                    <div key={index} className="card  shadow rounded" style={{ width:"18rem" }}>
                        <img
                            src="https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg"
                            className="card-img-top"
                            alt="Card visual"
                        />
                        <div className="card-body">
                            <h5 className="card-title">{card.title}</h5>
                            <p className="card-text">{card.text}</p>
                            <a href={card.link} className="btn btn-primary">
                                Go somewhere
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
