// import React from 'react';

// const AppContext = React.createContext({});

// export const AppContextProvider = AppContext.Provider

// export default AppContext
import React from "react";

const AppContext = React.createContext({
    isLogin: false,
    setIsLogin: () => {}
});

export default AppContext;