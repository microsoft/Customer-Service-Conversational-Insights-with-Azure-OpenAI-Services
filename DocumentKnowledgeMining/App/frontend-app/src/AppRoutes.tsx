import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home/home";
import { ChatPage } from "./pages/chat/chatPage";
// import { PersonalDocumentsPage } from "./pages/personalDocuments/personalDocumentsPage";
import { useState } from "react";
import { SearchFacet } from "./types/searchRequest";

function App() {
    

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            {/* <Route path="/personalDocuments" element={<PersonalDocumentsPage/>} /> */}
            <Route path="/search" element={<Home isSearchResultsPage={true} />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

function NotFound() {
    return (
        <main className="p-8 md:px-24">
            <h1>Not Found</h1>
        </main>
    );
}

/*
* No need to use ProtectedRoute component as all routes in this app are protected and we use a MsalAuthenticationTemplate at App level.
* <Route path="/something"
*         element={<ProtectedRoute isAllowed={isPlatformAdmin(accounts)}>
*                        <PageA />
*                 </ProtectedRoute>}
* /> 
*
function ProtectedRoute({ isAllowed, children }: { isAllowed?: boolean; children: JSX.Element }): JSX.Element | null {
    const { instance, inProgress } = useMsal();

    if (isAllowed === undefined) isAllowed = instance.getActiveAccount() !== null;

    useEffect(() => {
        // Force user login if he isn't and has no access.
        if (!isAllowed && inProgress === InteractionStatus.None && instance.getActiveAccount() == null) {
            instance.loginRedirect(Auth.getAuthenticationRequest() as RedirectRequest);
        }
    }, [inProgress]);

    if (inProgress && inProgress === InteractionStatus.None) {
        if (isAllowed) return children ? children : <Outlet />;
        else return <Unauthorized />;
    } else {
        return null;
    }
}

function Unauthorized() {
    const { instance } = useMsal();

    function signOut() {
        instance.logoutRedirect();
    }
    return (
        <main className="p-8 md:px-24">
            <h1>Unauthorized</h1>
            <button onClick={signOut}>Logout</button>
        </main>
    );
}
*/
export default App;
