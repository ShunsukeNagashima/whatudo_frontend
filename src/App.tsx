import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import NewTask from './tasks/pages/NewTask';
import Auth from './user/pages/Auth';
import Navigation from './shared/components/UIElements/Navigation';
import MainContent from './shared/components/UIElements/MainContent';


const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}))

const App = () => {
  const classes = useStyles();

  let routes: JSX.Element
  routes = (
    <Switch>
        <Route path="/exact">
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route path="/tasks/new">
          <NewTask />
        </Route>
      </Switch>
  )
  return (
    <Router>
    <div className={classes.root}>
      <Navigation />

        <MainContent content={routes} />

    </div>
     </Router>

  );
}

export default App;
