import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import 'date-fns';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import {
  TextField,
  Container,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Slider,
  Typography,
  Button
} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import axios from 'axios';
import { AuthContext } from '../../shared/contexts/auth-context';
import { ProjectContext } from '../../shared/contexts/project-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
// import Modal from '../../shared/components/UIElements/Modal'
import { formatDate } from '../../shared/utils/util-functions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      alignSelf: 'start'
    },
    margin_top: {
      marginTop: 20
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      alignSelf: 'center',
      minWidth: 200
    }
  }),
);

const PrettoSlider = withStyles({
  root: {
    color: '#3880ff',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  }
})(Slider);

interface IFormInputs {
  category: string,
  title: string,
  description: string,
  limitdate: Date,
  progress: number,
  status: string,
  personInCharge: string
}

const NewTask  = () => {

  const classes = useStyles();
  const authContext = useContext(AuthContext);
  const projectContext = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedUsers, setFetchedUsers] = useState<any[]>([]);
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([])

  const { control, handleSubmit, errors, formState} = useForm<IFormInputs>({
    mode: 'onChange'
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const responseData = await axios.get(
          'http://localhost:5000/api/users/' + projectContext.selectedProject!._id,
          {
            headers: { Authorization: 'Bearer ' + authContext.token }
          }
        )
        setFetchedUsers(responseData.data)
      } catch(err) {
        setError(err.message)
        setLoading(false);
      }
      setLoading(false);
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const responseData = await axios.get(
          'http://localhost:5000/api/categories',
          {
            headers: { Authorization: 'Bearer ' + authContext.token }
          }
        )
        setFetchedCategories(responseData.data)
      } catch(err) {
        setError(err.message)
        setLoading(false)
        throw err;
      }
      setLoading(false)
    }
    fetchCategories()
  }, [])

  const history = useHistory();

  const taskSubmitHandler = async (data: IFormInputs) => {
    const formatedDate = formatDate(data.limitdate, false)
    console.log(data.personInCharge);
    try {
      setLoading(true)
      await axios.post(
        'http://localhost:5000/api/tasks',
        {
          title: data.title,
          description: data.description,
          limitDate: formatedDate,
          progress: data.progress,
          status: data.status,
          personInCharge: data.personInCharge,
          category: data.category,
          project: projectContext.selectedProject!._id
        },
        {
          headers: {
            Authorization: 'Bearer ' + authContext.token
          }
        }
      )
      setLoading(false)
    } catch(err) {
      console.log(err);
      setLoading(false)
      throw err;
    }
    history.push('/tasks')
};

  if (error) {
    return (
      <div>

      </div>
    )
  }

  return (
    <Container component="main" maxWidth="md">
      <LoadingSpinner isLoading={loading} />
      <form className={classes.form} onSubmit={handleSubmit(taskSubmitHandler)}>
        <FormControl className={classes.formControl}>
          <InputLabel id="category">カテゴリ(必須)</InputLabel>
          <Controller
            as={
              <Select
                id="category"
                labelId="category"
              >
                {
                  setFetchedCategories && fetchedCategories.map(c => {
                    return <MenuItem value={c._id}>{c.name}</MenuItem>
                  })
                }
              </Select>
            }
            name="category"
            control={control}
            rules={{ required: 'カテゴリは必須です'}}
            />
        </FormControl>

        <Controller
          as={
            <TextField
              error={errors.title? true: false}
              variant='outlined'
              margin='normal'
              fullWidth
              id='title'
              label='タスク名(必須)'
              // helperText={errors.title!.message}
            />
          }
          name='title'
          control={control}
          rules={{required: "タスク名は必須です。"}}
        />

        <Controller
          as={
            <TextField
              variant='outlined'
              margin='normal'
              fullWidth
              multiline
              rows={5}
              id='description'
              label="説明"
            />
          }
          name='description'
          control={control}
        />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name='limitdate'
                control={control}
                render={({ref, ...rest}) => (
                  <KeyboardDatePicker
                    disableToolbar
                    variant='inline'
                    format='yyyy/MM/dd'
                    margin='normal'
                    id="limitdate"
                    label="期限"
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    className={classes.formControl}
                    {...rest}
                 />
                )}
                defaultValue={new Date()}
              />

             </MuiPickersUtilsProvider>


        <FormControl className={classes.formControl}>
          <InputLabel id="status">状況</InputLabel>
          <Controller
            as={
              <Select
                id="status"
                labelId="status"
              >
                <MenuItem value="新規">新規</MenuItem>
                <MenuItem value="進行中">進行中</MenuItem>
                <MenuItem value="確認待ち">確認待ち</MenuItem>
                <MenuItem value="完了">完了</MenuItem>
              </Select>
            }
            name="status"
            control={control}
            defaultValue="新規"
            />
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="personInCharge">担当者</InputLabel>
          <Controller
            as={
              <Select defaultValue="" id="personInCharge">
                <MenuItem value="">
                  <em>未定</em>
                </MenuItem>
                { fetchedUsers && fetchedUsers.map(u => {
                   return <MenuItem value={u.id}>{u.name}</MenuItem>
                })}
              </Select>
            }
            name='personInCharge'
            control={control}
          />
        </FormControl>

      <FormControl>
        <Typography gutterBottom className={classes.margin_top}>進捗率</Typography>
        <Controller
          render={props =>
            <PrettoSlider
              {...props}
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              onChange={(_, value) => props.onChange(value)}
            />
          }
          name='progress'
          control={control}
          defaultValue={0}
        />
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={!formState.isValid}
     >タスク作成</Button>

    </form>

    </Container>
  );
};

export default NewTask;
