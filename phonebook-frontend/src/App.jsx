import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationKind, setNotificationKind] = useState('notification')

  const notficationDuration = 5000; //ms
  useEffect(() => {
    personService.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const clearInputs = () => {
    setNewName('');
    setNewPhoneNumber('');
  };
  
  /**
   * returns the next id, finds the largest id and adds 1 to get the next id
   */
  const getNextId =() => {
    return persons.reduce((a,b)=> (a.id > b.id)? a : b).id + 1
  };

  const handleAddPerson = (event) => {
    event.preventDefault();
    const person = persons.find((person) => person.name === newName)
    if (person === undefined) {
      const newPerson = {
        name: newName,
        number: newPhoneNumber,
        id: getNextId()
      };

      personService.create(newPerson).then((person) => {
        setPersons(persons.concat(person))
        setNotificationKind('success')
        setNotificationMessage(
          `Added ${person.name}`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, notficationDuration)
        clearInputs('')
      })
      .catch(error => {
        setNotificationKind('error')
        setNotificationMessage(
          `The person '${person.name}' could not be added`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, notficationDuration)
      })
    }
    //Information of Edger Dijkstra has already been removed from server
    else if (window.confirm(`${person.name} is already added to the phonebook, replace the old number with a new one?`)) {
      const changedPerson = {
        name: person.name,
        number: newPhoneNumber,
        id: person.id
      };
      personService.update(person.id, changedPerson).then((personResult) => {
        setPersons(persons.map(p => p.id !== person.id ? p : personResult))
        setNotificationKind('success')
        setNotificationMessage(
          `Updated ${person.name}`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, notficationDuration)
        clearInputs('')
      })
      .catch(error => {
        console.error('status', error.response.status);
        const message = error.response.status === 404 ?
        `Information of '${person.name}' has already been removed from server` :
        `Error updating '${person.name}' error code from server is ${error.response.status}`
        setNotificationKind('error')
        setNotificationMessage(
          message
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, notficationDuration)
      })
    }
    else {
      alert(`${newName} is already in phonebook`);
    }
  };

  const handleDeletePerson=(person) => {
    if (window.confirm(`Do you really want to delete ${person.name}?`)) {
      const id = person.id
      personService.deleteById(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
        setNotificationKind('success')
        setNotificationMessage(
          `Deleted ${person.name}`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, notficationDuration)
      })
      .catch(error => {
        setNotificationKind('error')
        setNotificationMessage(
          `'${person.name}' was not found on the server`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, notficationDuration)
      })
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setNewPhoneNumber(event.target.value);
  };

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} kind={notificationKind}/>
      <Filter
        nameFilter={nameFilter}
        handleNameFilterChange={handleNameFilterChange}
      />
      <h3>Add a new entry</h3>
      <PersonForm
        newName={newName}
        handleAddPerson={handleAddPerson}
        handleNameChange={handleNameChange}
        newPhoneNumber={newPhoneNumber}
        handlePhoneNumberChange={handlePhoneNumberChange}
      />
      <h3>Numbers</h3>
      <Persons 
        nameFilter={nameFilter} 
        persons={persons} 
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
