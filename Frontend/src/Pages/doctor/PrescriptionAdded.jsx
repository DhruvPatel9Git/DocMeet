import React from 'react';
import { Link } from 'react-router-dom';

function PrescriptionAdded() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="bg-white p-10 rounded shadow-md text-center">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">Prescription Added Successfully!</h2>
                <Link to="/add-prescription">
                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Add Another
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default PrescriptionAdded;
