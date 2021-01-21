import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
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
import UpdateTask from './tasks/pages/UpdateTask';
import { AuthContext } from './shared/contexts/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import { ProjectContext } from './shared/contexts/project-context';
import AlertDialog from './shared/components/UIElements/AlertDialog'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex'
  },
  column: {
    flexDirection: 'column'
  }
}))

const App = () => {

  const { login, logout, token, userId, allProjects, selectProject, selectedProject, open, closeConfimation } = useAuth();

  const classes = useStyles();

  let routes: JSX.Element
  let contents: JSX.Element

  if (token && selectedProject) {
    routes = (
      <Switch>
        <Route path='/dashboard'>
          <Dashboard />
        </Route>
        <Route path='/tasks/new' exact>
          <NewTask />
        </Route>
        <Route path='/tasks/:taskId'>
          <UpdateTask />
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
        <Route path='/projects/new'>
          <NewProject />
        </Route>
        <Route path='/projects'>
           <ChooseProject />
         </Route>
         <Route path='/auth'>
          <Auth />
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
        token,
        userId,
        login,
        logout
      }}
    >
      <ProjectContext.Provider
        value={{
          selectedProject,
          selectProject,
          allProjects
        }}
      >
        <Router>
          { contents}
        </Router>
        <AlertDialog
          show={open}
          dialogTitle={'セッションタイムアウト'}
          contentText={'セッションが切れました。再度ログインしてください。'}
          ok={'ログイン画面へ'}
          closeDialog={closeConfimation}
          actionForYes={logout}
        />

      </ProjectContext.Provider>

    </AuthContext.Provider>

  );
}

export default App;
