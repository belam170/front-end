import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarker, faHeart } from '@fortawesome/free-solid-svg-icons';


function User() {
  const [users, setUsers] = useState([]);
  const [person, setPerson] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');
  const [relationship, setRelationship] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:9292/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(error => console.error(error));
  }, []);

  function addData() {
    const newUser = {
      name: person,
      email: email,
      telephone_number: telephone,
      address: address,
      relationship: relationship
    };

    fetch('http://localhost:9292/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(data => {
        setUsers(prevUsers => [...prevUsers, data]);
        setPerson('');
        setEmail('');
        setTelephone('');
        setAddress('');
        setRelationship('');
      })
      .catch(error => console.error(error));
  }

  function editData(userId) {
    setSelectedUserId(userId);
    const selectedUser = users.find(user => user.id === userId);
    setPerson(selectedUser.name);
    setEmail(selectedUser.email);
    setTelephone(selectedUser.telephone_number);
    setAddress(selectedUser.address);
    setRelationship(selectedUser.relationship);
  }

  function updateData() {
    const updatedData = {
      name: person,
      email: email,
      telephone_number: telephone,
      address: address,
      relationship: relationship
    };

    fetch(`http://localhost:9292/users/${selectedUserId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(data => {
        setUsers(prevUsers =>
          prevUsers.map(user => {
            if (user.id === data.id) {
              return { ...user, ...data };
            }
            return user;
          })
        );
        setSelectedUserId(null);
        setPerson('');
        setEmail('');
        setTelephone('');
        setAddress('');
        setRelationship('');
      })
      .catch(error => console.error(error));
  }

  function deleteData(userId) {
    fetch(`http://localhost:9292/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        setUsers(prevUsers =>
          prevUsers.filter(user => user.id !== userId)
        );
      })
      .catch(error => console.error(error));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (selectedUserId) {
      updateData();
    } else {
      addData();
    }
  }
  return (
    <>
      <div className='User'>
        {users.map(user => (
          <div key={user.id} className='UserCard'>
          <p>
            <FontAwesomeIcon icon={faUser} /> 
             <span>{user.name}</span>
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} />
            <span>{user.email}</span>
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} />
            <span>{user.telephone_number}</span>
          </p>
          <p>
            <FontAwesomeIcon icon={faMapMarker} />
            <span>{user.address}</span>
          </p>
          <p>
            <FontAwesomeIcon icon={faHeart} />
            <span>{user.relationship}</span>
          </p>
            <div className='UserCardButtons'>
              <button onClick={() => editData(user.id)}>Edit</button>
              <button onClick={() => deleteData(user.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="UserForm">
  <input
    type="text"
    placeholder="Name"
    value={person}
    onChange={e => setPerson(e.target.value)}
    required
  />
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={e => setEmail(e.target.value)}
    required
  />
  <input
    type="tel"
    placeholder="Telephone"
    value={telephone}
    onChange={e => setTelephone(e.target.value)}
    required
  />
  <input
    type="text"
    placeholder="Address"
    value={address}
    onChange={e => setAddress(e.target.value)}
    required
  />
  <input
    type="text"
    placeholder="Relationship"
    value={relationship}
    onChange={e => setRelationship(e.target.value)}
    required
  />
        <button type="submit">{selectedUserId ? 'Update' : 'Add User'}</button>
      </form>
    </>
  );
}

export default User;
