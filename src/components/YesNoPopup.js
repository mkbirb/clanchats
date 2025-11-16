// A Windows Popup Message that provides a Yes or No Option to the user

const YesNoPopup = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onConfirm()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={() => onCancel()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default YesNoPopup;