import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/core';

export const formStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
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
      minWidth: 200,
      [theme.breakpoints.down('xs')]: {
        minWidth: 100
      }
    },
    paper: {
      display: 'flex',
      alignItems: 'center',
      paddig: theme.spacing(3),
      minHeight: theme.spacing(10),
      marginTop: theme.spacing(3),
    },
    avatar: {
      marginLeft: theme.spacing(2)
    },
    comment: {
      marginLeft: theme.spacing(2),
      flexBasis: '80%'
    },
    commentForm: {
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      width: '90%',
      padding: theme.spacing(1, 0)
    },
    commentButtons: {
      display: 'flex',
      justifyContent: 'space-around'
    }
  }),
);

export const PrettoSlider = withStyles({
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