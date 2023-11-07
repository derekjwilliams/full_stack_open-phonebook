const Person = ({ 
  person, 
  handleDeletePerson }
) => {
  return (
    <li>
      {person.name} {person.phoneNumber}
      <button onClick={() => handleDeletePerson(person)}>delete</button>
    </li>
  );
};

export default Person;
