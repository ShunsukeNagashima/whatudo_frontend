import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import NewTask from './tasks/pages/NewTask';
import Auth from './user/pages/Auth';
import TopPage from './user/pages/TopPage';
import TaskList from './tasks/pages/TaskList'
import NewProject from './projects/pages/NewProject';
import MainContent from './shared/components/UIElements/MainContent';
import Navigation from './shared/components/UIElements/Navigation';
import Dashboard from './user/pages/Dashboard';
import Header from './shared/components/UIElements/Header';
import ChooseProject from './projects/pages/ChooseProject';
import UpdateTask from './tasks/pages/UpdateTask';
import InviteUser from './projects/pages/InviteUser';
import { AuthContext } from './shared/contexts/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import { ProjectContext } from './shared/contexts/project-context';
import AlertDialog from './shared/components/UIElements/AlertDialog'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { drawerWidth } from './shared/components/UIElements/Navigation';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  copyRight: {
    width: '100%',
    alignSelf: 'center',
    padding: theme.spacing(2)
  },
  marginLeft: {
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth
    }
  },
}))

export const Copyright = () => {
  return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © Shunsuke Nagashima'}
        {new Date().getFullYear()}
        {'.'}
      </Typography>

  );
}

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
        <Route path='/projects/invite'>
          <InviteUser />
        </Route>
        <Redirect to='/tasks' />
      </Switch>
    )
    contents = (
      <div className={classes.root}>
        <Navigation />
        <MainContent content={routes} />
        <Box pt={4} className={`${classes.copyRight} ${classes.marginLeft}`}>
          <Copyright />
        </Box>
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
         <Redirect to='/projects' />
      </Switch>
    )
    contents = (
      <div className={classes.root}>
        <Header />
        {routes}
        <Box pt={4} className={classes.copyRight}>
          <Copyright />
        </Box>
      </div>
    )
  } else {
    routes = (
      <Switch>
        <Route path='/projects/addUser/'>
          <Auth loginMode={true}/>
        </Route>
        <Route path='/' exact>
          <TopPage />
        </Route>
        <Route path='/auth'>
          <Auth loginMode={true}/>
        </Route>
        <Redirect to='/' />
      </Switch>
    )
    contents = (
      <div className={classes.root}>
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

          <AlertDialog
            show={open}
            dialogTitle={'セッションタイムアウト'}
            contentText={'セッションが切れました。再度ログインしてください。'}
            ok={'ログイン画面へ'}
            closeDialog={closeConfimation}
            actionForYes={logout}
            redirectTo='/auth'
          />
        </Router>

      </ProjectContext.Provider>

    </AuthContext.Provider>

  );
}

export default App;
