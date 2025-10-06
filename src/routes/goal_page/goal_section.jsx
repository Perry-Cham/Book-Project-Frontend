import { useState, useEffect } from "react";
import Modal from "../../components/modal"
import axios from "axios";

function Goal_Section({ props, bookProps }) {
  const { openModal, api, modalState, setModalState } = props;
  const { cbooks } = bookProps;
  const [goal, setGoal] = useState();

  useEffect(() => {
    getGoal()
  }, [])
  useEffect(() => {
    getGoal()
  }, [cbooks])

  async function getGoal() {
    try {
      const response = await axios.get(`${api}/getgoal`, {
        withCredentials: true
      });
      if (response.status == 200) {
        const goal = response.data;

        if (!goal.goal.complete) {
          const currPages = goal.currentBooks.reduce((a, b) => a + b.page, 0)
          const tpage = goal.currentBooks.reduce((a, b) => a + b.pageCount, 0)
          goal.pagesRead = currPages;
          goal.totalPages = tpage;
          goal.pageView = true;
          setGoal(response.data)
        } else {
          alert("Congratulations, you've just completed your reading goal! Cheers to you!")
          setGoal(undefined)
        }
      } else { setGoal(undefined) }
    } catch (err) {
      console.error(err)
      setGoal(undefined)
    }
  }

  async function handleGoal(data) {
    try {
      console.log(data)
      const response = await axios.post(`${api}/setgoal`, data, {
        withCredentials: true
      })
      if (response.status == 200) {
        alert("Congratulations you've just started a new goal. Happy Reading")
        getGoal()
      }
      else {
        alert('Error adding book')
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete(id) {
    try {
      const response = await axios.delete(`${api}/deletegoal/${id}`, { withCredentials: true })
      if (response.status === 200) { alert('goal has been deleted') }
      getGoal()
    } catch (err) {
      console.err(err)
    }
  }

  return (
    <section className="mx-1 my-2 bg-white rounded-sm py-4 px-2">
      {modalState.open && <Modal modalState={modalState} setModalState={setModalState} />}
      <h2 className="font-medium text-lg">Reading Goals</h2>
      {goal ?
        <div>
          <p>Books to read: {goal.goal.numberOfBooks}</p>
          {goal.pageView ?
            <div>
              <input type="range" value={goal.pagesRead} max={goal.totalPages} />
              <p>{goal.pagesRead || 0} / {goal.totalPages || 0}</p>
              <p>{Math.ceil((goal.pagesRead / goal.totalPages) * 100) || 0}% complete {goal.pageView ? `of ${goal.currentBooks.length} book(s)` : ""}</p>
            </div>
            :
            <div>
              <input type="range" value={goal.goal.booksRead.length} max={goal.goal.numberOfBooks} />
              <p>{goal.goal.booksRead.length} / {goal.goal.numberOfBooks}</p>
              <p>{(goal.goal.booksRead.length / goal.goal.numberOfBooks) * 100}% complete </p>
            </div>
          }

          <button className="btn-primary" onClick={() => { goal.pageView ? setGoal({ ...goal, pageView: false }) : setGoal({ ...goal, pageView: true }) }}>
            {goal.pageView ? "Switch To Book View" : "Switch To Page View"}</button>

          <p>
            Ending On: {
              (() => {
                const end = new Date(goal.goal.endDate);
                return `${end.getDate()}-${end.getMonth() + 1}-${end.getFullYear()}`;
              })()
            }
          </p>
          <p>{goal.daysLeft} days left</p>
          <button onClick={() => { handleDelete(goal.goal._id) }} className="border-2 border-red-600 py-1 px-2 mt-2">Delete Goal</button>
        </div> :
        <div>
          <p>Build a reading habit by setting a reading goal. Once you set one it'll appear here</p>
          <button className="btn-primary mt-3" onClick={() => openModal("", "setGoal", handleGoal)}>Set Goal</button>
        </div>
      }
    </section>
  )
}

export default Goal_Section;