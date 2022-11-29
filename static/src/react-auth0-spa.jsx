import React, { useState, useEffect, useContext } from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'

const DEFAULT_REDIRECT_CALLBACK = () => window.history.replaceState(
    {}, document.title, window.location.pathname,
)

export const Auth0Context = React.createContext()

export const useAuth0 = () => useContext(Auth0Context)

export const Auth0Provider = ({
    children,
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    ...initOptions
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState()
    const [user, setUser] = useState()
    const [auth0Client, setAuth0] = useState()
    const [loading, setLoading] = useState(true)
    const [popupOpen, setPopupOpen] = useState(false)

    useEffect(() => {
        const initAuth0 = async () => {
            const auth0FormHook = await createAuth0Client(initOptions)
            setAuth0(auth0FormHook)

            if(window.location.search.includes("code=")
                && window.location.search.includes("state=")
            ) {
                const { appState } = await auth0FormHook.handleRedirectCallback()
                onRedirectCallback(appState)
            }

            const isAuthenticated = await auth0FormHook.isAuthenticated()
            setIsAuthenticated(isAuthenticated)

            if(isAuthenticated) {
                const user = await auth0FormHook.getUser()
                setUser(user)
            }
            
            setLoading(false)
        }

        initAuth0()
    }, [])

    const loginWithPopup = async (params = {}) => {
        setPopupOpen(true)

        try {
            await auth0Client.loginWithPopup(params);
        } catch (error) {
            console.error(error)
        } finally {
            setPopupOpen(false)
        }

        const user = await auth0Client.getUser()
        setUser(user)
        setIsAuthenticated(true)
    }

    const handleRedirectCallback = async () => {
        setLoading(true)

        await auth0Client.handleRedirectCallback()
        const user = await auth0Client.getUser()

        setLoading(false)
        setIsAuthenticated(true)
        setUser(user)
    }

    return (
        <Auth0Context.Provider
            value={{
                loading,
                isAuthenticated,
                user,
                popupOpen,
                loginWithPopup,
                handleRedirectCallback,
                getIdTokenClaims: (...params) => auth0Client.getIdTokenClaims(...params),
                loginWithRedirect: (...params) => auth0Client.loginWithRedirect(...params),
                getTokenSilently: (...params) => auth0Client.getTokenSilently(...params),
                getTokenWithPopup: (...params) => auth0Client.getTokenWithPopup(...params),
                logout: (...params) => auth0Client.logout(...params)
            }}
        >
            { children }
        </Auth0Context.Provider>
    )
};