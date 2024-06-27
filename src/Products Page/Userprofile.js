import React,{useState,useEffect} from 'react'

export default function Userprofile() {
  const [userData, setUserData] = useState({});
  const userEmail = localStorage.getItem('userEmail');
  console.log('User Email:', userEmail);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://localhost:3001/api/user/?email=${userEmail}`);
        setUserData(response.data);
        console.log(userData)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userEmail]);
  return (
    <div>


<h1>userprofile</h1>
        <h3>User Information</h3>
        <p>Company Name: {userData.companyName}</p>
        <p>Title: {userData.title}</p>
        <p>First Name: {userData.firstName}</p>
        <p>Second Name: {userData.secondName}</p>
        <p>Address 1: {userData.address1}</p>
        <p>Address 2: {userData.address2}</p>
        <p>City: {userData.city}</p>
        <p>Zip Code: {userData.zip}</p>
        <p>Phone: {userData.phone}</p>
        <p>Email: {userData.email}</p>
    </div>
  )
}
