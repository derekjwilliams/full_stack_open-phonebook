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

  const notficationDuration = 5000; //milliseconds
  useEffect(() => {
    personService.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const clearInputs = () => {
    setNewName('');
    setNewPhoneNumber('');
  };

  const handleAddPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      phoneNumber: newPhoneNumber
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
      .catch(error => {// check for 422, if that is the case then get the resource by name and use the id send PUT to the existing resource
        if (error.response.status === 422) {
          if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
              const changedPerson = {
                name: newName,
                phoneNumber: newPhoneNumber
              };
              
              personService.updateUsingLocation(error.response.headers.location, changedPerson).then((personResult) => {
                setPersons(persons.map(person => person.id !== personResult.id ? person : personResult))
                setNotificationKind('success')
                setNotificationMessage(
                  `Updated ${changedPerson.name}`
                )
                setTimeout(() => {
                  setNotificationMessage(null)
                }, notficationDuration)
                clearInputs('')
              })
          } else {
            alert(`${newName} is already in phonebook`);
          }
        }
        else {
          setNotificationKind('error')
          setNotificationMessage(
            `${error.response.data.error}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, notficationDuration)
        }
      })
  }

  const handleDeletePerson = (person) => {
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
      <Notification message={notificationMessage} kind={notificationKind} />
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
