// pages/records.js
import { useState, useEffect } from 'react';

export default function Records() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/birthcert')
            .then((response) => response.json())
            .then((data) => {
                setRecords(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading records...</p>;
    if (records.length === 0) return <p>No records found.</p>;

    const handleDownloadCsv = () => {
        window.location.href = '/api/birthcert/csv';
    };

    return (
        <div>
            <h1>Birthcert</h1>
            <button onClick={handleDownloadCsv}>Download CSV</button>
            <table>
                <thead>
                    <tr>
                        <th>Proposal</th>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Gender</th>
                        <th>DOB</th>
                        <th>MotherName</th>
                        <th>MotherId</th>
                        <th>FatherName</th>
                        <th>FatherId</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => (
                        <tr key={record.id}>
                            <td>{record.proposal}</td>
                            <td>{record.name}</td>
                            <td>{record.idNumber}</td>
                            <td>{record.gender}</td>
                            <td>{record.dob}</td>
                            <td>{record.motherName}</td>
                            <td>{record.motherId}</td>
                            <td>{record.fatherName}</td>
                            <td>{record.fatherId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
