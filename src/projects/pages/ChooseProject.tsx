import React, { useContext, useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
import { ProjectContext } from '../../shared/contexts/project-context';
import SnackBar from '../../shared/components/UIElements/SnackBar';

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

interface stateType {
  message: string
}

const ChooseProject = () => {

  const classes = useStyles();
  const [project, setProject] = React.useState<string>();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState<string>('');
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);

  const { state } = useLocation<stateType>();

  useEffect(() => {
    if (state) {
      setMessage(state.message);
      setShowSnackBar(true)
    }
  }, [state])

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

  const closeSnackBar = () => {
    setShowSnackBar(false);
  }

  const projectSubmitHandler = (pid: string | undefined) => {
    const selectedProject = projectContext.allProjects.find(p => p._id === pid)
    selectedProject && projectContext.selectProject(selectedProject)
  }

  let content;
  if (projectContext.allProjects.length > 0) {
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
              projectContext.allProjects && projectContext.allProjects.map((project: IProject) => {
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
          Select
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
            プロジェクト選択
          </Typography>
          {content}
      </Paper>

      <SnackBar
        open={showSnackBar}
        close={closeSnackBar}
        message={message}
      />
    </Container>
  );
};

export default ChooseProject;