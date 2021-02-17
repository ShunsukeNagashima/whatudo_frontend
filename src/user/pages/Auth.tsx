import React, { useState, useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  Container,
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/contexts/auth-context'
import { ProjectContext } from '../../shared/contexts/project-context'
import Modal from '../../shared/components/UIElements/Modal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

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
}))

interface IFormInputs {
  userName: string
  email: string
  password: string
}

interface AuthProps {
  loginMode: boolean
}

interface stateType {
  loginMode: boolean
}

const Auth = (props: AuthProps) => {
  const classes = useStyles()
  const { sendRequest, loading, error, clearError } = useHttpClient()
  const [isLoginMode, setIsLoginMode] = useState(props.loginMode)
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const projectContext = useContext(ProjectContext)

  const history = useHistory()
  const location = useLocation()
  const { state } = useLocation<stateType>()

  useEffect(() => {
    if (location.search !== '') {
      const token = location.search.split('=')[1]
      setInviteToken(token)
    }
  }, [location.search])

  useEffect(() => {
    if (state) {
      setIsLoginMode(state.loginMode)
    }
  }, [state])

  const switchModeHandler = () => {
    setIsLoginMode((prevState) => !prevState)
  }

  const { errors, control, handleSubmit, formState } = useForm<IFormInputs>({
    mode: 'onChange',
  })

  const authSubmitHandler = async (data: IFormInputs, event: any) => {
    event.preventDefault()
    if (isLoginMode) {
      try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/auth/login`
        if (inviteToken) {
          url = `${url}?token=${inviteToken}`
        }
        const responseData = await sendRequest(
          url,
          'POST',
          JSON.stringify({
            email: data.email,
            password: data.password,
          }),
          {
            'Content-Type': 'application/json',
          },
        )
        authContext.login(
          responseData.data.userObj.userId,
          responseData.data.userObj.access_token,
          responseData.data.userObj.projects,
        )
        if (inviteToken) {
          projectContext.selectProject(responseData.data.userObj.project)
          history.push('/tasks', { message: responseData.data.message })
        }
        history.push('/projects/', { message: responseData.data.message })
      } catch (err) {}
    } else {
      try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/users/signup`
        if (inviteToken) {
          url = `${url}?token=${inviteToken}`
        }
        const responseData = await sendRequest(url, 'POST', {
          name: data.userName,
          email: data.email,
          password: data.password,
        })
        authContext.login(
          responseData.data.userObj.userId,
          responseData.data.userObj.access_token,
          responseData.data.userObj.projects,
        )
        if (inviteToken) {
          projectContext.selectProject(responseData.data.userObj.project)
          history.push('/tasks', { message: responseData.data.message })
        }
        history.push('/projects/', { message: responseData.data.message })
      } catch (err) {
        console.log(err)
      }
    }
  }

  let errorModal
  if (error?.response) {
    errorModal = (
      <Modal
        title={error.response?.statusText}
        description={error.response?.data.message}
        show={!!error}
        closeModal={clearError}
      />
    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <LoadingSpinner isLoading={loading} />
      {errorModal}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {!isLoginMode ? 'Sign up' : 'Sign in'}
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(authSubmitHandler)}
        >
          <Grid container spacing={2}>
            {!isLoginMode && (
              <Grid item xs={12}>
                <Controller
                  as={
                    <TextField
                      error={errors.userName ? true : false}
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
                  rules={{ required: 'この項目は必須です。' }}
                  name="userName"
                  control={control}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Controller
                as={
                  <TextField
                    error={errors.email ? true : false}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus={isLoginMode}
                    helperText={errors?.email?.message}
                  />
                }
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '不正なメールアドレスです。',
                  },
                }}
                name="email"
                control={control}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={
                  <TextField
                    error={errors.password ? true : false}
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
                rules={{
                  required: 'この項目は必須です。',
                  minLength: {
                    value: 6,
                    message: 'パスワードは6文字以上です。',
                  },
                }}
                name="password"
                control={control}
              />
              {}
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
            {isLoginMode ? 'Sign In' : 'Sign Up'}
          </Button>
          <Grid container>
            <Grid item>
              <Link
                style={{ cursor: 'pointer' }}
                variant="body2"
                onClick={switchModeHandler}
              >
                {!isLoginMode
                  ? 'アカウントをお持ちですか？ログイン'
                  : '今すぐサインアップ'}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

export default Auth
