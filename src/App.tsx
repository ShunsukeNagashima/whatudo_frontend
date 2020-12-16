import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import NewTask from './tasks/pages/NewTask';
import Auth from './user/pages/Auth';
import TaskList from './tasks/pages/TaskList'
import NewProject from './projects/pages/NewProject';
import MainContent from './shared/components/UIElements/MainContent';
import Navigation from './shared/components/UIElements/Navigation';
import Dashboard from './user/pages/Dashboard';
import Header from './shared/components/UIElements/Header';
import ChooseProject from './projects/pages/ChooseProject';
import { AuthContext } from './shared/contexts/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import { ProjectContext } from './shared/contexts/project-context';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex'
  },
  column: {
    flexDirection: 'column'
  }
}))

const App = () => {

  const { login, logout, token, userId, allProjects, selectProject, selectedProject  } = useAuth();

  const classes = useStyles();

  let routes: JSX.Element
  let contents: JSX.Element

  console.log(allProjects);

  if (token && selectedProject) {
    routes = (
      <Switch>
        <Route path='/dashboard'>
          <Dashboard />
        </Route>
        <Route path='/tasks/new'>
          <NewTask />
        </Route>
        <Route path='/tasks'>
          <TaskList />
        </Route>
        <Route path='/projects/new'>
          <NewProject />
        </Route>
        <Redirect to='/dashboard' />
      </Switch>
    )
    contents = (
      <div className={classes.root}>
        <Navigation />
        <MainContent content={routes} />
      </div>
    )
  } else if (token) {
    routes = (
      <Switch>
        <Route path='/projects'>
           <ChooseProject />
         </Route>
         <Redirect to='/projects' />
      </Switch>
    )
    contents = (
      <div className={`${classes.root} ${classes.column}`}>
        <Header />
        {routes}
      </div>
    )
  } else {
    routes = (
      <Switch>
        <Route path='/' exact>
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/' />
      </Switch>
    )
    contents = (
      <div className={`${classes.root} ${classes.column}`}>
        <Header />
        {routes}
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        projects: allProjects,
        login: login,
        logout: logout
      }}
    >
      <ProjectContext.Provider
        value={{
          selectedProject: selectedProject,
          selectProject: selectProject
        }}
      >
        <Router>
          { contents}
        </Router>
      </ProjectContext.Provider>

    </AuthContext.Provider>

  );
}

export default App;
