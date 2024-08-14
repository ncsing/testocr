// pages/records.js
import { error } from 'console';
import { useState, useEffect } from 'react';

export default function Records() {
    const [groupList, setGroupList] = useState([]);
    const [group, setGroup] = useState('');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log(groupList, group, records, loading);

    const fetchRecords = async (group) => {
        const records = await fetch(`/api/birthcert/${group}`)
        const recordsData = await records.json()
        setRecords(recordsData)
    }

    useEffect(() => {
        async function fetchGroupData() {
            const groups = await fetch('/api/birthcert')
            const groupsData = await groups.json()
            setGroupList(groupsData)

            if (groupsData.length > 0) {
                const group = groupsData[0]
                setGroup(group)
            }

            setLoading(false)
        }
        fetchGroupData()
            .catch((error) => {
                console.error('Error fetching Group data: ', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setLoading(true)
        fetchRecords(group)
        .then(() => setLoading(false))
        .catch((error) => {
            console.error('Error fetching records: ', error);
            setLoading(false);
        })
    }, [group])

    if (loading) return <p>Loading records...</p>;
    if (records.length === 0) return <p>No records found.</p>;

    const handleGroupChange = (event) => {
        const group = event.target.value;
        setGroup(group);
    };

    const handleDownloadCsv = (group) => () => {
        window.location.href = `/api/birthcert/csv/${group}`;
    };

    return (
        <div>
            <h1>Birthcert</h1>
            <select onChange={handleGroupChange} value={group}>
                {groupList.map((group) => (
                    <option key={group} value={group}>
                        {group}
                    </option>
                ))}
            </select>
            <button onClick={handleDownloadCsv(group)}>Download CSV</button>
            <RecordTable records={records} loading={loading} />
        </div>
    );
}

function RecordTable ({ records, loading }) {
    if (loading) return <p>Loading records...</p>;
    if (records.length === 0) return <p>No records found.</p>;
    return (
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
                            <td>{record.id_number}</td>
                            <td>{record.gender}</td>
                            <td>{record.dob}</td>
                            <td>{record.mother_name}</td>
                            <td>{record.mother_id}</td>
                            <td>{record.father_name}</td>
                            <td>{record.father_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    )
};
