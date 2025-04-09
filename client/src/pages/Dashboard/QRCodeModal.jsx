import React from 'react';
import ReactQR from 'react-qr-code';  // Importing the correct component from the library

const QRCodeModal = ({ shortUrl, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">QR Code for: {shortUrl}</h2>
        <ReactQR value={shortUrl} size={256} />
        <br />
        <button
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
