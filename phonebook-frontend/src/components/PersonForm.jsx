const PersonForm = ({
  newName,
  handleAddPerson,
  handleNameChange,
  newPhoneNumber,
  handlePhoneNumberChange,
}) => {
  return (
    <form onSubmit={handleAddPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number:{" "}
        <input value={newPhoneNumber} onChange={handlePhoneNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
