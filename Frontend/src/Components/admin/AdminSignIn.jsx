import React from "react";
import { useNavigate } from "react-router-dom";

function AdminSignIn() {
    const navigate = useNavigate();
    const [adminUser, setAdminUser] = React.useState({ username: '', password: '' });
    const [error, setError] = React.useState('');
    //const [adminIsOn,setadminIsOn] = React.useState(false)

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        if (adminUser.username === 'admin' && adminUser.password === 'admin123') {
            setError('');
            localStorage.setItem('adminIsOn','true')
            navigate('/admin/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div>
            <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">

                <form
                    onSubmit={handleAdminLogin}
                    className="bg-white rounded-xl shadow-xl p-8 w-[90%] max-w-sm"
                >
                    <h2 className="text-2xl font-semibold text-center text-[#5D6BFF] mb-6">
                        Admin Login
                    </h2>

                    {error && (
                        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                    )}

                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={adminUser.username}
                            onChange={(e) => setAdminUser({ ...adminUser, username: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D6BFF]"
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={adminUser.password}
                            onChange={(e) => setAdminUser({ ...adminUser, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D6BFF]"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#5D6BFF] text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
export default AdminSignIn;