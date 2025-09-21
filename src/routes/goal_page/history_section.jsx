import { useState, useEffect } from 'react';
import {format} from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line} from 'react-chartjs-2';
import axios from 'axios'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function History_Section({ cbooks }) {
  const [history, setHistory] = useState(null);
  const [chartData, setChartData] = useState(null)
  const api = import.meta.env.VITE_API

  useEffect(() => {
    getData()
    if (history) {
      processReadingData();
    }
       async function getData(){
         try{
           const response = await axios.get(`${api}/gethistory`,{
          withCredentials:true
        })
        setHistory(response.data)
         }catch(err){
           console.error(err)
         }
        
      }
      
  },[]);

console.log(api)

  const processReadingData = () => {
    // Get current week (Sunday to Saturday)
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Saturday

const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Initialize data array with zeros
    const pagesRead = new Array(7).fill(0);
    //Create chart data
    for(const entry of history){
      const entryDate = new Date(entry.date)
      const entryDay = String(format(entryDate, 'eee')).toLowerCase()
    for(const Day of labels){
      if(Day.toLowerCase() == entryDay){
       const i = labels.indexOf(Day)
       pagesRead[i] = entry.numberOfPages;
      }
    }
    }
    

console.log(pagesRead)
    // Prepare chart data
    const data = {
      labels:labels,
      datasets: [
        {
          label: 'Pages Read',
          data: pagesRead,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
      ],
    };

    setChartData(() => data);
  };

  const options = {
    maintainAspectRatio:false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pages Read This Week',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Pages',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Day',
        },
      },
    },
  };
  
  return (
    <section>
      <h2>Reading History</h2>
      {chartData ? (
        <div className="h-[45vh]">
          <Line  options={options} data={chartData} />
        </div>
      ) : (
        <div>
          <p>You haven't started reading anything yet. You'll see how many pages you've read over the past week here.</p>
        </div>
      )}
    </section>
  );
}

export default History_Section;