import { useParams } from 'react-router-dom';

export default function FarmGridStackOverview() {
  const { deviceId } = useParams();

  console.log("Device ID from params:", deviceId);


  return <div>คุณกำลังดูอุปกรณ์: {deviceId}</div>;
}