import React, { useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { IProject } from '../../shared/interfaces/shared-interfaces';
import { AuthContext } from '../../shared/contexts/auth-context';
import { ProjectContext } from '../../shared/contexts/project-context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
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
    const selectedProject = auth.projects.find(p => p._id == pid)
    selectedProject && projectContext.selectProject(selectedProject)
  }

  console.log(project);
  return (
    <div>
      <Button className={classes.button} onClick={handleOpen}>
        プロジェクトを選択してください
      </Button>
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
      <Button onClick={() => projectSubmitHandler(project)}>
        Sign In With This Project
      </Button>
    </div>
  );
};

export default ChooseProject;