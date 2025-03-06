import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import Navigation from './Navigation';

function App() {
    return (
        <NavigationIndependentTree>
              <NavigationContainer>
            <Navigation />
            </NavigationContainer>
        </NavigationIndependentTree>
      
    );  
}

export default App;
