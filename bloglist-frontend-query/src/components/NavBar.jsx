import { Link } from "react-router-dom"

const NavBar = (props) => {
  const navBarStyle = {
    backgroundColor: 'lightgray'
  }

  const padding = {
    padding: 5
  }
  return (
    <div style={navBarStyle}>
      <Link to='/' style={padding}>blogs</Link>
      <Link to='/users' style={padding}>users</Link>
      {props.children}
    </div>
  )
}

export default NavBar