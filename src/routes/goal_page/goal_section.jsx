import { useState } from "react";
import axios from "axios";
function Goal_Section({ goal, getGoal }) {
    const [goal, setGoal] = useState();
    async function getGoal() {
        try {
            const response = await axios.get(`${api}/getgoal`, {
                withCredentials: true
            });
            console.log(response)
            if (response.status == 200) {
                const goal = response.data;
                const spages = goal.currentBooks.reduce((a, b) => a + b.page, 0)
                const tpage = goal.currentBooks.reduce((a, b) => a + b.pageCount, 0)
                goal.pagesRead = spages;
                goal.totalPages = tpage;
                goal.pageView = false;
                setGoal(response.data)
            } else { setGoal(undefined) }
        } catch (err) {
            console.error(err)
            setGoal(undefined)
        }
    }

    async function handleGoal(data) {
        console.log(data)
        try {
            const response = await axios.post(`${api}/setgoal`, data, {
                withCredentials: true
            })
            if (response.status == 200) {
                alert("Congratulations you've just started a new goal. Happy Reading")
            }
            else {
                alert('Error adding book')
                console.log(response)
            }
        } catch (err) {
            console.error(err)
        }
    }


    return (
        <section>
{modalState.open && <Modal modalState={modalState} />}   
            <h2>Reading Goals</h2>
            {goal ?
                <div>
                    <p>Books to read: {goal.goal.numberOfBooks}</p>
                    {goal.pageView ?
                        <div>
                            <input type="range" value={goal.pagesRead} max={goal.totalPages} />
                            <p>{goal.pagesRead} / {goal.totalPages}</p>
                            <p>{Math.ceil((goal.pagesRead / goal.totalPages) * 100)}% complete {goal.pageView ? `of ${goal.currentBooks.length} book(s)` : ""}</p>
                        </div>
                        :
                        <div>
                            <input type="range" value={goal.goal.booksRead.length} max={goal.goal.numberOfBooks} />
                            <p>{(goal.goal.booksRead.length / goal.goal.numberOfBooks) * 100}% complete </p>
                        </div>

                    }

                    <button className="btn-primary" onClick={() => { goal.pageView ? setGoal({ ...goal, pageView: false }) : setGoal({ ...goal, pageView: true }) }}>Switch to pages view</button>

                    <p>
                        Ending On: {
                            (() => {
                                const end = new Date(goal.goal.endDate);
                                return `${end.getDate()}-${end.getMonth() + 1}-${end.getFullYear()}`;
                            })()
                        }
                    </p>
                    <p>{goal.daysLeft} days left</p>
                    <button className="border-2 border-red-600 py-1 px-2 mt-2">Delete Goal</button>
                    <button className="btn-secondary">Edit Goal</button>
                </div> :
                <div>
                    <p>Build a reading habit by setting a reading goal. Once you set one it'll appear here</p>
                    <button className="btn-primary" onClick={() => openModal("", "setGoal", handleGoal)}>Set Goal</button>
                </div>
            }
        </section>
    )
}

export default Goal_Section;