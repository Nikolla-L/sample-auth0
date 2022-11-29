import React, { Fragment } from 'react'
import { useAuth0 } from '../react-auth0-spa'

const Home = () => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

    return (
        <Fragment>
            <div className="container">
                <div className="jumbotron text-center mt-5">
                    <h1>Lorem Ipsum something</h1>
                    <p>
                        Lorem Ipsum something,
                        Lorem Ipsum something,
                        Lorem Ipsum something.
                    </p>
                    {!isAuthenticated && (
                        <button className="btn btn-primary btn-lg btn-login btn-block" onClick={() => loginWithRedirect({})}>Sign in</button>
                    )}
                </div>
            </div>
        </Fragment>
    )
}

export default Home