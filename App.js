import React, { Component } from 'react';
import {YellowBox} from 'react-native';
import AppContainer from './src/components/nav/AppContainer';

// YellowBox.ignoreWarnings(['ListView is deprecated']);

class App extends Component {
  
  render() {
    return <AppContainer />;
  }
}

export default App;
