import React, { useEffect } from 'react';
import Navbar from './Navbar';

const HomePage = () => {
    // useEffect(() => {
    //     window.history.pushState(null, '', window.location.href);
    //     window.onpopstate = () => {
    //         window.history.pushState(null, '', window.location.href);
    //     };
    // }, []);

    return (
        <div>
          <Navbar />
            Welcome to the Home Page!
        </div>
    );
};

export default HomePage;
