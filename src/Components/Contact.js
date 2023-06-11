import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faGlobe, faGenderless } from '@fortawesome/free-solid-svg-icons';

function Contact() {
  const [contact, setContact] = useState([]);
  const [pers, setPers] = useState('');
  const [user_id, setUser_id] = useState('');
  const [org, setOrg] = useState('');
  const [nationality, setNationality] = useState('');
  const [gender, setGender] = useState('');
  const [selectedConId, setSelectedConId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9292/contacts")
      .then(res => res.json())
      .then(data => setContact(data));
  }, []);

  const sortedContact = contact.slice().sort((a, b) => {
    const nameA = a.nickname || '';
    const nameB = b.nickname || '';
    return nameA.localeCompare(nameB);
  });

  function addContact() {
    const newContact = {
      nickname: pers,
      user_id: user_id,
      organization: org,
      nationality: nationality,
      gender: gender
    };

    fetch("http://localhost:9292/contacts", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContact)
    })
      .then(res => res.json())
      .then(data => {
        setContact(prevCont => [...prevCont, data]);
        setPers('');
        setUser_id('');
        setOrg('');
        setNationality('');
        setGender('');
      })
      .catch(error => console.error(error));
  }

  function editContact(contactId) {
    setSelectedConId(contactId);
    const selectedCont = contact.find(con => con.id === contactId);
    setPers(selectedCont.nickname);
    setUser_id(selectedCont.user_id);
    setOrg(selectedCont.organization);
    setNationality(selectedCont.nationality);
    setGender(selectedCont.gender);
  }

  function updateContact() {
    const updatedCon = {
      nickname: pers,
      user_id: user_id,
      organization: org,
      nationality: nationality,
      gender: gender
    };
    fetch(`http://localhost:9292/contacts/${selectedConId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCon)
    })
      .then(res => res.json())
      .then(data => {
        setContact(prevCont => {
          return prevCont.map(ct => {
            if (ct.id === data.id) {
              return { ...ct, ...data };
            }
            return ct;
          });
        });
        setSelectedConId(null);
        setPers('');
        setUser_id('');
        setOrg('');
        setNationality('');
        setGender('');
      })
      .catch(error => console.error(error));
  }

  function deleteContact(conId) {
    fetch(`http://localhost:9292/contacts/${conId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        setContact(prevCont =>
          prevCont.filter(user => user.id !== conId)
        );
      })
      .catch(error => console.error(error));
  }

  function toggleContactDetails(contactId) {
    setSelectedConId(prevId => (prevId === contactId ? null : contactId));
    setPers('');
    setUser_id('');
    setOrg('');
    setNationality('');
    setGender('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (selectedConId) {
      updateContact();
    } else {
      addContact();
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit} className="beaut">
          <input type="text" placeholder="Nickname/Name" value={pers || ''} onChange={e => setPers(e.target.value)} />
          <input type="text" placeholder="User ID" value={user_id || ''} onChange={e => setUser_id(e.target.value)} />
          <input type="text" placeholder="Organization" value={org || ''} onChange={e => setOrg(e.target.value)} required/>
          <input type="text" placeholder="Nationality(optional)" value={nationality || ''} onChange={e => setNationality(e.target.value)} />
          <input type="text" placeholder="Gender" value={gender || ''} onChange={e => setGender(e.target.value)} required/>
          <button type="submit">{selectedConId ? 'Update Details' : 'Add Details'}</button>
        </form>
      </div>
      {sortedContact.length > 0 && sortedContact.map((cn) => (
        <div className='contact' key={cn.id}>
          <p onClick={() => toggleContactDetails(cn.id)}>{cn.nickname}</p>
          {selectedConId === cn.id && (
            <div className='contact-details'>
             <p><FontAwesomeIcon icon={faUser} /> {cn.user_id}</p>
       <p><FontAwesomeIcon icon={faBuilding} /> {cn.organization}</p>
       <p><FontAwesomeIcon icon={faGlobe} /> {cn.nationality}</p>
       <p><FontAwesomeIcon icon={faGenderless} /> {cn.gender}</p>
              <button onClick={() => editContact(cn.id)}>Edit</button>
              <button onClick={() => deleteContact(cn.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
export default Contact;
