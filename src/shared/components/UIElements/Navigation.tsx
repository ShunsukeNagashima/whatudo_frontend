import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  IconButton,
  Button,
  List,
  Select,
  MenuItem,
  FormControl,
  Hidden
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ListItems from './ListItems';
import { AuthContext } from '../../contexts/auth-context';
import { ProjectContext } from '../../contexts/project-context';
import { IProject } from '../../interfaces/shared-interfaces';
import {  makeStyles, useTheme } from '@material-ui/core/styles';


export const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    display: 'flex'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  projectSelect: {
    backgroundColor: 'inherit',
    color: '#fff',
  },
  flexGrow: {
    flexGrow: 1
  },
}));

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Navigation = (props: Props) => {
  const authContext = useContext(AuthContext);
  const projectContext = useContext(ProjectContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { window } = props;
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  }

  const drawer = (
    <React.Fragment>
      <div className={classes.toolbar} />
      <Divider />
      <List><ListItems closeSideBar={handleDrawerClose}/></List>
    </React.Fragment>
  )

  const container = window !== undefined ? () => window().document.body : undefined;


  const changeProject = (project: IProject) => {
    projectContext.selectProject(project)
    history.push('/');
  }
  return (
    <div className={classes.root}>
    <CssBaseline />
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>

        <FormControl>
            <Select
              variant="standard"
              className={classes.projectSelect}
              id="project"
              labelId="project"
              value={projectContext.selectedProject?._id}
            >
              {
                projectContext.allProjects && projectContext.allProjects.map(p => {
                  return (
                    <MenuItem
                      onClick={() => changeProject(p)}
                      value={p._id}>
                      {p.name}
                    </MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>

          <div className={classes.flexGrow}/>

          <Button
            color="inherit"
            onClick={authContext.logout}
            >
            Logout
          </Button>

      </Toolbar>
    </AppBar>

    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden mdUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={open}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>

      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  </div>
  );
}

export default Navigation