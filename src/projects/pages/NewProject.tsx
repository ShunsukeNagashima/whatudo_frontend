import React, { useContext } from 'react';
import { Container, TextField, CircularProgress, Button } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import useAxios from 'axios-hooks';
import { AuthContext } from '../../shared/contexts/auth-context';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


interface IFormInputs {
  name: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column'
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      alignSelf: 'center',
      minWidth: 200
    }
  }),
);

const NewProject = () => {

  const classes = useStyles();

  const { control, handleSubmit, errors, formState } = useForm<IFormInputs>({
    mode: 'onChange'
  })

  const [{ loading, error }, execute] = useAxios({
    method: 'POST'
  },{manual: true})

  const auth = useContext(AuthContext);

  const projectSubmitHandler = async(data: IFormInputs) => {
    try {
      await execute({
        url: 'http://localhost:5000/api/projects',
        data: {
          name: data.name
        },
        headers: {
          Authorization: 'Bearer ' + auth.token
        }
      })
    } catch(err) {

    }
  }

  if (error) {
    return <div>
      error!
    </div>
  }

  return (
    <Container component="main" maxWidth="md">
      {loading && <CircularProgress />}
      <form className={classes.form} onSubmit={handleSubmit(projectSubmitHandler)}>
        <Controller
          as={
            <TextField
              error={errors.name? true: false}
              variant='outlined'
              margin='normal'
              fullWidth
              id='name'
              label='プロジェクト名'
            />
          }
          name='name'
          control={control}
          rules={{required: 'プロジェクト名は必須です'}}
        />

        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          color="primary"
          disabled={!formState.isValid}
        >タスク作成</Button>
      </form>
    </Container>
  )
};

export default NewProject;