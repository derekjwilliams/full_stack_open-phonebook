const Filter = ({ nameFilter, handleNameFilterChange }) => {
  return (
    <div>
    filter: <input value={nameFilter} onChange={handleNameFilterChange} />
  </div>
  );
};

export default Filter;
