import React, { useState,useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
  
    const [data, setData] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:3001/api/data')
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, []);

  return (
    <div  key={1}>
       <ul  key={data.id} >
        {data.map(item => (
            <ul>
                <li>{item.partnumber}</li>
            <li> {item.Description} </li>
          <li key={item.id}>{item.Price}</li> 
</ul>

        ))}
      </ul>
      
    </div>
  );
};

export default MyComponent;
