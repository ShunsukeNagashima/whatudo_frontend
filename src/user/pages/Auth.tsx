import React, {useState, useContext} from 'react';
import { withRouter,RouteComponentProps } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Typography, Container, CircularProgress} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { AuthContext } from '../../shared/contexts/auth-context';
import { AxiosResponse } from 'axios';
import { IProject } from '../../shared/interfaces/shared-interfaces';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  overlay: {
    height: '100%',
    width: '100%',
    position: "absolute",
    top: 0,
    left: 0,
    background: 'rgba(255,255,255,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

interface IFormInputs {
  userName: string,
  email: string,
  password: string
}

interface AuthApiResponse {
  userId: string,
  projects: IProject[],
  access_token: string
}

const Auth = (props: RouteComponentProps) => {
  const classes = useStyles();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const auth = useContext(AuthContext);

  const [{ loading, error }, execute ] = useAxios({
    method: 'POST',
  },{ manual: true })

  const switchModeHandler = () => {
    setIsLoginMode(prevState => !prevState);
  };

  const { errors, control, handleSubmit, formState} = useForm<IFormInputs>({
    mode: 'onChange'
  });

  const authSubmitHandler = async (data: IFormInputs, event: any) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const responseData: AxiosResponse<AuthApiResponse> = await execute({
          url: 'http://localhost:5000/api/auth/login',
          data: JSON.stringify({
            email: data.email,
            password: data.password
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        auth.login(responseData.data.userId, responseData.data.access_token, responseData.data.projects)
        props.history.push('/projects/')
      } catch(err) {
        console.log(err);
      }
    } else {
      try {
        const responseData: AxiosResponse<AuthApiResponse> = await execute({
          url: 'http://localhost:5000/api/users/signup',
          data: {
            name: data.userName,
            email: data.email,
            password: data.password
          }
        });
        auth.login(responseData.data.userId, responseData.data.access_token, responseData.data.projects)
      } catch(err) {
        console.log(err);
      };
    }
  };

  if (error) {
    return (
      <div>
        Error!!
      </div>
    )
  }

  if (loading) {
    return (
      <div className={classes.overlay}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {!isLoginMode? "Sign up" : "Sign in"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(authSubmitHandler)}>
          <Grid container spacing={2}>
              {!isLoginMode &&
                <Grid item xs={12}>
                  <Controller
                    as={
                      <TextField
                        autoComplete="name"
                        name="UserName"
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="UserName"
                        autoFocus={!isLoginMode}
                        helperText={errors?.userName?.message}
                      />
                    }
                    name="userName"
                    control={control}
                  />
                </Grid>
              }
              <Grid item xs={12}>
                <Controller
                  as={
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus={isLoginMode}
                      helperText={errors?.email?.message}
                    />
                  }
                  name="email"
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  as={
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      helperText={errors?.password?.message}
                    />
                  }
                  name="password"
                  control={control}
                 />
              </Grid>

          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!formState.isValid}
          >
            {isLoginMode? "Sign In": "Sign Up"}
          </Button>
          <Grid container>
            <Grid item xs>
              {isLoginMode &&
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
              }
            </Grid>
            <Grid item>
              <Link variant="body2" onClick={switchModeHandler}>
                {!isLoginMode ? "Already have an account? Sign in": "Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>

    </Container>
  );
}

export default withRouter(Auth);
