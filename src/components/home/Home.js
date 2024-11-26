import React, { useEffect, useState } from 'react'
import { getDataApi, postDataApi } from '../../services/apiService'

const Home = ({ user }) => {
  const [postOffices, setPostOffice] = useState([])
  const [token, setToken] = useState(localStorage.getItem("authToken"))

  const addSubPostOffice=async()=>{
    
    const config = {
        headers: {
          Authorization: `Token ${token}`, // Pass the token for authentication
        },
      }
      const postOffice={
        "pincode": "422608",
        "name": "sangamner Post Office",
        "contactNo": "5566778899",
        "address": "sangamner, Ahmednagar"
    }
      try {
        const res = await postDataApi("/post/postoffice/", postOffice, config)
        console.log("postoffice:", res.data)
        setPostOffice(res.data) // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching post offices:", error)
      }
  }

  const fetchPostOffice = async () => {
    // console.log(token);
    
    const config = {
      headers: {
        Authorization: `Token ${token}`, // Pass the token for authentication
      },
    }
    try {
      const res = await getDataApi("/post/postoffice/", {}, config)
      console.log("postoffice:", res.data)
      setPostOffice(res.data) // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching post offices:", error)
    }
  }

  useEffect(() => {
    const newToken = localStorage.getItem("authToken")
    setToken(newToken)
    fetchPostOffice()
  }, [user, token]) // Add token to the dependencies to trigger effect on token change

  return (
    <div>
      <h2>Home Content</h2>
      <h4>Welcome, {user?.username || 'Guest'}</h4>
      {/* Display fetched post offices or a message if no data */}
      <ul>
        {postOffices.length > 0 ? (
          postOffices.map((postOffice, index) => (
            <li key={index}>{postOffice.name || "Unnamed Post Office"}</li> // Ensure name exists or use a fallback
          ))
        ) : (
          <li>No post offices found.</li> // Fallback message if no post offices
        )}
      </ul>
    </div>
  )
}

export default Home
