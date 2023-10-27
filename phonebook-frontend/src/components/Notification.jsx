const Notification = ({ message, kind }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`notification ${kind}`}>
      {message}
    </div>
  )
}

export default Notification;