import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

export default function ManageCandidates(): JSX.Element {
  const [candidates, setCandidates] = useState<any[]>([]);

  //  hooks
  useEffect(() => {
    axios
      .get('https://localhost:8080/api/v1/candidates')
      .then((response) => {
        const candidatesWithKeys = response.data.data.result.map((el: any) => ({
          ...el,
          key: uuid(),
        }));
        setCandidates(candidatesWithKeys);
      })
      .catch((error) => {
        console.error(error instanceof Error ? error.message : error);
      });
  }, []);

  //  display
  return (
    <div id='manage-candidates-container'>
      <h2>candidates container</h2>
      <table>
        <tbody>
          {candidates.map((el: any) => (
            <tr key={el.key}>
              <td>{el.first_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
