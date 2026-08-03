import { createContext, useContext } from "react";

const CollaborationContext = createContext(null);

export const CollaborationProvider = CollaborationContext.Provider;

export const useCollaborationContext = () => {

    const context = useContext(CollaborationContext);

    if (!context) {

        throw new Error(
            "useCollaborationContext must be used inside CollaborationProvider"
        );

    }

    return context;

};