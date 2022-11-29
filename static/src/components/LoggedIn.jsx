import React, { useState, useEffect } from 'react'
import { useAuth0 } from '../react-auth0-spa'
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi'

const LoggedIn = () => {
    const [voted, setVoted] = useState({
        "world-of-authcraft": "",
        "ocean-explorer": "",
        "dinosaur-park": "",
        "cars-vr": "",
        "robin-hood": "",
        "real-world-vr": "",
    });
    const [products, setProducts] = useState([]);

    const {
        getTokenSilently,
        loading,
        user,
        logout,
        isAuthenticated,
    } = useAuth0()

    useEffect(() => {
        const getProducts = async () => {
          try {
            const token = await getTokenSilently();
            const response = await fetch("http://localhost:8080/products", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            const responseData = await response.json();
    
            setProducts(responseData);
          } catch (error) {
            console.error(error);
          }
        };
    
        getProducts();
    }, []);

    const vote = async (slug, type, index) => {
        try {
          const token = await getTokenSilently();
          const response = await fetch(
            `http://localhost:8080/products/${slug}/feedback`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ vote: type }),
            }
          );
          
          if (response.ok) {
            setVoted({
                ...voted,
                [slug]: [type],
            });
          } else console.log(response.status);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading || !user) {
        return <div>Loading ...</div>
    }

    return (
        <div className="container">
            <div className="jumbotron text-center mt-5">
                {
                    isAuthenticated && (
                        <span className="btn btn-primary float-right" onClick={() => logout()}>
                            Log out
                        </span>
                    )
                }
                <h1>Lorem ipsum something</h1>
                <p>
                    Hi, {user.name}! Lorem ipsum something, Lorem ipsum something, Lorem ipsum something
                </p>
                <div className="row">
                    {products.map(function (product) {
                        return (
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-header">
                                        { product.Name }
                                        <span className="float-left">
                                            { voted }
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        { product.Description }
                                    </div>
                                    <div className="card-footer">
                                        <a onClick={() => vote("Upvoted")} className="btn btn-default float-left">
                                            <FiThumbsUp />
                                        </a>
                                        <a onClick={() => vote("Downvoted")} className="btn btn-default float-right">
                                            <FiThumbsDown />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default LoggedIn;