import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import 'date-fns';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import { TextField, Container, InputLabel, MenuItem, FormControl, Select, Slider, Typography, Button, CircularProgress} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
// import useAxios from 'axios-hooks';
import axios from 'axios';
import { AuthContext } from '../../shared/contexts/auth-context';

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
  title: string,
  description: string,
  limitdate: Date,
  progress: number,
  status: string,
  groupInCharge: string,
  personInCharge: string

}

const NewTask  = () => {

  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedUser, setFetchedUser] = useState<any[]>([]);

  const { control, handleSubmit, errors, formState} = useForm<IFormInputs>({
    mode: 'onChange'
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const responseData = await axios.get(
          'http://localhost:5000/api/users/:projectId',
          {
            headers: { Authorization: 'Bearer ' + auth.token }
          }
        )
        setFetchedUser(responseData.data)
      } catch(err) {
        setError(err.message)
        setLoading(false);
      }
      fetchUsers()
      setLoading(false);
    }
  }, [])

  // let [{ loading, error }, execute] = useAxios({
  //   method: 'POST',
  // },{ manual: true })

  // let [{data}] = useAxios({
  //   url: 'http://localhost:5000/api/users/:projectId',
  //   headers: {
  //     Authorization: 'Bearer ' + auth.token
  //   }
  // })

  const taskSubmitHandler = async (data: IFormInputs) => {
    try {
      setLoading(true)
      await axios.post(
        'http://localhost:5000/api/tasks',
        {
          title: data.title,
          description: data.description,
          limitDate: data.limitdate,
          progress: data.progress,
          status: data.status,
          groupInCharge: data.groupInCharge,
          personInCharge: data.personInCharge
        },
        {
          headers: {
            Authorization: 'Bearer ' + auth.token
          }
        }
      )
      setLoading(false)
    } catch(err) {
      console.log(err);
      setLoading(false)
    }
};

  // const taskSubmitHandler = async (data: IFormInputs) => {
  //     try {
  //       await execute({
  //         url: 'http://localhost:5000/api/tasks',
  //         data: {
  //           title: data.title,
  //           description: data.description,
  //           limitDate: data.limitdate,
  //           progress: data.progress,
  //           status: data.status,
  //           groupInCharge: data.groupInCharge,
  //           personInCharge: data.personInCharge
  //         },
  //         headers: {
  //           Authorization: 'Bearer ' + auth.token
  //         }
  //       })
  //     } catch(err) {
  //       console.log(err);
  //     }
  // };

  if (error) {
    return (
      <div>
        ERROR!
      </div>
    )
  }

  return (
    <Container component="main" maxWidth="md">
      <form className={classes.form} onSubmit={handleSubmit(taskSubmitHandler)}>
        { loading && <CircularProgress />}
        <Controller
          as={
            <TextField
              error={errors.title? true: false}
              variant='outlined'
              margin='normal'
              fullWidth
              id='title'
              label='タスク名(必須)'
              // helperText={errors.title.message}
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
                    id="date-picker-inline"
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
          <InputLabel htmlFor="grouped-select">担当者</InputLabel>
          <Controller
            as={
              <Select defaultValue="" id="grouped-select">
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                { fetchedUser.forEach(u => {
                   <MenuItem value={u.name}>u.name</MenuItem>
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
