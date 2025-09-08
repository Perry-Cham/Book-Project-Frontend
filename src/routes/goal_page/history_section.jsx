  import {useState, useEffet} from 'react'
   function History_Section({}) {
    return( <section>
        <h2>Reading History</h2>
        {false ? <div>
          <p>placeholder</p>
        </div> :
          <div>
            <p>You havent started reading anything yet. You'll see how many pages you've read over past week here</p>
          </div>}
      </section>)
   }
  
   export default History_Section;