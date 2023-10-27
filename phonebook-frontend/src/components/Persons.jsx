import Person from "./Person";
const Persons = ({ 
  nameFilter, 
  persons,
  handleDeletePerson
}) => {
  const castInsensitiveNameFilter = nameFilter.trim().toLowerCase();
  return (
    <ul style={{ listStyle: "none" }}>
      {persons
        .filter((p) =>
          p.name.trim().toLowerCase().includes(castInsensitiveNameFilter)
        )
        .map((person) => (
          <Person key={person.id} person={person} handleDeletePerson={handleDeletePerson}/>
        ))}
    </ul>
  );
};
export default Persons;
