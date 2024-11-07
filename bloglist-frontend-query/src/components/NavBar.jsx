import { Link } from 'react-router-dom'

import { AppBar, Button, Toolbar } from "@mui/material"

const NavBar = (props) => {
  const navBarStyle = {
    backgroundColor: 'lightgray',
  }

  const positionLeft = {
    marginLeft: 'auto',
  }
  return (
    <AppBar position='static'>
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
        blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
        users
        </Button>
        <div style={positionLeft}>
          {props.children}
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
