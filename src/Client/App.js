import { useState, useEffect } from 'react'
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const getData = async () => {
      const users = await axios.get('http://localhost:5000/bank/users/');
      setData(users.data)
    }
    getData();
  }, [])

  return (
    <div className="App">
      
        <h1>Bank Accounts</h1>
      {data.map((user) => {
        return (
          <div key={user._id}>
            <p>account id: {user.id}</p>
            <p>cash: {user.cash}</p>
            <p>credit: {user.credit}</p><br/>
          </div>
          )
        }
      )}
    
    </div>
  );
}

export default App;
