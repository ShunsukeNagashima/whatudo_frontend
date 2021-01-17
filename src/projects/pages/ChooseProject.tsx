import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Paper,
  Container,
  Typography
} from '@material-ui/core';
import { IProject } from '../../shared/interfaces/shared-interfaces';
import { AuthContext } from '../../shared/contexts/auth-context';
import { ProjectContext } from '../../shared/contexts/project-context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(5)
    },
    formControl: {
      minWidth: 300,
    },
    paper: {
      height: '300px',
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
  }),
);

const ChooseProject = () => {

  const classes = useStyles();
  const [project, setProject] = React.useState<string>();
  const [open, setOpen] = React.useState(false);

  const auth = useContext(AuthContext);
  const projectContext = useContext(ProjectContext);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setProject(event.target.value as string);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const projectSubmitHandler = (pid: string | undefined) => {
    const selectedProject = auth.projects.find(p => p._id === pid)
    selectedProject && projectContext.selectProject(selectedProject)
  }

  let content;
  if (auth.projects.length > 0) {
    content = (
      <React.Fragment>
        <FormControl className={classes.formControl}>
          <InputLabel id="project-label">Project</InputLabel>
          <Select
            labelId="project-label"
            id="project"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={project}
            onChange={handleChange}
          >
            {
              auth.projects && auth.projects.map((project: IProject) => {
                return <MenuItem value={project._id}>{project.name}</MenuItem>
              })
            }
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          disabled={!project}
          onClick={() => projectSubmitHandler(project)}>
          Sign In With This Project
        </Button>
      </React.Fragment>
    )
  } else {
    content = (
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/projects/new" >
        Create New Project
      </Button>
    )

  }

  return (
    <Container component="main" maxWidth="sm" className={classes.root}>
      <Paper className={classes.paper}>
          <Typography variant="h4">
            ログインするプロジェクト
          </Typography>
          {content}
      </Paper>
    </Container>
  );
};

export default ChooseProject;